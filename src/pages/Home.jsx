import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import { grayColor } from "../constants/colors";

const Home = () => {
  return (
   <Box bgcolor={grayColor} height={"100%"} sx={{
    height:"100%" , justifyContent:"center" , alignItems:"center"
   }}>
     <Typography pt={"20rem"} pl={{xs:"5rem" , sm:"20%" , lg:"40%"}} variant="h5" textAlign={"cemter"}
    > Select a friend to Chat</Typography>
   </Box>
  )
  
};
export default AppLayout()(Home);
