import React, { memo } from "react";
import { Link } from "../styles/styledComponent";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      sx={{
        padding: "0",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: index * 0.1,
        }}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          gap: "1rem",
          position: "relative",
          marginLeft: "1rem",
          backgroundColor: sameSender ? "black" : "white",
          borderBottom: "1px solid #f0f0f0",
          color: sameSender ? "white" : "black",
        }}
      >
        <AvatarCard avatar={avatar} />
        <Stack>
          <Typography sx={{ color: sameSender ? "white" : "black" }}>
            {name}{" "}
          </Typography>
          {newMessageAlert && (
            <Typography>{newMessageAlert.count} New Message</Typography>
          )}
        </Stack>

        {isOnline && !groupChat && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          ></Box>
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
