import axios from 'axios';
import { useState, useRef } from 'react';
import { FaMusic, FaImage, FaUpload, FaCheck, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import { API_URL } from '../config';

const SongUpload = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [audio, setAudio] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const imageInputRef = useRef(null);
    const audioInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !image || !audio) {
            setUploadStatus({ success: false, message: 'Please fill all fields' });
            return;
        }

        setIsUploading(true);
        setUploadStatus(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);
        formData.append('audio', audio);

        try {
            const res = await axios.post(`${API_URL}/api/upload'`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadStatus({ success: true, message: 'Upload successful!' });
            // Reset form
            setTitle('');
            setImage(null);
            setAudio(null);
            if (imageInputRef.current) imageInputRef.current.value = '';
            if (audioInputRef.current) audioInputRef.current.value = '';
        } catch (err) {
            setUploadStatus({ success: false, message: 'Upload failed. Please try again.' });
            console.error('Error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleAudioChange = (e) => {
        if (e.target.files[0]) {
            setAudio(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition-all duration-300 hover:shadow-xl">
                <div className="p-8">
                    <div className="flex items-center justify-center mb-8">
                        <FaCloudUploadAlt className="h-12 w-12 text-indigo-500 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-800">Upload Your Song</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Input */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Song Title
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaMusic className="h-5 w-5 text-indigo-400" />
                                </div>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md border"
                                    placeholder="Enter song title"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cover Image
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {image ? (
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Preview"
                                                className="h-32 w-32 object-cover rounded-md mb-2"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImage(null);
                                                    if (imageInputRef.current) imageInputRef.current.value = '';
                                                }}
                                                className="text-sm text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label
                                                    htmlFor="image-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                                >
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="image-upload"
                                                        name="image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        ref={imageInputRef}
                                                        className="sr-only"
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Audio Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Audio File
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {audio ? (
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-2">
                                                <FaMusic className="h-6 w-6" />
                                            </div>
                                            <p className="text-sm text-gray-900 truncate max-w-xs">{audio.name}</p>
                                            <p className="text-xs text-gray-500">{(audio.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAudio(null);
                                                    if (audioInputRef.current) audioInputRef.current.value = '';
                                                }}
                                                className="text-sm text-red-500 hover:text-red-700 mt-1"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label
                                                    htmlFor="audio-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                                >
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="audio-upload"
                                                        name="audio-upload"
                                                        type="file"
                                                        accept="audio/*"
                                                        onChange={handleAudioChange}
                                                        ref={audioInputRef}
                                                        className="sr-only"
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">MP3, WAV up to 20MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status Message */}
                        {uploadStatus && (
                            <div className={`rounded-md p-4 ${uploadStatus.success ? 'bg-green-50' : 'bg-red-50'}`}>
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        {uploadStatus.success ? (
                                            <FaCheck className="h-5 w-5 text-green-400" />
                                        ) : (
                                            <FaTimes className="h-5 w-5 text-red-400" />
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className={`text-sm font-medium ${uploadStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                                            {uploadStatus.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isUploading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isUploading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <FaUpload className="-ml-1 mr-2 h-5 w-5" />
                                        Upload Song
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SongUpload;