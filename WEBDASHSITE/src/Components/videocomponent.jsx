import React, { useState, useEffect } from "react";

const videoData = {
  Exercise: [
    "/videos/exercise1.mp4",
    "/videos/exercise2.mp4",
    "/videos/exercise3.mp4",
  ],
  Bhajan: [
    "/videos/bhajan1.mp4",
    "/videos/bhajan2.mp4",
    "/videos/bhajan3.mp4",
  ],
  Practice: [
    "/videos/practice1.mp4",
    "/videos/practice2.mp4",
    "/videos/practice3.mp4",
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
    <div className="w-full h-[86vh] flex flex-col items-center justify-center bg-yellow-200 p-6">
      {/* <h2 className="text-4xl font-bold text-black">A Special Video</h2> */}
      <p className="mt-2 text-4xl font-bold text-black">Your daily video is here.</p>
      <div className="mt-4 flex gap-4">
        <button onClick={() => setCategory("Exercise")} className="px-4 py-2 bg-blue-500 text-white rounded-md">Exercise</button>
        <button onClick={() => setCategory("Bhajan")} className="px-4 py-2 bg-green-500 text-white rounded-md">Bhajan</button>
        <button onClick={() => setCategory("Practice")} className="px-4 py-2 bg-red-500 text-white rounded-md">Practice</button>
      </div>
      <div className="mt-6 w-full max-w-4xl">
        <video className="w-full h-auto max-h-[500px] rounded-xl shadow-md" controls>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoComponent;
