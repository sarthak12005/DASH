import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { format } from "date-fns";

const DiaryManagement = () => {
  const [entries, setEntries] = useState([]);
  const token = localStorage.getItem("accessToken");

  const [block, setBlock] = useState(false);
  const email = localStorage.getItem("email");

  const [seen, setSeen] = useState([]);
  const [unseen, setUnseen] = useState([]);

  const handleDairySeen = async (id) => {
    try {
      console.log("Diary ID:", id);
      const res = await axios.put(
        `${API_URL}/api/diary/${id}`,
        { seen: true },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Success:", res.data);
    } catch (err) {
      console.error("Error marking diary entry as seen:", err);
    }
  };


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

  useEffect(() => {
    const filterEntries = () => {
      const seenEntries = entries.filter(entry => entry.seen === true);
      const unseenEntries = entries.filter(entry => entry.seen === false);
      setSeen(seenEntries);
      setUnseen(unseenEntries);
    }

    filterEntries();
  }, [entries]);

  return (
    <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-20 rounded-2xl shadow-lg mt-25 mb-10">
      <h2 className="text-3xl font-bold text-black mb-4 text-center">Diary Management</h2>
      <div className="buttons w-full flex justify-start gap-5 items-center p-5 ">
        <button className="px-3.5 py-2.5 bg-white text-black rounded-4xl " onClick={() => setBlock(true)}>Seen</button>
        <button className="px-3.5 py-2.5 bg-white text-black rounded-4xl " onClick={() => setBlock(false)}>Unseen</button>
      </div>
      <ul className={`space-y-2 ${email === 'dash2006@gmail.com' ? "max-h-[95vh]" : "max-h-96"} ${email === 'dash2006@gmail.com' ? "overflow-visible" : "overflow-y-auto"} `}>
        {block ? (
          <>
            {seen.map((entry, index) => (
              <li key={index} className="bg-pink-50 p-4 rounded-md relative">
                <h4 className="font-bold text-lg">{entry.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{new Date(entry.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600 mb-2">{entry?.date ? format(new Date(entry.date), 'hh:mm a') : "Invalid Time"}</p>
                <p className="text-gray-800 mb-2">{entry.content}</p>
                <p className="text-xs text-gray-500">User Email: {entry.userId}</p>
                <p className="text-xs text-gray-500">Seen: {entry.seen ? "Yes" : "No"}</p>
                {!entry.seen &&
                  <button
                    onClick={() => handleDairySeen(entry._id)}
                    className="bg-blue-500 hover:bg-black text-white  px-4 py-2 rounded-lg bottom-2 right-2 absolute"
                  >
                    Mark Seen
                  </button>
                }
              </li>
            ))}
          </>
        ) : (
          <>
            {unseen.map((entry) => (
              <li key={entry._id} className="bg-pink-50 p-4 rounded-md relative">
                <h4 className="font-bold text-lg">{entry.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{new Date(entry.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600 mb-2">{entry?.date ? format(new Date(entry.date), 'hh:mm a') : "Invalid Time"}</p>
                <p className="text-gray-800 mb-2">{entry.content}</p>
                <p className="text-xs text-gray-500">User Email: {entry.userId}</p>
                <p className="text-xs text-gray-500">Seen: {entry.seen ? "Yes" : "No"}</p>
                {!entry.seen &&
                  <button
                    onClick={() => handleDairySeen(entry._id)}
                    className="bg-blue-500 hover:bg-black text-white  px-4 py-2 rounded-lg bottom-2 right-2 absolute"
                  >
                    Mark Seen
                  </button>
                }
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
};

export default DiaryManagement;
