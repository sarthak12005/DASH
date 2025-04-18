import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import Navbar from "../Components/navbar";
import FakeHero from "../Components/fakehero";
import FakeImages from "../Components/fakeimages";
import FakeMaessage from "../Components/fakemessage";
import VideoComponent from "../Components/videocomponent";
import PdfManager from "../Components/pdfmanager";
import SongCenter from "../Components/songcenter";

const Home = () => {
  const [login, setLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { accessToken, refreshToken, role, email } = response.data;

      localStorage.setItem("accessToken", accessToken);
      console.log(localStorage.getItem('accessToken'));
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);

      setLogin(true);

      // if (role === "admin") navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <>
      {login ? (
        <>
          <Navbar />
          <FakeHero />
          <FakeImages />
          <FakeMaessage />
          <VideoComponent />
          <PdfManager />
          <SongCenter />
        </>
      ) : (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-100 to-yellow-300">
          <div className="bg-white/30 backdrop-blur-md border border-yellow-300 shadow-2xl p-8 rounded-2xl w-96">
            <h1 className="text-3xl font-extrabold text-center mb-6 text-yellow-700 tracking-wider drop-shadow-lg">
              WEBDASH
            </h1>

            <div className="space-y-5">
              {error && <p className="text-red-500 text-center text-sm">{error}</p>}

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-xl bg-white/70 text-gray-800 placeholder-gray-500 border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 rounded-xl bg-white/70 text-gray-800 placeholder-gray-500 border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                onClick={handleLogin}
                className="w-full py-3 bg-yellow-500 text-white font-bold rounded-xl shadow-md hover:bg-yellow-600 hover:shadow-lg hover:scale-[1.02] transition-all"
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
