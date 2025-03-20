import React from "react";

const VideoComponent = () => {
    return (
      <div className="w-full h-screen flex items-center justify-center from-white to-[#FFFF00]">
        <div className="w-full max-w-5xl p-6 rounded-2xl shadow-lg text-center bg-yellow-200">
          <h2 className="text-4xl font-bold text-black">A Special Video</h2>
          <p className="mt-4 text-lg text-gray-700">Your video will be placed here once it's ready.</p>
          <div className="mt-6">
            <video className="w-full h-auto max-h-[500px] rounded-xl shadow-md" controls>
              <source src="/path-to-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    );
  };
  
  export default VideoComponent;
  