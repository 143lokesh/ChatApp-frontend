import React from 'react'
import { transformImage } from '../../lib/Features'
import { FileOpen } from '@mui/icons-material'

const RenderContent = ({file ,url}) => {

     switch(file){
        case "video":
         return  <video src={url} preload='none' width={"200px"} controls/>;
        case "audio":
            return <audio src={url} preload='none' controls/>;

        default:
           return  <FileOpen/>

     }
  
}

export default RenderContent