
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const Notifications = () => {
  const dispatch = useDispatch()
  const {isNotification} = useSelector(state => state.misc)
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const  [acceptRequest] = useAcceptFriendRequestMutation()
  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false))
      try {
         const res = await acceptRequest({requestId:_id , accept})
         if(res.data?.success){
          console.log("Use Socket Here" , res.data)
          toast.success(res.data?.message )
         }
         else{
           toast.error(res.data?.error || "Something went Wrong")
         }
      } catch (error) {
        toast.error("Something went Wrong");
        console.log(error)
      }
  };

  useErrors([{ error, isError }]);
  const onCloseHandler =()=>{
     dispatch(setIsNotification(false));
  }

  return (
    <Dialog open={isNotification}  onClose={onCloseHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.message?.length > 0 ? (
              data.message.map((i) => (
                <NotificationItem
                  key={i._id}
                  sender={i.sender}
                  _id={i._id}
                  handler={friendRequestHandler}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>0 Notifications</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { avatar, name } = sender || {};

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {`${name} sent you a friend request`}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }}>
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;
