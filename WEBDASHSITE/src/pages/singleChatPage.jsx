import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socketService } from '../utils/socketClient';
import axios from 'axios';
import { API_URL } from '../config';
import { getUserIdFromToken } from '../utils/auth';
import { jwtDecode } from 'jwt-decode';

const SingleChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState('');
  const typingTimeoutRef = useRef(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef();
  const accessToken = localStorage.getItem('accessToken');
  const currentUserId = getUserIdFromToken(accessToken) || jwtDecode(accessToken)?._id;

  // Fetch chat data
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch recipient info
        const { data: recipientData } = await axios.get(`${API_URL}/api/chat/users/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setRecipient(recipientData);

        // Fetch message history
        const { data: messagesData } = await axios.get(
          `${API_URL}/api/chat/messages/${currentUserId}/${userId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setMessages(messagesData);

        setLoading(false);
      } catch (err) {
        setError('Failed to load chat');
        setLoading(false);
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, [userId, currentUserId, accessToken, navigate]);

  // Setup socket listeners
  // Setup socket listeners
  // Replace your socket listeners with this:
  useEffect(() => {
    if (!socketService.socket) return;

    const handleChatMessage = (message) => {
      setMessages(prev => {
        // If this is an update for an optimistic message
        if (message.tempId) {
          return prev.map(msg =>
            msg._id === message.tempId ? { ...message, status: 'delivered' } : msg
          );
        }

        // Check if message already exists
        const exists = prev.some(m => m._id === message._id);
        return exists ? prev : [...prev, message];
      });
    };

    // Use the subscription pattern from socketService
    const cleanup = socketService.subscribe('chat-message', handleChatMessage);

    return () => cleanup();
  }, [userId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing events with debounce
  const handleTyping = useCallback((isTyping) => {
    if (!socketService.socket || !userId) return;

    socketService.socket.emit('typing', {
      recipientId: userId,
      isTyping
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(false);
      }, 3000);
    }
  }, [userId]);


  const handleClearMessages = async () => {
    try {
      const response = await axios.delete(`${API_URL}/api/chat/delete-msg`, {
        data: { otherUser: userId,
           currentUser: currentUserId,
         }, // The user you're chatting with
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data.success) {
        setMessages([]); // Clear local messages state
        alert(`Cleared messages`);
      }
    } catch (err) {
      console.log("Error clearing messages:", err);
      alert('Failed to clear messages');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const messageToSend = {
      recipientId: userId,
      content: newMessage.trim(),
      tempId // Include tempId for server
    };

    // Optimistic update
    setMessages(prev => [...prev, {
      _id: tempId,
      sender: currentUserId,
      recipient: userId,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      status: 'sent'
    }]);

    setNewMessage('');
    handleTyping(false);

    try {
      const response = await socketService.sendMessage(messageToSend);

      if (response.status === 'error') {
        throw new Error(response.error);
      }

    } catch (err) {
      setMessages(prev => prev.map(msg =>
        msg._id === tempId ? { ...msg, status: 'failed' } : msg
      ));
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      handleTyping(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-amber-800 font-medium">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !recipient) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-amber-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-amber-800 mb-2">{error || 'User not found'}</h3>
          <button
            onClick={() => navigate('/chat')}
            className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Back to Chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-amber-50 to-amber-100 relative">
      {/* Chat Header */}
      <div className="bg-amber-600 text-white p-4 px-5 shadow-lg sticky md:static top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex items-center">
          <button
            onClick={() => navigate('/chat')}
            className="mr-4 p-1 rounded-full hover:bg-amber-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center justify-between w-full px-2.5">
            <div className="first flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold">
                {recipient.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <h2 className="font-bold">{recipient.name}</h2>
                <p className={`text-xs ${recipient.online ? 'text-green-300' : 'text-amber-200'}`}>
                  {recipient.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
          <div className="clear-msg">
            <button
              onClick={handleClearMessages}
              className="ml-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              title="Clear conversation"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mt-12 md:mt-0 p-4 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABsSURBVDhP7cxBCsAgDETR6P3P3KZQaKGQhfwZBG8eZJYx5lprv5RS3lJK+SilfEopH6WUj1LKRynlo5TyUUr5KKV8lFI+SikfpZSPUspHKeWjlPJRSvkopfyllPJWSnkppbyUUl5KKf8H8QZbXktwL0Q5JwAAAABJRU5ErkJggg==')]">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex mb-4 ${message.sender._id === currentUserId || message.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender._id === currentUserId || message.sender === currentUserId ? 'bg-amber-500 text-white rounded-tr-none' : 'bg-white text-amber-900 rounded-tl-none shadow-sm'}`}
            >
              <p>{message.content}</p>
              <p className={`text-xs mt-1 ${message.sender._id === currentUserId || message.sender === currentUserId ? 'text-amber-100' : 'text-amber-500'}`}>
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {message.status === 'sending' && ' • Sending'}
                {message.status === 'failed' && ' • Failed'}
              </p>
            </div>
          </div>
        ))}
        {typingStatus && (
          <div className="flex mb-4 justify-start">
            <div className="max-w-xs px-4 py-2 rounded-lg bg-white text-amber-900 rounded-tl-none shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 bg-white border-t border-amber-200 absolute bottom-0 left-0 right-0">
        <div className="container mx-auto flex">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            onBlur={() => {
              setIsTyping(false);
              handleTyping(false);
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-l-full py-2 px-4 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`px-4 rounded-r-full ${newMessage.trim() ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-300 cursor-not-allowed'} text-white transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleChatPage;