import React, { useState, useEffect } from "react";

const videoData = {
  Exercise: [
    "https://youtu.be/yqeirBfn2j4?si=WeOltg9YyCmUGoUv",
    "/videos/exercise2.mp4",
    "/videos/exercise3.mp4",
    "/videos/exercise4.mp4",
    "/videos/exercise5.mp4",
    "/videos/exercise6.mp4",
    "/videos/exercise7.mp4",
    "/videos/exercise8.mp4",
    "/videos/exercise9.mp4",
    "/videos/exercise10.mp4",
  ],
  Bhajan: [
    "https://youtu.be/-A61THy1D1w?si=2M9tfboIPElEmYwv",
    "/videos/bhajan2.mp4",
    "/videos/bhajan3.mp4",
    "/videos/bhajan4.mp4",
    "/videos/bhajan5.mp4",
    "/videos/bhajan6.mp4",
    "/videos/bhajan7.mp4",
    "/videos/bhajan8.mp4",
    "/videos/bhajan9.mp4",
    "/videos/bhajan10.mp4",
  ],
  Practice: [
    "https://youtu.be/aRBzYEn7dhM?si=eCgRUyhx-_J0mOjK",
    "/videos/practice2.mp4",
    "/videos/practice3.mp4",
    "/videos/practice4.mp4",
    "/videos/practice5.mp4",
    "/videos/practice6.mp4",
    "/videos/practice7.mp4",
    "/videos/practice8.mp4",
    "/videos/practice9.mp4",
    "/videos/practice10.mp4",
  ],
};

const getDailyVideo = (category) => {
  const videos = videoData[category];
  const dayIndex = new Date().getDate() % videos.length;
  return videos[dayIndex];
};

const VideoComponent = () => {
  const [category, setCategory] = useState("Exercise");
  const [videoSrc, setVideoSrc] = useState(getDailyVideo("Exercise"));

  useEffect(() => {
    setVideoSrc(getDailyVideo(category));
  }, [category]);

  return (
    <div className="w-full h-[86vh] mt-5 flex flex-col items-center justify-center bg-yellow-200 p-6">
      <p className="mt-2 text-4xl font-bold text-black">Your daily video is here.</p>
      <div className="mt-4 flex gap-4">
        <button onClick={() => setCategory("Exercise")} className="px-4 py-2 bg-blue-500 text-white rounded-md">Exercise</button>
        <button onClick={() => setCategory("Bhajan")} className="px-4 py-2 bg-green-500 text-white rounded-md">Bhajan</button>
        <button onClick={() => setCategory("Practice")} className="px-4 py-2 bg-red-500 text-white rounded-md">Practice</button>
      </div>
      <div className="mt-6 w-full max-w-4xl">
        {videoSrc.includes("youtu") ? (
          <iframe
            className="w-full h-[500px] rounded-xl shadow-md"
            src={videoSrc.replace("youtu.be/", "www.youtube.com/embed/")}
            title="YouTube video player"
            allowFullScreen
          ></iframe>
        ) : (
          <video className="w-full h-auto max-h-[500px] rounded-xl shadow-md" controls>
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default VideoComponent;
