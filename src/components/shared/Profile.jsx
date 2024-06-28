import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import { Face, AlternateEmail, CalendarMonth } from "@mui/icons-material";
import moment from "moment";

const Profile = ({ user }) => {
  const url = user?.avatar?.url;
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        src={url}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard
        heading={"User Name"}
        text={user?.username}
        Icon={<AlternateEmail />}
      />
      <ProfileCard heading={"Name"} text={user?.name} Icon={<Face />} />
      <ProfileCard
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
        Icon={<CalendarMonth />}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"1rem"}
      color="white"
      textAlign={"center"}
    >
      {Icon && Icon}
      <Stack>
        <Typography variant="body1">{text}</Typography>
        <Typography color={"grey"} variant="caption">
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Profile;
