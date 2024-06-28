import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import { lightBlue } from "../../constants/colors";
import { fileFormat, transformImage } from "../../lib/Features";

import moment from "moment";
import { FileOpen } from "@mui/icons-material";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachements = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: "-100%",
      }}
      whileInView={{
        opacity: 1,
        x: "0",
      }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography variant="caption" color={lightBlue} fontWeight={600}>
          {" "}
          {sender.name}
        </Typography>
      )}
      {content && <Typography> {content}</Typography>}
      {attachements.map((attachment, index) => {
        const url = attachment.url;
        const file = fileFormat(url);
        return (
          <Box key={index}>
            <a
              href={url}
              target="_blank"
              download
              style={{
                color: "black",
              }}
            >
              {file === "image" && (
                <img
                  src={url}
                  alt="attachement"
                  width={"200px"}
                  height={"150px"}
                  style={{
                    objectFit: "contain",
                  }}
                />
              )}
              {file === "audio" && <audio src={url} preload="none" controls />}
              {file === "video" && (
                <video src={url} preload="none" width={"200px"} controls />
              )}
              {file == "file" && <FileOpen />}
            </a>
          </Box>
        );
      })}

      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
