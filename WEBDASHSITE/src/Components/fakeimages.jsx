import { motion } from 'framer-motion';
import Image4 from '../assets/About.webp';
import Image5 from '../assets/Provide.webp';
import Image6 from '../assets/Owner.webp';
import Image7 from '../assets/Need.webp';

const FakeImages = () => {
  return (
    <div className="bg-yellow-200 py-16 px-6">
      {[ 
        { img: Image4, text: "Every story has a beginning, and ours starts here. 'About Us' isn’t just a title — it’s the heart of who we are. It’s about the dreams that brought us together, the challenges we’ve faced, and the passion that drives us forward.", reverse: false },
        { img: Image5, text: "What we offer is more than just services — it’s a promise. A promise to deliver quality, care, and innovation in everything we do. Whether it’s through our products or the support we provide, our mission is to make a meaningful impact.", reverse: true },
        { img: Image6, text: "You hold the power to shape your journey. Being the owner means more than just holding a title — it’s about embracing responsibility, taking charge, and believing in your vision.", reverse: false },
        { img: Image7, text: "Every purpose has a reason. Every journey has a cause. Understanding 'Why We Need' is about recognizing what matters most — connection, growth, and impact.", reverse: true },
      ].map(({ img, text, reverse }, index) => (
        <div key={index} className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center mb-12`}> 
          <motion.img
            src={img}
            alt="Memory"
            className="w-[80%] md:w-[45%] rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: reverse ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            className="w-[80%] md:w-[45%] p-4 md:p-6 text-center md:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-lg md:text-xl font-semibold text-black leading-snug md:leading-relaxed text-justify">
              {text}
            </h2>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default FakeImages;
