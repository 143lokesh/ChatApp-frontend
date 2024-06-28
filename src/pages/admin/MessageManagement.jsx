import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { Avatar, Box, Stack } from '@mui/material'
import { dashboardData } from '../../constants/SampleData'
import {fileFormat, transformImage} from "../../lib/Features"
import RenderContent from "../../components/shared/RenderContent"
import moment from 'moment'
import { server } from '../../constants/route'
import { useFetchData } from '6pp'
import { useErrors } from '../../hooks/hook'
const columns=[{
  field:"id",
  headerName:"ID",
  headerClassName:"table-header",
  width:200,
},
{
  field:"attachments",
  headerName:"Attachments",
  headerClassName:"table-header",
  width:200,
  renderCell:(params)=>
  {
    const {attachments} = params.row;
    return attachments?.length>0 ? 
     attachments.map(i=>{
      const url = i.url
      const file=fileFormat(url)
    
      return  <Box >
        <a href={url}
          download
          target='_blank'
          style={{
            display:"flex",
             color:"black",
           alignItems:"center",
           justifyContent:"center"
          
          }}
        >
        {
          file==="image" ? 
          <img src={url} alt="attachement" width={"150px"} height={"200px"} style={{
                objectFit:"contain"
            }} />
            :

          RenderContent(file ,url )
        }

        </a>
      </Box>
     })
    
    :"No Attachements"
   
  }
},{
  field:"content",
  headerName:"Content",
  headerClassName:"table-header",
  width:400,
},
  {
    field:"sender",
    headerName:"Sender",
    headerClassName:"table-header",
    width:200,
    renderCell:(params)=><Stack direction={"row"} spacing={"1rem"} justifyContent={"center"} alignItems={"center"}>
      <Avatar alt={params.row.sender.name} src={params.row.sender.avatar}/>
      <span>{params.row.sender.name}</span>
    </Stack>
  }
  ,{
  field:"chat",
  headerName:"Chat",
  headerClassName:"table-header",
  width:200,
},
{
  field:"groupChat",
  headerName:"Group Chat",
  headerClassName:"table-header",
  width:100,
},
{
  field:"createdAt",
  headerName:"Time",
  headerClassName:"table-header",
  width:250,
},
]



const MessageManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/messages`,
    "dashboard-messages"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);
  const [rows , setRows] = useState([])
  useEffect(()=>{
    if(data){
      setRows(data?.messages.map((i)=>({...i ,id:i._id , sender:{
        name:i.sender.name,
        avatar:transformImage(i.sender.avatar ,50)
      } ,
      createdAt : moment(i.createdAt).format("MMMM Do YYYY , h:mm:55 a")
    
    })));
    }
    
  },[data])

  return (
    <AdminLayout>
    {loading ? (
        <Skeleton height={"100vh"} />
      ):(
           <Table heading={"ALL Messages"} columns={columns} rows={rows} rowHeight={200} />
      )
          
    }
    </AdminLayout>
 
  )
}

export default MessageManagement