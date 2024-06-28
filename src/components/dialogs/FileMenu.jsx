import {
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Tooltip,
} from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploaderLoading } from "../../redux/reducers/misc";
import { AudioFile, Image, UploadFile, VideoFile } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSendAttachementsMutation } from "../../redux/api/api";

const FileMenu = ({ anchorE1, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const closeHandler = () => {
    dispatch(setIsFileMenu(false));
  };

  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachements] = useSendAttachementsMutation();

  const selectRef = (ref) => {
    ref.current.click();
  };

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) {
      return;
    }
    if (files.length > 5) {
      toast.error("You Can only  send 5 items at a a time");
    }
    dispatch(setUploaderLoading(true));
    //fetching here
    const toastId = toast.loading(`Sending ${key}...`);
    closeHandler();
    try {
      const myForm = new FormData();
      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));
      const res = await sendAttachements(myForm);
      if (res.data) {
        toast.success(`${key} sent successfully`, {
          id: toastId,
        });
      } else {
        toast.error(`${key} sending failed`, {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploaderLoading(false));
    }
  };
  return (
    <Menu open={isFileMenu} anchorEl={anchorE1} onClose={closeHandler}>
      <div
        style={{
          width: "10rem",
        }}
      >
        <MenuList>
          <MenuItem onClick={() => selectRef(imageRef)}>
            <Tooltip title="Image">
              <IconButton>
                <Image />
              </IconButton>
            </Tooltip>
            <ListItemText
              style={{
                marginLeft: "0.5rem",
              }}
            >
              Image
            </ListItemText>
            <input
              type="file"
              multiple
              accept="image/png , image/jpeg , image/gif"
              style={{
                display: "none",
              }}
              ref={imageRef}
              onChange={(e) => fileChangeHandler(e, "Images")}
            />
          </MenuItem>

          <MenuItem onClick={() => selectRef(audioRef)}>
            <Tooltip title="Audio">
              <IconButton>
                <AudioFile />
              </IconButton>
            </Tooltip>
            <ListItemText
              style={{
                marginLeft: "0.5rem",
              }}
            >
              Audio
            </ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mpeg,audio/wav"
              style={{
                display: "none",
              }}
              ref={audioRef}
              onChange={(e) => fileChangeHandler(e, "Audios")}
            />
          </MenuItem>

          <MenuItem onClick={() => selectRef(videoRef)}>
            <Tooltip title="Video">
              <IconButton>
                <VideoFile />
              </IconButton>
            </Tooltip>
            <ListItemText
              style={{
                marginLeft: "0.5rem",
              }}
            >
              Video
            </ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4 , video/webm , video/ogg"
              style={{
                display: "none",
              }}
              ref={videoRef}
              onChange={(e) => fileChangeHandler(e, "Videos")}
            />
          </MenuItem>

          <MenuItem onClick={() => selectRef(fileRef)}>
            <Tooltip title="File">
              <IconButton>
                <UploadFile />
              </IconButton>
            </Tooltip>
            <ListItemText
              style={{
                marginLeft: "0.5rem",
              }}
            >
              File
            </ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{
                display: "none",
              }}
              ref={fileRef}
              onChange={(e) => fileChangeHandler(e, "Files")}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
