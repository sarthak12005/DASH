import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketService } from '../utils/socketClient';
import axios from 'axios';
import { API_URL } from '../config';
import { getUserIdFromToken } from '../utils/auth';
import { jwtDecode } from 'jwt-decode';

const ChatPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');


    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
            return;
        }

        const userId = getUserIdFromToken(accessToken) || jwtDecode(accessToken)._id;


        // Initialize socket connection
        try {
            socketService.initialize(accessToken);

            // Fetch users list
            const fetchUsers = async () => {
                try {
                    const { data } = await axios.get(`${API_URL}/api/chat/users`, {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });

                    // Validate and set users data with defaults
                    const validatedUsers = data.map(user => ({
                        _id: user._id || 'unknown-id',
                        name: user.name || 'Unknown User',
                        online: user.online || false,
                        lastSeen: user.lastSeen || new Date()
                    }));

                    const actualUsers = validatedUsers.filter(user => user._id !== userId);

                    setUsers(actualUsers);
                } catch (err) {
                    setError('Failed to load users');
                    console.error('Fetch error:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchUsers();

            // Setup socket listeners with data validation
            const unsubscribeOnline = socketService.subscribe(
                'user-online',
                (userId) => {
                    setUsers(prev => prev.map(u => ({
                        ...u,
                        name: u.name || 'Unknown User',
                        online: u._id === userId ? true : u.online
                    })));
                }
            );

            const unsubscribeOffline = socketService.subscribe(
                'user-offline',
                (userId) => {
                    setUsers(prev => prev.map(u => ({
                        ...u,
                        name: u.name || 'Unknown User',
                        online: u._id === userId ? false : u.online
                    })));
                }
            );

            return () => {
                unsubscribeOnline();
                unsubscribeOffline();
            };
        } catch (err) {
            setError('Connection error');
            console.error('Socket error:', err);
            setLoading(false);
        }
    }, [accessToken, navigate]);

    const handleUserClick = (userId) => {
        navigate(`/chat/${userId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-amber-50 to-amber-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-amber-800 font-medium">Loading your chats...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-amber-50 to-amber-100">
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="text-amber-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-amber-800 mb-2">{error}</h3>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-amber-50 to-amber-100">
            {/* Header */}
            <div className="bg-amber-600 text-white p-4 shadow-lg">
                <div className="container mx-auto px-2.5 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/tasks')}
                        className="mr-4 p-1 rounded-full hover:bg-amber-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold">Messages</h1>
                    {/* <button className="p-2 rounded-full hover:bg-amber-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button> */}
                </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto p-4 container mx-auto">
                {users.length === 0 ? (
                    <div className="text-center py-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h3 className="text-xl font-medium text-amber-800 mt-4">No conversations yet</h3>
                        <p className="text-amber-600">Start a new chat with your friends</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {users.map(user => (
                            <div
                                key={user._id}
                                onClick={() => handleUserClick(user._id)}
                                className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-amber-100 hover:border-amber-200"
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-xl">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                </div>

                                <div className="ml-4 flex-1 min-w-0">
                                    <h3 className="font-semibold text-amber-900 truncate">{user.name}</h3>
                                    <p className={`text-sm truncate ${user.online ? 'text-green-600' : 'text-gray-500'}`}>
                                        {user.online ? 'Online now' : `Last seen ${new Date(user.lastSeen).toLocaleTimeString()}`}
                                    </p>
                                </div>

                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;