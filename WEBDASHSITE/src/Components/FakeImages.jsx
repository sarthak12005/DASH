import { motion } from 'framer-motion';
import Image4 from '../assets/About.webp';
import Image5 from '../assets/Provide.webp';
import Image6 from '../assets/Owner.webp';
import Image7 from '../assets/Need.webp';

const FakeImages = () => {
  return (
    <div className="bg-yellow-200 py-16 px-6">
      <div className="flex flex-col md:flex-row items-center mb-12">
        <motion.img
          src={Image4}
          alt="Memory"
          className="w-[70%] md:w-1/2 rounded-2xl shadow-lg"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="w-[70%] md:w-1/2 p-6 text-center md:text-left"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-black leading-relaxed">Every story has a beginning, and ours starts here. “About Us” isn’t just a title — it’s the heart of who we are. It’s about the dreams that brought us together, the challenges we’ve faced, and the passion that drives us forward. Every step we take is shaped by our commitment to making a difference. Our journey is not just about where we’ve been, but where we’re headed — and we’re excited to have you with us every step of the way.</h2>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row-reverse items-center mb-12">
        <motion.img
          src={Image5}
          alt="Memory"
          className="w-[70%] md:w-1/2 rounded-2xl shadow-lg"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="w-[70%] md:w-1/2 p-6 text-center md:text-left"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-black leading-relaxed">What we offer is more than just services — it’s a promise. A promise to deliver quality, care, and innovation in everything we do. Whether it’s through our products or the support we provide, our mission is to make a meaningful impact. We’re here to offer solutions that inspire, empower, and create lasting value. What we provide isn’t just what we do — it’s who we are.</h2>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row items-center mb-12">
        <motion.img
          src={Image6}
          alt="Memory"
          className="w-[70%] md:w-1/2 rounded-2xl shadow-lg"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="w-[70%] md:w-1/2 p-6 text-center md:text-left"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-black leading-relaxed">You hold the power to shape your journey. Being the owner means more than just holding a title — it’s about embracing responsibility, taking charge, and believing in your vision. You have the strength to create, to lead, and to inspire those around you. This is your story, your journey, and your legacy. Own it with pride, knowing that every step you take shapes the future ahead.</h2>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row-reverse items-center">
        <motion.img
          src={Image7}
          alt="Memory"
          className="w-[70%] md:w-1/2 rounded-2xl shadow-lg"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="w-[70%] md:w-1/2 p-6 text-center md:text-left"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-black leading-relaxed">Every purpose has a reason. Every journey has a cause. Understanding “Why We Need” is about recognizing what matters most — connection, growth, and impact. It’s about building something that lasts, creating change that inspires, and embracing the reasons that push us forward. Our needs drive our purpose, and our purpose shapes our path. In understanding why, we discover who we truly are.</h2>
        </motion.div>
      </div>
    </div>
  );
};

export default FakeImages;
