import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { LayoutLoader } from "./components/layout/Loader";
import axios from "axios"
import { server } from "./constants/route";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import  {Toaster} from "react-hot-toast"
import { SocketProvider } from "./socket";


const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/chat"));
const Groups = lazy(() => import("./pages/Group"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin=lazy(()=>import("./pages/admin/AdminLogin"))
const Dashboard=lazy(()=>import("./pages/admin/Dashboard"))
const Chats=lazy(()=>import("./pages/admin/ChatManagement"))
const Messages=lazy(()=>import("./pages/admin/MessageManagement"))
const Users=lazy(()=>import("./pages/admin/UserManagement"))


const App = () => {
  const {user , loader}=useSelector(state => state.auth)
  const dispatch = useDispatch()
    useEffect(()=>{
         axios
         .get(`${server}/api/v1/user/me`,{withCredentials:true})
         .then(({data})=>dispatch(userExists(data.user)))
         .catch(err=>dispatch(userNotExists()))
    },[dispatch ,user])
  return loader? <LayoutLoader/> : (
    <BrowserRouter>
    <Suspense fallback={<LayoutLoader/>}>
      <Routes>
        <Route element={
          <SocketProvider>
                <ProtectedRoute user={user} />
          </SocketProvider>
          }>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/group" element={<Groups />} />
        </Route>
        <Route
          path="/login"
          element={
            <ProtectedRoute user={!user} redirect="/">
              <Login />
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={<AdminLogin/>}/>
        <Route path="/admin/dashboard" element={<Dashboard/>}/>
        <Route path="/admin/chats" element={<Chats/>}/>
        <Route path="/admin/messages" element={<Messages/>}/>
        <Route path="/admin/users" element={<Users/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      <Toaster position="bottom-center"/>
    </BrowserRouter>
  );
};

export default App;
