import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userEmail = localStorage.getItem('email');
    setRole(userRole);
    setEmail(userEmail);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo Placeholder (Change it later) */}
          <h1 className="text-2xl font-bold text-black">WEBDASH</h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {["Home", "Tasks", "Solutions", "DailyTasks", "Diary", "Study", "Song"].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-gray-700 font-medium hover:text-black transition"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
            {role === "admin" && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/admin"
                  className="text-gray-700 font-medium hover:text-black transition"
                >
                  Admin
                </Link>
              </motion.div>
            )}
            {email === "dash2006@gmail.com" && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/admin"
                  className="text-gray-700 font-medium hover:text-black transition"
                >
                  Admin
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden flex flex-col items-center bg-white py-4 shadow-lg">
            {["Home", "Tasks", "Solutions", "DailyTasks", "Diary", "Study", "Song"].map((item, index) => (
              <Link
                key={index}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-gray-700 font-medium py-2 hover:text-pink-500 transition"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
            {role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-700 font-medium py-2 hover:text-pink-500 transition"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}
            {email === "dash2006@gmail.com" && (
              <Link
                to="/admin"
                className="text-gray-700 font-medium py-2 hover:text-pink-500 transition"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
