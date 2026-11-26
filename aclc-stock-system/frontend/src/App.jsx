import "./App.css";
//import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";

import UserContext, { UserProvider } from "@/context/userContext";
import { useAuthExpired } from "@/hooks/useAuthExpired";

import socket from "@/socket";

import AppRoutes from "@/app/routes/AppRoutes";

function SocketManager() {
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    socket.emit("joinRoom", user._id.toString());
    //console.log("Joined room:", user._id);

    return () => {
      socket.off("reservation ready");
    };
  }, [user?._id]);

  return null;
}

function App() {
  useAuthExpired();
  return (
    <UserProvider>
      <SocketManager />
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
