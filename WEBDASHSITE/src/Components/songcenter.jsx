import React, { useState, useEffect } from "react";
import { Download, Trash2 } from "lucide-react";
import axios from "axios";
import { API_URL } from "../config";

const SongCenter = () => {
  const [songRequests, setSongRequests] = useState([]);
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [newRequest, setNewRequest] = useState("");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/songs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSongRequests(res.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    const fetchUploadedSongs = async () => {
      try {


        const response = await axios.get(`${API_URL}/api/Up-Song/songs`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        console.log(response.data);
        setUploadedSongs(response.data);
      } catch (error) {
        console.error('Error fetching uploaded songs:', error);
      }
    };


    fetchRequests();
    fetchUploadedSongs();
  }, [token]);

  const addRequest = async () => {
    if (newRequest.trim()) {
      try {
        const res = await axios.post(
          `${API_URL}/api/songs`,
          { songs: [newRequest] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setSongRequests([...songRequests, res.data]);
        setUploadedSongs([...uploadedSongs, newRequest]);
        setNewRequest("");
      } catch (error) {
        console.error("Error adding request:", error);
      }
    }
  };

  const handleDelete = async (song) => {
    try {
      await axios.delete(`${API_URL}api/Up-Song/uploaded/${song}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadedSongs(uploadedSongs.filter((s) => s !== song));
    } catch (error) {
      console.error("Error deleting song:", error);
    }
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
            {songRequests.map((request) => (
              <li key={request._id} className="bg-pink-50 p-2 rounded-md shadow-sm">
                {request.songs.join(", ")} (Status: {request.status})
              </li>
            ))}
          </ul>
        </div>

        {/* Uploaded Songs Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-black mb-2">Uploaded Songs</h3>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {uploadedSongs.map((song, index) => (
              <li key={index} className="bg-pink-50 p-2 rounded-md flex items-center justify-between">
                <span>{song.filename}</span> {/* Show the song name */}
                <div className="flex items-center gap-2">
                  {/* Download Button */}
                  <a
                    href={`${API_URL}/api/Up-Song/download/${song.filename}?token=${localStorage.getItem("accessToken")}`}
                    download={song.originalName || song.filename}
                    className="text-green-500 hover:text-green-700 transition"
                    title="Download"
                  >
                    <Download size={20} />
                  </a>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(song.filename)}
                    className="text-red-500 hover:text-red-700"
                  >
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
