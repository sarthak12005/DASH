import React from "react";
import Navbar from '../Components/navbar';
import SongManagement from "../Components/songmanagement";
import DiaryManagement from "../Components/dairymanagement";

const Admin = () => {
    return (
    <>
        <Navbar/>
        <SongManagement/>
        <DiaryManagement/>
    </>
    )
}

export default Admin;