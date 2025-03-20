import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const dailyTasksList = [
  "Wake up at 5:30 AM",
  "Drink 2 glasses of water",
  "Exercise for 15 minutes",
  "meditation for 10 min ",
  "Get freshened up",
  "Learn 10 words & sentences",
  "BreakFast",
  "1-hour break",
  "Go to college || Study session for 2 hours",
  "Lunch ",
  "Sleep 2 hours",
  "Study session 2 hours",
  "drink plenty of water please ",
  "sleep before 11.30 pm ",
];

const DailyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(() => localStorage.getItem("lastUpdated") || "");
  const [progress, setProgress] = useState(() => JSON.parse(localStorage.getItem("progress")) || Array(30).fill(0));

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    if (lastUpdated !== today) {
      const initialTasks = dailyTasksList.map((task) => ({ text: task, completed: false }));
      setTasks(initialTasks);
      setLastUpdated(today);
      localStorage.setItem("lastUpdated", today);
      localStorage.setItem("dailyTasks", JSON.stringify(initialTasks));
    } else {
      setTasks(JSON.parse(localStorage.getItem("dailyTasks")) || dailyTasksList.map((task) => ({ text: task, completed: false })));
    }
  }, [lastUpdated]);

  useEffect(() => {
    if (tasks.length > 0 && tasks.every((task) => task.completed)) {
      Swal.fire({
        title: "Congratulations! 🎉",
        text: "You completed all your daily tasks. Keep up the great work!",
        icon: "success",
        confirmButtonColor: "#ff69b4",
      });

      const todayIndex = new Date().getDate() - 1;
      const completedTasks = tasks.filter((task) => task.completed).length;
      const newProgress = [...progress];
      if (completedTasks === dailyTasksList.length) newProgress[todayIndex] = 3;
      else if (completedTasks >= 5) newProgress[todayIndex] = 2;
      else if (completedTasks > 0) newProgress[todayIndex] = 1;
      else newProgress[todayIndex] = 0;

      setProgress(newProgress);
      localStorage.setItem("progress", JSON.stringify(newProgress));
    }
  }, [tasks]);

  const completeTask = (index) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task, i) =>
        i === index ? { ...task, completed: true } : task
      );
      localStorage.setItem("dailyTasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  };

  const getBoxColor = (completed) => {
    switch (completed) {
      case 1: return "bg-green-200"; // Light green
      case 2: return "bg-green-400"; // Medium green
      case 3: return "bg-green-600"; // Bright green
      default: return "bg-gray-200"; // No tasks completed
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-pink-100 to-pink-200">
      <Navbar />
      <div className="flex-grow flex flex-col items-center py-10 mt-20">
        <h2 className="text-4xl font-bold mb-6 text-pink-700 animate-fade-in">Daily Tasks</h2>
        <p className="text-gray-600 mb-4">Complete these tasks to make your day productive!</p>

        {/* Progress Tracker
        <div className="grid grid-cols-10 gap-2 mb-6">
          {progress.map((completed, index) => (
            <div key={index} className={`w-6 h-6 rounded-md ${getBoxColor(completed)} border border-gray-300`} />
          ))}
        </div> */}

        {/* Tasks List */}
        <ul className="w-3/4 md:w-1/2">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className={`p-4 my-3 bg-white rounded-md shadow-lg flex justify-between items-center transition-all ${task.completed ? "line-through text-gray-400 bg-gray-100" : "hover:bg-pink-50"}`}
              >
                {task.text}
                <button
                  onClick={() => completeTask(index)}
                  className={`px-3 py-1 rounded-md transition-all ${task.completed ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"}`}
                  disabled={task.completed}
                >
                  <CheckCircle size={20} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Progress Tracker */}
        <div className="grid grid-cols-10 gap-2 mb-6 mt-10">
          {progress.map((completed, index) => (
            <div key={index} className={`w-10 h-10 rounded-md ${getBoxColor(completed)} border border-gray-300 flex justify-center items-center`} >{index+1}</div>
          ))}
        </div>
      </div>
      {/* <Footer /> */}


    </div>
  );
};

export default DailyTasks;
