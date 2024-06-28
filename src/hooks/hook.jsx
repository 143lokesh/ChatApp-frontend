import { useEffect, useState } from "react"
import toast from "react-hot-toast";




const  useErrors = (errors=[])=>{
    useEffect(()=>{
          
        errors.forEach(({isError,error,fallBack})=>{
            if(isError){
                if(fallBack) fallBack();
                else  toast.error(error?.data?.message || "something went wrong")
              }
        })
    },[errors])
}

const useAsyncMutation  =(mutationHook)=>{
    const [isLoading ,setIsloading] =useState(false);
    const [data,setData] = useState(null)
    const [mutate] = mutationHook();

    const executeMtation =  async(toastMessage ,...args)=>{
        setIsloading(true);
        const toastId = toast.loading(toastMessage|| "Updating Data ....")     
        try {
            const res =  await mutate(...args)
            if(res.data){
              toast.success( res?.data?.message||"Updated Data Successfully" , {
                id:toastId,
              })
              setData(res.data)
            }
            else{
              toast.error(res?.error?.data?.message || "Cant send Friend Request" ,{
                id:toastId
              })
            }
          } catch (error) {
            toast.error( "Something went wrong" ,{id:toastId})
          } finally{
            setIsloading(false)
        } 
    }
    return [executeMtation ,isLoading , data]
}

const useSocketEvents =(socket ,handlers)=>{
  useEffect(()=>{
    Object.entries(handlers).forEach(([event , handler])=>{
      socket.on(event,handler)
    })

    return()=>{
      Object.entries(handlers).forEach(([event,handler])=>{
        socket.off(event,handler)
      })
    }
  },[socket,handlers])
}

export {useErrors , useAsyncMutation,useSocketEvents}