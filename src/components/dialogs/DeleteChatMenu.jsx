import { Delete, ExitToApp } from '@mui/icons-material';
import { Menu, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteGroupMutation, useLeaveGroupMutation } from '../../redux/api/api';
import { setIsDeleteMenu } from '../../redux/reducers/misc';
import { useSelector } from 'react-redux';
import { useAsyncMutation } from '../../hooks/hook';

const DeleteChatMenu = ({dispatch , deleteOptionAnchor}) => {
    const navigate = useNavigate();

    const { isDeleteMenu, selectedDeleteChat } = useSelector(
      (state) => state.misc
    );
    const [deleteChat, _, deleteChatData] = useAsyncMutation(
        useDeleteGroupMutation
      );
    
      const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
        useLeaveGroupMutation
      );
    
      const isGroup = selectedDeleteChat.groupChat;
      
      const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteOptionAnchor.current = null;
      };
    
      const leaveGroupHandler = () => {
        closeHandler();
        leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
      };
    
      const deleteChatHandler = () => {
        console.log("chatId",selectedDeleteChat.chatId)
        deleteChat("Deleting Chat...", selectedDeleteChat.chatId);
        closeHandler();
      };
    
      useEffect(() => {
        if (deleteChatData || leaveGroupData) navigate("/");
      }, [deleteChatData, leaveGroupData]);
    
  return (
    <Menu open={isDeleteMenu} onClose={closeHandler}  anchorEl={deleteOptionAnchor.current}
     anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
          <Stack
        sx={{
          width: "10rem",
          padding: "0.5rem",
          cursor: "pointer",
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
      >
        {isGroup ? (
          <>
            <ExitToApp />
            <Typography>Leave Group</Typography>
          </>
        ) : (
          <>
            <Delete />
            <Typography>Delete Chat</Typography>
          </>
        )}
      </Stack>
    </Menu>
  )
}

export default DeleteChatMenu