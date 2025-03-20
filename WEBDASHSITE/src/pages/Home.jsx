import React, { useState } from "react";
import Navbar from "../Components/navbar";
// import HeroSection from "../components/HeroSection";
import FakeHero from "../Components/fakehero";
// import ImageTextSection from "../components/Original/ImagesSection";
import FakeImages from "../Components/fakeimages";
// import HeartMessage from "../components/Original/HeartMessage";
import FakeMaessage from "../Components/fakemessage";
import VideoComponent from "../Components/videocomponent";
import PdfManager from "../Components/pdfmanager";
// import Footer from "../components/Footer";
import SongCenter from "../Components/songcenter";

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
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-100 to-yellow-300">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-yellow-400 h-52" >
              <h1 className="text-3xl font-extrabold text-center mb-6 text-yellow-600 drop-shadow-md">
                WEBDASH Lock Screen
              </h1>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-3 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={handleLogin}
                  className="w-full bg-yellow-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-yellow-600 transition-all hover:shadow-xl"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
         )}
      </>
   );
};

export default Home;
