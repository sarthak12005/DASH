import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Study = () => {
  const [entries, setEntries] = useState(() => {
    return JSON.parse(localStorage.getItem("studyEntries")) || [];
  });
  const [newEntry, setNewEntry] = useState({
    date: "",
    topic: "",
    subPoints: "",
    startTime: "",
    endTime: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("studyEntries", JSON.stringify(entries));
  }, [entries]);

  const calculateStudyDuration = (start, end) => {
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    const duration = (endTime - startTime) / (1000 * 60); // Convert to minutes
    return duration > 0 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : "Invalid Time";
  };

  const addEntry = () => {
    if (newEntry.date && newEntry.topic && newEntry.startTime && newEntry.endTime) {
      setEntries([...entries, { ...newEntry, duration: calculateStudyDuration(newEntry.startTime, newEntry.endTime) }]);
      setNewEntry({ date: "", topic: "", subPoints: "", startTime: "", endTime: "" });
      setShowModal(false);
    }
  };

  const deleteEntry = (index) => {
    setEntries((prevEntries) => prevEntries.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen  flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow flex flex-col items-center py-10 mt-20">
        <h2 className="text-3xl font-bold mb-6 text-pink-600">Study Tracker</h2>
        <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {entries.length > 0 ? (
              entries.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 bg-white rounded-lg shadow-md flex flex-col justify-between transition-all hover:bg-pink-50"
                >
                  <h3 className="text-lg font-semibold text-gray-700">{entry.date}</h3>
                  <p className="text-gray-800 font-medium">{entry.topic}</p>
                  <p className="text-gray-600 italic">{entry.subPoints}</p>
                  <p className="mt-2 text-gray-600">Duration: {entry.duration}</p>
                  <button
                    onClick={() => deleteEntry(index)}
                    className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No study records yet. Start tracking!</p>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-10 right-10 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-all"
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
            <h3 className="text-xl font-bold mb-4">Add Study Session</h3>
            <input type="date" value={newEntry.date} onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })} className="w-full px-4 py-2 border rounded-md mb-2" />
            <input type="text" placeholder="Main Topic" value={newEntry.topic} onChange={(e) => setNewEntry({ ...newEntry, topic: e.target.value })} className="w-full px-4 py-2 border rounded-md mb-2" />
            <textarea placeholder="Sub Points" value={newEntry.subPoints} onChange={(e) => setNewEntry({ ...newEntry, subPoints: e.target.value })} className="w-full px-4 py-2 border rounded-md mb-2"></textarea>
            <input type="time" value={newEntry.startTime} onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })} className="w-full px-4 py-2 border rounded-md mb-2" />
            <input type="time" value={newEntry.endTime} onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })} className="w-full px-4 py-2 border rounded-md mb-2" />
            <div className="flex space-x-4 mt-4">
              <button onClick={addEntry} className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-all">Add Entry</button>
              <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-all">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
      {/* <Footer /> */}
    </div>
  );
};

export default Study;