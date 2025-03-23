import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

const DiaryManagement = () => {
  const [entries, setEntries] = useState([]);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchAllEntries = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/diary/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(res.data);
      } catch (error) {
        console.error("Error fetching all entries:", error);
      }
    };
    fetchAllEntries();
  }, [token]);

  return (
    <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-6 rounded-2xl shadow-lg mt-10 mb-10">
      <h2 className="text-3xl font-bold text-black mb-4 text-center">Diary Management</h2>
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {entries.map((entry) => (
          <li key={entry._id} className="bg-pink-50 p-4 rounded-md">
            <h4 className="font-bold text-lg">{entry.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{new Date(entry.date).toLocaleDateString()}</p>
            <p className="text-gray-800 mb-2">{entry.content}</p>
            <p className="text-xs text-gray-500">User ID: {entry.userId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiaryManagement;
