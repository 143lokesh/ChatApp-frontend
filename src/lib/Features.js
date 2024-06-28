import moment from "moment";


const fileFormat =(url="")=>{
       const fileExtension = url.split(".").pop();
       if(fileExtension==="mp4" || fileExtension==="webm" || fileExtension==="ogg"){
          return "video"
       }
       if(fileExtension==="mp3" || fileExtension==="wav" ){
        return "audio"
     }
     if(fileExtension==="png" || fileExtension==="jpg"  || fileExtension==="jpeg"  || fileExtension==="gif" ){
        return "image"
     }

     return "file"
}

const transformImage =(url="",width=100)=>{
   if(url.includes("cloudinary")){
      const newUrl = url.replace("upload/" , `upload/dpr_auto/w_${width}/`);
      return newUrl
   }
   return url
}

const getLast7days=()=>{
     const currentDate = moment();
     const last7days=[];
     for(let i=0;i<7;i++){
      last7days.unshift(currentDate.format("MMM D"));
      currentDate.subtract(1,"days");
     }
     return last7days
}

const getOrSaveFromStorage =({key , value ,get})=>{
   if(get) return localStorage.getItem(key)? JSON.parse(localStorage.getItem(key)) : null;
   else localStorage.setItem(key , JSON.stringify(value))
}

export {fileFormat ,transformImage ,getLast7days,getOrSaveFromStorage}