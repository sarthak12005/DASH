import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import Navbar from "../Components/navbar";

const DailyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // const userId = "123"; // Replace with dynamic userId if needed.
  // const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          console.error("🚨 No token found in localStorage.");
          return;
        }
  
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
        console.log("✅ Decoded Token:", decodedToken);
  
        const userId = decodedToken.id; // ✅ Use 'id' instead of 'userId'
  
        if (!userId) {
          console.error("🚨 User ID not found in token payload:", decodedToken);
          return;
        }
  
        console.log("✅ User ID extracted:", userId);
        const today = new Date().toISOString().split('T')[0]; // Get current date (YYYY-MM-DD)
  
        const response = await axios.get(`${API_URL}/api/daily-tasks/${userId}/${today}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        console.log(response.data);
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasks();
  }, []);
  
  
  
  

  // Mark task as completed
  const completeTask = async (index, taskId) => {
    try {
      // Ensure userId and today are properly defined
      const token = localStorage.getItem('accessToken');
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      const userId = decodedToken.userId; // Ensure userId exists in your token payload
      const today = new Date().toISOString().split('T')[0]; // Get current date (YYYY-MM-DD)
  
      // Fix URL: add '/' between daily-tasks and userId
      await axios.put(`${API_URL}/api/daily-tasks/${userId}/${today}/${taskId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const updatedTasks = tasks.map((task, i) => (i === index ? { ...task, completed: true } : task));
      setTasks(updatedTasks);
  
      // Check if all tasks are completed
      if (updatedTasks.every(task => task.completed)) {
        Swal.fire({
          title: "Congratulations! 🎉",
          text: "You completed all your daily tasks. Keep up the great work!",
          icon: "success",
          confirmButtonColor: "#ff69b4",
        });
      }
    } catch (error) {
      console.error("Error completing task:", error);
      Swal.fire("Error", "Could not update task", "error");
    }
  };
  

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-lg">Loading tasks...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-yellow-100 to-yellow-200">
      <Navbar />
      <div className="flex-grow flex flex-col items-center py-10 mt-20">
        <h2 className="text-4xl font-bold mb-6 text-black animate-fade-in">Daily Tasks</h2>
        <p className="text-gray-600 mb-4">Complete these tasks to make your day productive!</p>

        {/* Tasks List */}
        <ul className="w-3/4 md:w-1/2">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.li
                key={task._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className={`p-4 my-3 bg-white rounded-md shadow-lg flex justify-between items-center transition-all ${task.completed ? "line-through text-gray-400 bg-gray-100" : "hover:bg-pink-50"}`}
              >
                {task.task}
                <button
                  onClick={() => completeTask(index, task._id)}
                  className={`px-3 py-1 rounded-md transition-all ${task.completed ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"}`}
                  disabled={task.completed}
                >
                  <CheckCircle size={20} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};

export default DailyTasks;
