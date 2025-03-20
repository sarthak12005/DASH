import React from "react";
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Image1 from '../assets/dashImage1.jpg';
import Image2 from '../assets/dashImage2.jpg';
import Image3 from '../assets/dashImage3.jpg';
import Image4 from '../assets/dashImage4.jpg';
import Image5 from '../assets/dashImage5.jpg';
import Image6 from '../assets/dashImage6.jpg';
import Image7 from '../assets/dashImage7.jpg';

const Gallery = () => {

    const [login, setLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    // Hardcoded credentials
    const correctEmail = "website@Dash2006";
    const correctPassword = "dash@2006";

    const handleLogin = () => {
        if (email === correctEmail && password === correctPassword) {
            setLogin(true);
        } else {
            alert("Incorrect email or password!");
        }
    };


    const [images, setImages] = useState([
        Image1,
        Image2,
        Image3,
        Image4,
        Image5,
        Image6,
        Image7,

    ]);

    const zoomView = (image) => {
         
    }

    return (
        <>

            {login ? (<><Navbar />
                <div className="margin h-[80px] w-full"></div>
                <div className="gallerySection w-screen h-screen  grid grid-cols-5 place-items-center gap-2.5 p-2.5">
                    {images.map((image, index) => (
                        <div className="image w-42 h-42 " key={index} onClick={zoomView(image)}>
                            <img
                                src={image}
                                alt={`Image${index + 1}`}
                                className="w-full h-full object-cover"

                            />
                        </div>
                    ))}
                </div>
            </>) : (
                <>
                    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                        <div className="bg-white p-8 rounded-lg shadow-md w-96">
                            <h1 className="text-2xl font-bold text-center mb-4">Lock Screen</h1>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full p-2 mb-3 border rounded-md"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full p-2 mb-3 border rounded-md"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                onClick={handleLogin}
                                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                            >
                                Unlock
                            </button>
                        </div>
                    </div>
                </>
            )}

        </>
    );
}

export default Gallery;




