import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, CheckCircle } from "lucide-react";
import Navbar from "../Components/navbar";
// import Footer from "../components/Footer";

const Tasks = () => {
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });
  const [newTask, setNewTask] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask("");
      setShowModal(false);
    }
  };

  const completeTask = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, completed: true } : task
      )
    );
    setTimeout(() => {
      setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    }, 500);
  };

  const [display, setDisplay] = useState('tasks');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow flex flex-col items-center py-10 mt-20">
        <h2 className="text-3xl font-bold mb-6 text-pink-600">Daily Goals</h2>

        {tasks.length === 0 ? (
          <p className="text-gray-500 text-lg">No tasks yet. Add one!</p>
        ) : (
          <ul className="w-1/2">
            <AnimatePresence>
              {tasks.map((task, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 my-2 bg-white rounded-md shadow-md flex justify-between items-center transition-all ${task.completed ? "line-through text-gray-400" : "hover:bg-pink-50"}`}
                >
                  {task.text}
                  <button
                    onClick={() => completeTask(index)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-all"
                  >
                    <CheckCircle size={20} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="fixed top-25 right-10 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-all"
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
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
          >
            <h3 className="text-xl font-bold mb-4">Add New Task</h3>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-400 transition-all w-64"
              placeholder="Enter a task..."
            />
            <div className="flex space-x-4 mt-4">
              <button
                onClick={addTask}
                className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-all"
              >
                Add Task
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

      {/* <Footer /> */}
    </div>
  );
};

export default Tasks;
