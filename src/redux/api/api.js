import {createApi , fetchBaseQuery }  from "@reduxjs/toolkit/query/react"
import { server } from "../../constants/route";
const api = createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({
        baseUrl:`${server}/api/v1/`,
    }),
    tagTypes:["Chat","User","Message"],
    endpoints:(builder)=>({
        myChats : builder.query({
            query:()=>({
                url:"chat/myChat" ,
                credentials:"include"
            }),
            providesTags:["Chat"],
        }),

        searchUser : builder.query({
            query:(name)=>({
                url:`user/search?name=${name}`,
                credentials:"include",
            }),
            providesTags:["User"]
        }),
        
        sendFriendRequest : builder.mutation({
            query:(data)=>({
                url:"user/sendRequest",
                method:"PUT",
                credentials:"include",
                body:data
            }),
            invalidatesTags:["User"],
        }),
        getNotifications : builder.query({
            query:()=>({
                url:`user/notifications`,
                credentials:"include",
            }),
            keepUnusedDataFor:0,
        
        }),
        acceptFriendRequest : builder.mutation({
            query:(data)=>({
                url:"user/acceptRequest",
                method:"PUT",
                credentials:"include",
                body:data
            }),
            invalidatesTags:["Chat"],
        }),
        getChatDetails : builder.query({
            query:({chatId, populate=false})=>{
                  let url =`chat/${chatId}`;
                  if(populate){
                    url+="?populate=true"
                  }

                return {
                    url,
                    credentials:"include"
                }
            },
            invalidatesTags:["Chat"],
        }),

        getMessages : builder.query({
            query:({chatId,page})=>({
                url:`chat/message/${chatId}?page=${page}`,
                credentials:"include"
            }),
            keepUnusedDataFor:0,
        }),

        sendAttachements : builder.mutation({
            query:(data)=>({
                url:"chat/message",
                method:"POST",
                credentials:"include",
                body:data
            }),
          
        }),
        MyGroups : builder.query({
            query:()=>({
                url:`chat/myGroups`,
                credentials:"include"
            }),
            providesTags:["Chat"]
        }),

        MyFriends : builder.query({
            query:(chatId)=>{
                let url =`user/friends`
                if(chatId){
                  url+=`?chatId=${chatId}`
                }

              return {
                  url,
                  credentials:"include"
              }
            },
            providesTags:["Chat"]
        }),

        newGroup : builder.mutation({
            query:({name , members})=>({
                url:"chat/newGroup",
                method:"POST",
                credentials:"include",
                body:{name , members},
            }),
          invalidatesTags:["Chat"]
        }),

        renameGroup : builder.mutation({
            query:({chatId , name})=>({
                url:`chat/${chatId}`,
                method:"PUT",
                credentials:"include",
                body:{name},
            }),
          invalidatesTags:["Chat"]
        }),
        removeGroupMembers : builder.mutation({
            query:({chatId , userId})=>({
                url:`chat/removeMember`,
                method:"PUT",
                credentials:"include",
                body:{chatId,userId},
            }),
          invalidatesTags:["Chat"]
        }),
        addGroupMembers : builder.mutation({
            query:({members , chatId})=>({
                url:`chat/addMembers`,
                method:"PUT",
                credentials:"include",
                body:{members , chatId},
            }),
          invalidatesTags:["Chat"]
        }),
        deleteGroup : builder.mutation({
            query:(chatId )=>({
                url:`chat/${chatId}`,
                method:"DELETE",
                credentials:"include",
            
            }),
          invalidatesTags:["Chat"]
        }),
        leaveGroup: builder.mutation({
            query: (chatId) => ({
              url: `chat/leave/${chatId}`,
              method: "DELETE",
              credentials: "include",
            }),
            invalidatesTags: ["Chat"],
          }),
    })
})


export default api;
export const {
    useMyChatsQuery ,
    useLazySearchUserQuery,
    useSendFriendRequestMutation,
    useGetNotificationsQuery,
    useAcceptFriendRequestMutation,
    useGetChatDetailsQuery,
    useGetMessagesQuery,
    useSendAttachementsMutation,
    useMyGroupsQuery,
    useMyFriendsQuery,
    useNewGroupMutation,
    useRenameGroupMutation,
    useRemoveGroupMembersMutation,
    useAddGroupMembersMutation,
    useDeleteGroupMutation,
    useLeaveGroupMutation,
} = api