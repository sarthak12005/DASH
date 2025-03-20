import React, { useState, useEffect } from "react";
import { Download, Trash2 } from "lucide-react";

const SongCenter = () => {
  const [songRequests, setSongRequests] = useState([]);
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [newRequest, setNewRequest] = useState("");

  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem("songRequests")) || [];
    const savedSongs = JSON.parse(localStorage.getItem("uploadedSongs")) || [];
    setSongRequests(savedRequests);
    setUploadedSongs(savedSongs);
  }, []);

  const addRequest = () => {
    if (newRequest.trim()) {
      const updatedRequests = [...songRequests, newRequest];
      setSongRequests(updatedRequests);
      localStorage.setItem("songRequests", JSON.stringify(updatedRequests));
      setNewRequest("");
    }
  };

  const uploadSong = (event) => {
    const files = Array.from(event.target.files);
    const updatedSongs = [...uploadedSongs, ...files.map(file => file.name)];
    setUploadedSongs(updatedSongs);
    localStorage.setItem("uploadedSongs", JSON.stringify(updatedSongs));
  };

  const deleteSong = (index) => {
    const updatedSongs = uploadedSongs.filter((_, i) => i !== index);
    setUploadedSongs(updatedSongs);
    localStorage.setItem("uploadedSongs", JSON.stringify(updatedSongs));
  };

  return (
    <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-2xl shadow-lg mt-10 mb-10">
      <h2 className="text-3xl font-bold text-black mb-4 text-center">Song Center</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-black mb-2">Request a Song</h3>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Enter song name"
              value={newRequest}
              onChange={(e) => setNewRequest(e.target.value)}
              className="flex-grow p-2 border rounded-md mr-2"
            />
            <button
              onClick={addRequest}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-pink-600 transition"
            >
              Request
            </button>
          </div>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {songRequests.map((request, index) => (
              <li key={index} className="bg-pink-50 p-2 rounded-md shadow-sm">{request}</li>
            ))}
          </ul>
        </div>

        {/* Uploaded Songs Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-black mb-2">Uploaded Songs</h3>
          <div className="mb-4">
            <input
              type="file"
              accept="audio/*"
              multiple
              onChange={uploadSong}
              className="hidden"
              id="songUpload"
            />
            <label
              htmlFor="songUpload"
              className="cursor-pointer bg-black text-white px-4 py-2 rounded-md hover:bg-pink-600 transition"
            >
              Upload Songs
            </label>
          </div>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {uploadedSongs.map((song, index) => (
              <li key={index} className="bg-pink-50 p-2 rounded-md flex items-center justify-between">
                {song}
                <div className="flex items-center gap-2">
                  <a
                    href={`#`} // Replace with actual path if needed
                    download={song}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Download size={20} />
                  </a>
                  <button onClick={() => deleteSong(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SongCenter;
