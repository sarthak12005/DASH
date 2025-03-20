import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-pink-300 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl font-bold cursor-pointer" onClick={() => navigate("/")}>DASH</h1>
        
        {/* Navigation Links */}
        <nav className="flex space-x-6 mt-4 md:mt-0">
          <button onClick={() => navigate("/")} className="hover:text-pink-100 transition duration-300">Home</button>
          <button onClick={() => navigate("/tasks")} className="hover:text-pink-100 transition duration-300">Tasks</button>
          <button onClick={() => navigate("/solutions")} className="hover:text-pink-100 transition duration-300">Solutions</button>
          <button onClick={() => navigate("/diary")} className="hover:text-pink-100 transition duration-300">Diary</button>
          <button onClick={() => navigate("/study")} className="hover:text-pink-100 transition duration-300">Study</button>
        </nav>
      </div>
      
      {/* Message */}
      <p className="mt-6 text-lg font-semibold">Happy Birthday! 🎉 Wishing you endless joy and happiness!</p>
    </footer>
  );
};

export default Footer;