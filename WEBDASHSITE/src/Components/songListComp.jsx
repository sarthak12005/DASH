import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaDownload, FaHeart, FaRegHeart } from 'react-icons/fa';
import { IoMdMusicalNote } from 'react-icons/io';
import axios from 'axios';
import { API_URL } from "../config";

const SongListComp = () => {
    // All hooks declared at the top (no conditional hooks)
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const audioRef = useRef(null);


    // Fetch songs effect
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/real-songs`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (!response.data || response.data.length === 0) {
                    throw new Error('No songs found in database');
                }
                const formattedSongs = response.data.map(song => ({
                    id: song._id,
                    title: song.title,
                    artist: song.artist || 'Bunny',
                    coverImage: song.imageUrl,
                    audioUrl: song.audioUrl,
                    createdAt: song.createdAt
                }));
                setSongs(formattedSongs);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSongs();
    }, []);

    // Handle play/pause effect
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSong]);

    // Helper functions
    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
    };

    const playSong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
        if (newVolume == 0) {
            setIsMuted(true);
        } else {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        if (isMuted) {
            audioRef.current.volume = volume;
        } else {
            audioRef.current.volume = 0;
        }
        setIsMuted(!isMuted);
    };

    const handleSeek = (e) => {
        const seekTime = e.target.value;
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const toggleFavorite = (songId) => {
        if (favorites.includes(songId)) {
            setFavorites(favorites.filter(id => id !== songId));
        } else {
            setFavorites([...favorites, songId]);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSongEnd = () => {
        const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
        const nextIndex = (currentIndex + 1) % songs.length;
        playSong(songs[nextIndex]);
    };

    // Conditional rendering logic
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading songs</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (songs.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No songs found</h3>
                <p className="mt-1 text-sm text-gray-500">Try uploading some songs</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-yellow-400 to-yellow-600 text-white">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto pb-32">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold mb-8 text-center">Your Music Library</h1>
                    {/* Songs List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto">
                        {songs.map((song) => (
                            <div
                                key={song.id}
                                className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20 cursor-pointer ${currentSong?.id === song.id ? 'ring-2 ring-indigo-400' : ''}`}
                                onClick={() => playSong(song)}
                                style={{ minWidth: '200px', flex: '0 0 auto' }} // Ensure consistent width for horizontal scrolling
                            >
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <img
                                            src={song.coverImage}
                                            alt={song.title}
                                            className="w-24 h-24 rounded-lg object-cover"
                                        />
                                        {currentSong?.id === song.id && isPlaying && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                                                <IoMdMusicalNote className="text-white animate-pulse text-xl" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold line-clamp-1">{song.title}</h3>
                                        <p className="text-sm text-white/80 mb-2">{song.artist}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(song.id);
                                            }}
                                            className="text-lg hover:scale-110 transition-transform"
                                        >
                                            {favorites.includes(song.id) ? (
                                                <FaHeart className="text-red-500" />
                                            ) : (
                                                <FaRegHeart className="text-white/70 hover:text-red-500" />
                                            )}
                                        </button>
                                        <a
                                            href={song.audioUrl}
                                            download
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-lg text-white/70 hover:text-indigo-300 transition-colors"
                                        >
                                            <FaDownload />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Player Bar */}
            {currentSong && (
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-500 to-yellow-700 p-4 shadow-lg">
                    <div className="container mx-auto flex flex-col md:flex-row items-center gap-4">
                        {/* Song Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <img
                                src={currentSong.coverImage}
                                alt={currentSong.title}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="min-w-0">
                                <h4 className="font-semibold text-lg truncate">{currentSong.title}</h4>
                                <p className="text-sm text-white/80 truncate">{currentSong.artist}</p>
                            </div>
                        </div>
                        {/* Controls */}
                        <div className="flex flex-col items-center w-full md:w-auto">
                            <div className="flex items-center gap-6 mb-2">
                                <button
                                    onClick={togglePlayPause}
                                    className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
                                >
                                    {isPlaying ? <FaPause /> : <FaPlay />}
                                </button>
                            </div>
                            {/* Progress Bar */}
                            <div className="flex items-center gap-2 w-full max-w-md">
                                <span className="text-xs w-10 text-right">{formatTime(currentTime)}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 100}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="flex-1 h-1 bg-white/30 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                />
                                <span className="text-xs w-10">{formatTime(duration)}</span>
                            </div>
                        </div>
                        {/* Volume Control */}
                        <div className="flex items-center gap-2 flex-1 justify-end">
                            <button onClick={toggleMute} className="text-lg">
                                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-24 h-1 bg-white/30 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* Audio Element (hidden) */}
            <audio
                ref={audioRef}
                src={currentSong?.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleSongEnd}
                onLoadedMetadata={handleTimeUpdate}
            />
        </div>
    );
};

export default SongListComp;