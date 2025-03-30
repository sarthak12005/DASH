import { motion } from "framer-motion";
import {useNavigate} from 'react-router-dom';



const FakeHero = () => {

  const navigate = useNavigate();
  return (
    <>
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#FFFF00] mt-4">
      
         <div className="relative w-full max-w-5xl flex items-center justify-center">
          <motion.div
            className="absolute flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <h1
              className="text-8xl font-extrabold text-black text-center drop-shadow-lg"
              style={{ fontFamily: "'Dancing Script', cursive", textShadow: "0 0 15px rgba(255, 255, 255, 0.8)" }}
            >
             
             The website with all fuctions you need
            </h1>
            <p className="text-2xl text-black text-center mt-2 opacity-90">
            Hey! how are you here's what you want
            </p>
          </motion.div>
        </div> 
      </div>
      <div className="heroButton w-full h-45 bg-[#e1e10fc5] flex justify-center items-center">
        <div className="h-btn w-[100%] h-[65%] flex flex-wrap gap-4 justify-center items-center md:w-[25%]">
          <button
            className="py-3 px-7 bg-[#FF69B4] rounded-3xl h-10 flex justify-center items-center shadow-pink-700 shadow-2xl"
            onClick={() => navigate('/tasks')} // ✅ Now it works!
          >
            Tasks
          </button>
          <button className="py-3 px-7 bg-[#BA55D3] rounded-3xl h-10 flex justify-center items-center shadow-pink-500 shadow-2xl"
            onClick={() => navigate('/solutions')} // ✅ Add navigation for other buttons
          >
            Solutions
          </button>
          <button className="py-3 px-7 bg-[#87CEEB] rounded-3xl h-10 flex justify-center items-center shadow-pink-500 shadow-2xl"
            onClick={() => navigate('/diary')}
          >
            Diary
          </button>
          <button className="py-3 px-7 bg-[#FFD700] rounded-3xl h-10 flex justify-center items-center shadow-pink-500 shadow-2xl"
            onClick={() => navigate('/study')}
          >
            Study
          </button>
          <button className="py-3 px-7 bg-[#FFA07A] rounded-3xl h-10 flex justify-center items-center shadow-pink-500 shadow-2xl"
            onClick={() => navigate('/')}
          >
            Home
          </button>
        </div>
      </div>
    </>
  );
};

export default FakeHero;
