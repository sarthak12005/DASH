import React, { useState } from "react";
import Navbar from "../Components/navbar";
// import HeroSection from "../components/HeroSection";
import FakeHero from "../components/FakeHero";
// import ImageTextSection from "../components/Original/ImagesSection";
import FakeImages from "../components/FakeImages";
// import HeartMessage from "../components/Original/HeartMessage";
import FakeMaessage from "../components/FakeMessage";
import VideoComponent from "../components/VideoComponent";
import PdfManager from "../components/PdfManager";
// import Footer from "../components/Footer";
import SongCenter from "../components/SongCenter";

const Home = () => {
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

   return (
      <>
          {login ? (
            <>
               <Navbar />
               {/* <HeroSection /> */}
               <FakeHero/>
               {/* <ImageTextSection /> */}
               <FakeImages/>
               {/* <HeartMessage /> */}
               <FakeMaessage/>
               <VideoComponent />

               <PdfManager/>
               <SongCenter/>
               {/* <Footer /> */}
            </>
         ) : (
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
         )}
      </>
   );
};

export default Home;
