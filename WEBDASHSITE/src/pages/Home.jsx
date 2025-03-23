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
      const { accessToken, refreshToken, role } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);

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
          <div className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-yellow-400 h-125">
            <h1 className="text-3xl font-extrabold text-center mb-6 text-yellow-600 drop-shadow-md">
              WEBDASH Lock Screen
            </h1>
            <div className="space-y-4">
              {error && <p className="text-red-500 text-center">{error}</p>}
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
