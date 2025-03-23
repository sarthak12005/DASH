import React, { useEffect, useState , useRef  } from "react";
// import React, { } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { API_URL } from "../config";
const SongManagement = () => {
  const [requests, setRequests] = useState([]);
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null); // Step 1: Create a ref

  useEffect(() => {
    fetchRequests();
    fetchUploadedSongs();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/songs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  const handleRequstDelete = async (id) => {
      try {
         const res = await axios.delete(`${API_URL}/api/songs/${id}`, {
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`},
         });
         console.log("The song request deleted successfully");
      } catch (err) {
         console.error("Error deleting requests", err);
      }
  }

  const fetchUploadedSongs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Up-Song/songs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setUploadedSongs(res.data);
    } catch (err) {
      console.error("Error fetching uploaded songs", err);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`${API_URL}/api/Up-Song/songs/${filename}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      fetchRequests();
      fetchUploadedSongs();
    } catch (err) {
      console.error("Error deleting request", err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a file to upload");
    setUploading(true);

    const formData = new FormData();
    formData.append("song", selectedFile);

    try {
      await axios.post(`${API_URL}/api/Up-Song/upload`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Step 2: Reset input
      fetchRequests();
      fetchUploadedSongs();
    } catch (err) {
      console.error("Error uploading song", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div className="p-6 space-y-6 bg-pink-100 min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold text-pink-700">Song Management</h1>

      {/* Upload Section */}
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Upload New Song</h2>
        <form onSubmit={handleUpload} className="flex gap-4 items-center">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="border p-2 rounded-lg w-full"
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      {/* Requests Section */}
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Song Requests</h2>
        {requests.length === 0 ? (
          <p>No requests found</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="flex justify-between items-center p-4 bg-pink-50 rounded-lg shadow">
                <span className="text-lg">{req.songs.join(", ")}</span>
                <button
                  onClick={() => handleRequstDelete(req._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Uploaded Songs Section */}
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Uploaded Songs</h2>
        {uploadedSongs.length === 0 ? (
          <p>No uploaded songs found</p>
        ) : (
          <div className="space-y-4">
            {uploadedSongs.map((song, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-pink-50 rounded-lg shadow">
                <audio controls className="w-full">
                <source src={`${API_URL}/uploads/songs/${song.filename}`} type="audio/mpeg" />

                  Your browser does not support the audio element.
                </audio>
                <button
                  onClick={() => handleDelete(song.filename)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg ml-4"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SongManagement;
