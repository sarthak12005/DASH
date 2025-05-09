import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Components/navbar";

const words = [
    "Word1",
    "Word2",
    "Word3",
    "Word4",
    "Word5",
    "Word6",
    "Word7",
    "Word8",
    "Word9",
    "Word10"
]

const Words = () => {
    return (
        <div className="header w-screen h-screen mt-16 bg-amber-400 ">
            <h1 className="text-[white] text-[40px] text-center  ">Todays Word</h1>
            <div className="boxes flex flex-col gap-5 bg-amber-400 p-10 m-2.5 items-center ">
                {words.map((word, index) => (
                    <motion.div
                        key={index}
                        className="mission-card bg-white shadow-lg rounded-lg p-4 m-4 w-[70vw] h-[100px] cursor-pointer hover:shadow-xl transition-shadow duration-300"
                    >
                        <h2 className="text-xl font-bold text-center">{word}</h2>
                    </motion.div>
                ))}
            </div>
        </div>
    )
};

export default Words;