import {
  Add,
  Delete,
  Done,
  Edit,
  KeyboardBackspace,
  Menu,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutLoader } from "../components/layout/Loader";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import { Link } from "../components/styles/styledComponent";
import { bgGradient, matBlack } from "../constants/colors";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useAddGroupMembersMutation,
  useDeleteGroupMutation,
  useGetChatDetailsQuery,
  useMyGroupsQuery,
  useRemoveGroupMembersMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";
import { getSocket } from "../socket";
import { REFETCH_CHATS } from "../constants/events";
const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);
const Group = () => {
  const socket = getSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigateBack = () => {
    navigate("/");
  };
  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };
  const chatId = useSearchParams()[0].get("group");
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdated, setGroupNameUpdated] = useState("");

  const myGroups = useMyGroupsQuery("");
  const groupDetails = useGetChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );
  useEffect(() => {
    socket.on(REFETCH_CHATS, () => {
      if (!groupDetails.isUninitialized) {
        groupDetails.refetch();
      }
    });
    return () => {
      socket.off(REFETCH_CHATS);
    };
  }, [groupDetails.isUninitialized]);

  const [renameGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );
  const [removeMembers, isLoadingRemoveMembers] = useAsyncMutation(
    useRemoveGroupMembersMutation
  );
  const [addMembers, isLaodingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteGroupMutation
  );

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];
  useErrors(errors);

  useEffect(() => {
    if (chatId) {
      setGroupName(`group Name ${chatId}`);
      setGroupNameUpdated("group Name");
    }

    return () => {
      setGroupName("");
      setGroupNameUpdated("");
      setIsEdit(false);
    };
  }, [chatId]);

  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <Tooltip title="menu">
          <IconButton onClick={handleMobile}>
            <Menu />
          </IconButton>
        </Tooltip>
      </Box>
      <Tooltip title="Back">
        <IconButton
          onClick={navigateBack}
          sx={{
            color: "white",
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: matBlack,
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
        >
          <KeyboardBackspace />
        </IconButton>
      </Tooltip>
    </>
  );

  const [isEdit, setIsEdit] = useState(false);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails.data.chat.name);
      setGroupNameUpdated(groupDetails.data.chat.name);
      setMembers(groupDetails.data.chat.members);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdated("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);
  const updateGroupNameHandler = () => {
    setIsEdit(false);
    renameGroup("Updating Group Name ...", { chatId, name: groupNameUpdated });
    setGroupName(groupNameUpdated);
  };
  const GroupName = (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        spacing={"1rem"}
        padding={"3rem"}
      >
        {isEdit ? (
          <>
            <TextField
              value={groupNameUpdated}
              onChange={(e) => setGroupNameUpdated(e.target.value)}
            />
            <IconButton
              onClick={updateGroupNameHandler}
              disabled={isLoadingGroupName}
            >
              <Done />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h4"> {groupName} </Typography>
            <IconButton
              disabled={isLoadingGroupName}
              onClick={() => setIsEdit(true)}
            >
              <Edit />
            </IconButton>
          </>
        )}
      </Stack>
    </>
  );
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };
  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };
  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };
  const deleteHandler = () => {
    deleteGroup("Deleting Group..." ,chatId)
    setConfirmDeleteDialog(false)
    navigate("/group")
  };
  const removeMemberHandler = (id) => {
    removeMembers("Removing Member...", { chatId, userId: id });
  };
  const ButtonGroup = (
    <>
      <Stack
        direction={{
          sm: "row",
          xs: "column-reverse",
        }}
        spacing={"1rem"}
        p={{
          sm: "1rem",
          xs: "0",
          md: "1rem 4rem",
        }}
      >
        <Button
          size="large"
          color="error"
          variant="outlined"
          startIcon={<Delete />}
          onClick={openConfirmDeleteHandler}
        >
          {" "}
          Delete Group
        </Button>
        <Button
          size="large"
          variant="contained"
          startIcon={<Add />}
          onClick={openAddMemberHandler}
        >
          {" "}
          Add Member
        </Button>
      </Stack>
    </>
  );
  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid container height={"100vh"}>
      <Grid
        item
        sm={4}
        sx={{
          display: { xs: "none", sm: "block" },
        }}
      >
        <GroupsList myGroups={myGroups.data.groups} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtns}
        {groupName && (
          <>
            {GroupName}
            <Typography margin={"2rem"} alignSelf="flex-start" variant="body1">
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"2rem"}
              height={"50vh"}
              overflow={"auto"}
              sx={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                "-ms-overflow-style": "none",
                "scrollbar-width": "none",
              }}
            >
              {isLoadingRemoveMembers ? (<CircularProgress/>) :( members.map((user) => {
                return (
                  <UserItem
                    key={user._id}
                    user={user}
                    isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem",
                    }}
                    handler={removeMemberHandler}
                  />
                );
              }))
              
              }
            </Stack>
            {ButtonGroup}
          </>
        )}
      </Grid>
      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}
      <Drawer
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
      >
        <GroupsList
          w={"50vw"}
          myGroups={myGroups.data.groups}
          chatId={chatId}
        />
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack
      width={w}
      sx={{ backgroundImage: bgGradient, height: "100vh", overflow: "auto" }}
    >
      {myGroups.length > 0 ? (
        myGroups.map((group, index) => (
          <GroupListItem group={group} chatId={chatId} key={index} />
        ))
      ) : (
        <Typography textAlign={"center"} padding={"1rem"}>
          No Grops
        </Typography>
      )}
    </Stack>
  );
};

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) {
          e.preventDefault();
        }
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});

export default Group;
