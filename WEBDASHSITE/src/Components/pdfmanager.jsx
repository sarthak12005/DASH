import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const PdfManager = () => {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    const storedPdfs = JSON.parse(localStorage.getItem("pdfs")) || [];
    setPdfs(storedPdfs);
  }, []);

  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPdfs = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    const updatedPdfs = [...pdfs, ...newPdfs];
    setPdfs(updatedPdfs);
    localStorage.setItem("pdfs", JSON.stringify(updatedPdfs));
  };

  const handleDelete = (index) => {
    const updatedPdfs = pdfs.filter((_, i) => i !== index);
    setPdfs(updatedPdfs);
    localStorage.setItem("pdfs", JSON.stringify(updatedPdfs));
  };

  return (
    <div className="py-20 px-10 bg-yellow-100 rounded-xl shadow-lg mt-10 w-11/12 md:w-3/4 mx-auto my-5">
      <h2 className="text-3xl font-bold text-black mb-4 text-center">PDF Manager</h2>
      <div className="flex justify-center mb-6">
        <label className="cursor-pointer bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-balck-600 transition">
          Upload PDFs
          <input
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pdfs.map((pdf, index) => (
          <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline truncate w-4/5"
            >
              {pdf.name}
            </a>
            <button
              onClick={() => handleDelete(index)}
              className="text-red-500 hover:text-red-700 transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      {pdfs.length === 0 && <p className="text-center text-gray-500 mt-4">No PDFs uploaded yet!</p>}
    </div>
  );
};

export default PdfManager;