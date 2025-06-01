import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode'; // More reliable than atob
import { API_URL } from '../config'; // Adjust the import path as necessary

class SocketService {
  constructor() {
    this.socket = null;
    this.currentUserId = null;
    this.eventListeners = new Map();
  }

  initialize(accessToken) {
    if (this.socket?.connected) return this.socket;

    try {
      // Decode token properly
      const decoded = jwtDecode(accessToken);
      this.currentUserId = decoded._id || decoded.id;

      if (!this.currentUserId) {
        throw new Error('Invalid token: No user ID found');
      }

      this.socket = io(`${API_URL}` || 'http://localhost:9000', {
        auth: { token: accessToken },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        autoConnect: true,
      });

      this.setupCoreListeners();
      return this.socket;
    } catch (error) {
      console.error('Socket initialization failed:', error);
      throw error;
    }
  }

  setupCoreListeners() {
    this.socket?.on('connect', () => {
    //   console.log('Socket connected:', this.socket.id);
      this.registerUser();
    });

    this.socket?.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        this.socket.connect(); // automatically try to reconnect
      }
    });

    this.socket?.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });
  }

  registerUser() {
    if (!this.socket?.connected || !this.currentUserId) return;
    
    this.socket.emit('register', this.currentUserId, (response) => {
      if (response?.error) {
        console.error('Registration failed:', response.error);
      } else {
        console.log('User registered with socket');
      }
    });
  }

  sendMessage({ recipientId, content }) {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Message delivery timeout'));
      }, 10000);

      this.socket.emit(
        'private-message', 
        { recipientId, content },
        (response) => {
          clearTimeout(timeout);
          response?.error 
            ? reject(new Error(response.error))
            : resolve(response);
        }
      );
    });
  }

  subscribe(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);
    this.socket?.on(event, callback);
    
    return () => this.unsubscribe(event, callback);
  }

  unsubscribe(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      listeners.delete(callback);
      this.socket?.off(event, callback);
      
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  disconnect() {
    if (this.socket) {
      // Clean up all listeners
      this.eventListeners.forEach((callbacks, event) => {
        callbacks.forEach(cb => this.socket.off(event, cb));
      });
      this.eventListeners.clear();
      
      this.socket.disconnect();
      this.socket = null;
      this.currentUserId = null;
    }
  }

  // Status checkers
  isConnected() {
    return this.socket?.connected || false;
  }

  getSocketId() {
    return this.socket?.id || null;
  }
}

export const socketService = new SocketService();