import React from "react";
import Navbar from '../Components/navbar';
import SongManagement from "../Components/songmanagement";
import DiaryManagement from "../Components/dairymanagement";
import { useState, useEffect } from "react";



const Admin = () => { 

    const [role, setRole] = useState(null);
    

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        const userEmail = localStorage.getItem('email');
        setRole(userRole);
        setEmail(userEmail);
    },[])


    return (
    <>
        <Navbar/>
        {role === "admin" && <SongManagement/>}
        <DiaryManagement/>
    </>
    )
}

export default Admin;