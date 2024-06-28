import {
  Button,
  Dialog,
  DialogTitle,
  List,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import UserItem from "../shared/UserItem";
import { sampleUsers } from "../../constants/SampleData";
import { useInputValidation } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { useMyFriendsQuery, useNewGroupMutation } from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const NewGroup = () => {
  const dispatch = useDispatch();
  const { isError, error, isLoading, data } = useMyFriendsQuery();
  const [newGroup , isLoadingNewGroup] =useAsyncMutation(useNewGroupMutation)
  const groupName = useInputValidation("");
  const {isNewGroup}=useSelector((state)=>state.misc)
  const [selectedMembers, setSelectedMembers] = useState([]);
  const errors = [
    {
      isError,
      error,
    },
  ];
  useErrors(errors, isError);
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curr) => curr !== id) : [...prev, id]
    );
  };
  const submitHandler = () => {
    if(!groupName.value) return toast.error("Group Name id required")
      if(selectedMembers.length<2){
        return toast.error("please select atleast 3 members")
      }
    
    newGroup( "Creating New Group... ",{  name:groupName.value , members:selectedMembers})
    closeHandler()
  };
  const closeHandler=()=>{
    dispatch(setIsNewGroup(false))
  }

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack
        p={{ xs: "1rem", sm: "3rem" }}
        maxWidth={"25rem"}
        spacing={"2rem"}
        sx={{
          height: "25%",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>
        <TextField
          value={groupName.value}
          onChange={groupName.changeHandler}
          label="Group Name"
        />
        <Typography>Members</Typography>
        <Stack
          sx={{
            overflow: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends.map((user) => (
              <UserItem
                user={user}
                key={user._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant="text" color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button variant="contained" onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
