import { Navigate, Outlet } from "react-router-dom"
import React from "react"
import useAuth from "../Hooks/useAuth"

 export default function ProtectedRoute(){
    const {isLogin,token}=useAuth()
    return(
        <React.Fragment>
                {
       
                     isLogin  && token ? <Outlet /> : <Navigate to={"/login"} />
                 }
        </React.Fragment>
    )
}