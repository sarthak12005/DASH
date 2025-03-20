import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const ppts = [
  { id: 1, title: "Get well soon", file: "/Get well soon.pptx" },
  { id: 2, title: "Solutions", file: "/SOLUTIONS ON THE PROBSOLUTIONS ON THE PROBLEMS.pptx" },
  { id: 3, title: "Personal", file: "/PERSONAL PPT.pptx" },
];

const Solutions = () => {
  const [selectedPPT, setSelectedPPT] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-pink-100 py-10 px-6 mt-[80px]">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Solutions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {ppts.map((ppt) => (
            <motion.div
              key={ppt.id}
              className="bg-white p-4 rounded-lg shadow-lg cursor-pointer text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="h-48 bg-gray-300 flex items-center justify-center text-xl font-semibold text-gray-700"
                onClick={() => setSelectedPPT(ppt.file)}
              >
                {ppt.title}
              </div>
              <a
                href={ppt.file}
                download
                className="mt-3 inline-block bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-all"
              >
                Download
              </a>
            </motion.div>
          ))}
        </div>
        {selectedPPT && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6" onClick={() => setSelectedPPT(null)}>
            <div className="bg-white p-4 rounded-lg shadow-lg w-[95vw] h-[95vh] flex flex-col items-center justify-center relative mt-20" onClick={(e) => e.stopPropagation()}>
              <embed src={selectedPPT} type="application/pdf" width="100%" height="90%" className="rounded-md shadow-md mt-40" />
              <button
                onClick={() => setSelectedPPT(null)}
                className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Solutions;
