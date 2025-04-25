import React, { useState } from 'react';
import SongUpload from '../Components/SongUpload';
import Navbar from '../Components/navbar';
import SongListComp from '../Components/songListComp';

const SongPage = () => {
    const [view, setView] = useState('list'); // 'list' or 'upload'
    const [activeTab, setActiveTab] = useState('list');
    const role = localStorage.getItem('role');

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 mt-12">
            <Navbar />

            {/* Tab Navigation */}
            <div className="container mx-auto px-4 py-8 ">
                {role === 'admin' &&
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex rounded-lg bg-white p-1 shadow-md">
                            <button
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${activeTab === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-indigo-50'}`}
                                onClick={() => {
                                    setView('list');
                                    setActiveTab('list');
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                    View Songs
                                </span>
                            </button>
                            <button
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${activeTab === 'upload' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-indigo-50'}`}
                                onClick={() => {
                                    setView('upload');
                                    setActiveTab('upload');
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Add Songs
                                </span>
                            </button>
                        </div>
                    </div>

                }
                {/* Content Area */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {view === 'list' ? (
                        <SongListComp />
                    ) : (
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                                    <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                                </svg>
                                Upload New Song
                            </h2>
                            <SongUpload />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SongPage;