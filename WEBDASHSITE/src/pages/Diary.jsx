import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2, Eye } from "lucide-react";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";

const Diary = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const Token = localStorage.getItem("accessToken");
    if (Token) {
      axios.get(`${API_URL}/api/diary`, {
        headers: { Authorization: `Bearer ${Token}` },
      })
      .then((response) => setEntries(response.data))
      .catch((error) => {
        console.error("Error fetching diary entries:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      });
    }
  }, []);

  const addEntry = () => {
    const Token = localStorage.getItem("accessToken");
    console.log(Token, newEntry);
    if (Token && newEntry.trim() !== "") {
      axios.post(
        `${API_URL}/api/diary`,
        {
          date: new Date().toISOString(),
          title: "New Entry",  // You can make this dynamic if needed
          content: newEntry,
        },
        {
          headers: { Authorization: `Bearer ${Token}` },
        }
      )
      .then((response) => {
        setEntries([...entries, response.data]);
        setNewEntry("");
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error adding entry:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      });
    }
  };
  

  const deleteEntry = (id) => {
    const Token = localStorage.getItem("accessToken");
    axios.delete(`${API_URL}/api/diary/${id}`, {
      headers: { Authorization: `Bearer ${Token}` },
    })
    .then(() => {
      setEntries(entries.filter((entry) => entry._id !== id));
    })
    .catch((error) => {
      console.error("Error deleting entry:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    });
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow flex flex-col items-center py-10 mt-20">
        <h2 className="text-3xl font-bold mb-6 text-black">My Diary</h2>
        <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 h-[250px] bg-white rounded-lg shadow-md flex flex-col justify-between transition-all hover:bg-pink-50"
                >
                  <h3 className="text-lg font-semibold text-gray-700">{new Date(entry.createdAt).toLocaleDateString()}</h3>
                  <button
                    onClick={() => setSelectedEntry(entry)}
                    className="mt-2 w-[88px] bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all flex items-center justify-center"
                  >
                    <Eye size={20} className="mr-1" /> View
                  </button>
                  <button
                    onClick={() => deleteEntry(entry._id)}
                    className="mt-2 w-[88px] bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No diary entries yet. Start writing!</p>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-10 right-10 bg-yellow-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-all"
        >
          <PlusCircle size={32} />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center w-96"
          >
            <h3 className="text-xl font-bold mb-4">Write Your Diary</h3>
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              className="w-full h-60 px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-400 transition-all"
              placeholder="Write your thoughts..."
            ></textarea>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={addEntry}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-all"
              >
                Add Entry
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center w-96"
          >
            <h3 className="text-xl font-bold mb-4">{new Date(selectedEntry.createdAt).toLocaleDateString()}</h3>
            <p className="text-gray-700 text-lg text-center break-words">{selectedEntry.content}</p>
            <button
              onClick={() => setSelectedEntry(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
      {/* <Footer /> */}
    </div>
  );
};

export default Diary;
