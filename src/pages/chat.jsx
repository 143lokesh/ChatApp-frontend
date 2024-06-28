import React, { useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { grayColor } from "../constants/colors";
import { AttachFile, Send } from "@mui/icons-material";
import { InputBox } from "../components/styles/styledComponent";
import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import { ALERT, CHAT_JOINED, CHAT_LEFT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants/events";
import { useGetChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewmessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loader";
import { useNavigate } from "react-router-dom";


const Chat = ({ chatId, user }) => {
  const socket = getSocket();
  const containerRef = useRef(null);
  const fileMenuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [iamTyping, setImTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const chatDetails = useGetChatDetailsQuery({ chatId, skip: !chatId });
  const members = chatDetails?.data?.chat?.members;
  
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk?.data?.messages
  );
  useEffect(() => {
    if(members){
      socket.emit(CHAT_JOINED ,{userId:user._id , members})
    }
    dispatch(removeNewmessagesAlert(chatId));

    return () => {
      setMessages([]), setOldMessages([]);
      setPage(1);
      setMessage("");
      if(members){
        socket.emit(CHAT_LEFT,{userId:user._id , members})
      }
    };
  }, [chatId , members]);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages,bottomRef]);

  useEffect(()=>{
      if(chatDetails.data && !chatDetails.data?.chat){
        return navigate("/")
      }
  } ,[chatDetails.data])
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const messageChange = (e) => {
    setMessage(e.target.value);
    if (!iamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setImTyping(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setImTyping(false);
    }, 2000);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }
    socket.emit(NEW_MESSAGE, {
      chatId,
      members,
      message,
    });
    setMessage("");
  };

  const newMessagesHandler = useCallback(
    (data) => {
      if (data?.chatId !== chatId) return;
      setMessages((prev) => [...prev, data?.message]);
    },
    [chatId]
  );
  const startTypingListner = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListner = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(false);
    },
    [chatId]
  );
  const alertListner =useCallback((data)=>{
    if (data.chatId !== chatId) return;
    const messageForAlert = {
      content: data.message,
      sender: {
        _id: Math.random()*123456789,
        name:"Admin",
      },
      chat: data.chatId,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev)=>[...prev , messageForAlert])
  },[chatId])

  const eventHandlers = {
    [NEW_MESSAGE]: newMessagesHandler,
    [START_TYPING]: startTypingListner,
    [STOP_TYPING]: stopTypingListner,
    [ALERT]:alertListner
  };

  useSocketEvents(socket, eventHandlers);
  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        {allMessages.map((message, index) => (
          <MessageComponent key={index} message={message} user={user} />
        ))}
        {
          userTyping && <TypingLoader/>
        }
        <div ref={bottomRef}/>
         
      </Stack>
      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            ref={fileMenuRef}
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
            onClick={handleFileOpen}
          >
            <AttachFile />
          </IconButton>
          <InputBox
            placeholder="Type message here"
            value={message}
            onChange={messageChange}
          />
          <IconButton
            type="submit"
            sx={{
              backgroundColor: "orange",
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error-dark",
              },
            }}
          >
            <Send />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </>
  );
};

export default AppLayout()(Chat);
