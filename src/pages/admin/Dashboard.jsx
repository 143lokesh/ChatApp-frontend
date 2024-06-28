import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  AdminPanelSettings,
  Group,
  Message,
  Notifications,
  Person,
} from "@mui/icons-material";
import moment from "moment";
import {
  CurveButton,
  SearchField,
} from "../../components/styles/styledComponent";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import { useFetchData } from "6pp";
import { server } from "../../constants/route";
 import {useErrors} from "../../hooks/hook"
const Dashboard = () => {
  
   const {loading , data , error,refetch}=useFetchData(`${server}/api/v1/admin/stats` , "dashboard-stats")
   console.log(data)
   const {message} = data || {}

   const groupChatsCount = 0
   useErrors([{
    isError:error,
    error:error
   }])
  const AppBar = (
    <Paper
      elevation={3}
      sx={{
        padding: "2rem",
        margin: "2rem 0",
        borderRadius: "1rem",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <AdminPanelSettings sx={{ fontSize: "3rem" }} />
        <SearchField type="text" placeholder='"Search...' />
        <CurveButton>Search</CurveButton>
        <Box flexGrow={1} />
        <Typography
          sx={{
            display: {
              xs: "none",
              lg: "black",
            },
            color: "rgba(0,0,0,0.7)",
            textAlign: "center",
          }}
        >
          {moment().format(" dddd ,MMMM DD YYYY")}
        </Typography>
        <Notifications />
      </Stack>
    </Paper>
  );
  const widgets = (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      marginTop={"1rem"}
      spacing={"2rem"}
      justifyContent={"space-between"}
      alignItems={"center"}
      margin={"2rem , 0"}
    >
       <Widget title={"Users"} value={message?.usersCount} Icon={<Person />} />
      <Widget title={"Chats"} value={message?.totalChatsCount} Icon={<Group />} />
      <Widget title={"Messages"} value={message?.messagesCount} Icon={<Message />} /> 
    </Stack>
  );
  return loading ? ( <Skeleton height={"100vh"} />)  : (
    <AdminLayout>
      <Container component={"main"}>
        {AppBar}
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          spacing={"2rem"}
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "2rem 3.5rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
            }}
          >
            <Typography>Last Messages</Typography>
            <LineChart value={message?.messagesChart || [] } />
          </Paper>
          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              borderRadius: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", sm: "50%" },
              position: "relative",
              width: "100%",
              maxWidth: "25rem",
            }}
          >
            <DoughnutChart
              value={[
                message?.totalChatsCount - message?.groupsCount ,
                 message?.groupsCount||0 ]}
              labels={["single Chat", "Group Chat"]}
            />
            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"0.5rem"}
              width={"100%"}
              height={"100%"}
            >
              <Group /> <Typography>Vs</Typography>
              <Person />
            </Stack>
          </Paper>
        </Stack>

        {widgets}
      </Container>
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: "2rem",
        margin: "2rem 0",
        borderRadius: "1.5 rem",
        width: "20rem",
      }}
    >
      <Stack alignItems={"center"} spacing={"1rem"}>
        <Typography
          sx={{
            color: "rgba(0,0,0,0.7)",
            borderRadius: "50%",
            border: "5px solid rgba(0,0,0,0.9)",
            width: "5rem",
            height: "5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {value}
        </Typography>
        <Stack>
          {Icon}
          <Typography>{title}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Dashboard;
