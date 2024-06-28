import { avatarClasses } from "@mui/material";


 export const SampleChats=[{
    avatar:["https://www.w3schools.com/howto/img_avatar.png"],
    name:"John Doe",
    _id:"1",
    groupChat:false,
    members:["1","2"],
},
{
    avatar:["https://www.w3schools.com/howto/img_avatar.png","https://www.w3schools.com/howto/img_avatar.png"],
    name:"John",
    _id:"2",
    groupChat:true,
    members:["1","2"],
},
{
    avatar:["https://www.w3schools.com/howto/img_avatar.png"],
    name:"John Doe",
    _id:"3",
    groupChat:false,
    members:["3","2"],
},

]

export const sampleUsers=[{
    avatar:["https://www.w3schools.com/howto/img_avatar.png"],
    name:"John Doe",
    _id:"1",
 
},
{
    avatar:["https://www.w3schools.com/howto/img_avatar.png","https://www.w3schools.com/howto/img_avatar.png"],
    name:"John",
    _id:"2",
  
},]
export const sampleNotifications=[{
    sender:{
    avatar:["https://www.w3schools.com/howto/img_avatar.png"],
    name:"John Doe",
    },
    _id:"1",
 
},
{
    sender:{
        avatar:["https://www.w3schools.com/howto/img_avatar.png"],
        name:"John Doe",
        },
    _id:"2",
  
},];
export const sampleMessage =[{
    attachments:[{
        public_id:"asdsad",
        url:"https://www.w3schools.com/howto/img_avatar.png"
    }],
    content:"uybyt ",
    _id:"stnhukbnjkhbfgkbh",
    sender:{
        _id:"user_id",
        name:"charan"
    },
    chat:"chatId",
    createdAt:"2024-06-03T09:00:42.497Z"
},
{
    attachments:[{
        public_id:"asdsad",
        url:"https://www.w3schools.com/howto/img_avatar.png"
    }],
    content:"uybyt ",
    _id:"stnhukbnjkhbfgkbh",
    sender:{
        _id:"sfknygjy",
        name:"charan"
    },
    chat:"chatId",
    createdAt:"2024-06-03T09:00:42.497Z"
},
]

export const  dashboardData={
    users:[{
        name:"John Doe",
        avatar:["https://www.w3schools.com/howto/img_avatar.png"],
        _id:"1",
        username:"john_hoe",
        friends:20,
        groups:5,
     
    },
    {
        name:"John Doe",
        avatar:["https://www.w3schools.com/howto/img_avatar.png"],
        _id:"2",
        username:"johnhoe",
        friends:20,
        groups:5,
      
    },],

    chats:[{
        name:"John Doe",
        avatar:["https://www.w3schools.com/howto/img_avatar.png"],
        _id:"1",
        groupChat:false,
        members:[{_id:"1" , avatar:"https://www.w3schools.com/howto/img_avatar.png"} ,{_id:"2" , avatar:"https://www.w3schools.com/howto/img_avatar.png"}],
        totalMembers:2,
        totalMessages:20,
        creator:{
            name:"john",
            avatar:"https://www.w3schools.com/howto/img_avatar.png"
        }
       
    },
    {
        name:"John Doe",
        avatar:["https://www.w3schools.com/howto/img_avatar.png"],
        _id:"1",
        groupChat:false,
        members:[{_id:"1" , avatar:"https://www.w3schools.com/howto/img_avatar.png"} ,{_id:"2" , avatar:"https://www.w3schools.com/howto/img_avatar.png"}],
        totalMembers:2,
        totalMessages:20,
        creator:{
            name:"john",
            avatar:"https://www.w3schools.com/howto/img_avatar.png"
        }
       
    },
] ,

 messages :[
    {
        attachments:[],
        content:"kjbid",
        _id:"vvyjvbfku,jknjc",
        sender:{
            avatar:"https://www.w3schools.com/howto/img_avatar.png",
            name:"chaman"
        },
        groupChat:false,
        chat:"1",
        createdAt:"2024-06-03T09:00:42.497Z"
    },
    {
        attachments:[{
            public_id:"asdsad",
            url:"https://www.w3schools.com/howto/img_avatar.png"
        }],
        content:"kjbid",
        _id:"vvyjvbfkumkhgbknjc",
        sender:{
            avatar:"https://www.w3schools.com/howto/img_avatar.png",
            name:"chaman"
        },
        groupChat:true,
        chat:"1",
        createdAt:"2024-06-03T09:00:42.497Z"
    },
 ]
}