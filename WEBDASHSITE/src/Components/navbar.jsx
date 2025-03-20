import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo Placeholder (Change it later) */}
          <h1 className="text-2xl font-bold text-black">WEBDASH</h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {["Home", "Tasks", "Solutions","DailyTasks", "Diary", "Study", ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`} // ✅ Fix Home path
                  className="text-gray-700 font-medium hover:text-black transition"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
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
            {["Home", "Tasks", "Solutions","dailyTasks", "Diary", "Study",].map((item, index) => (
              <Link
                key={index}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`} // ✅ Fix Home path
                className="text-gray-700 font-medium py-2 hover:text-pink-500 transition"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
