const socketIo = require('socket.io');
const User = require('../module/User');
const Message = require('../module/Message');

module.exports = function (server) {
    const io = socketIo(server, {
        cors: {
            origin: ["https://dash-ipry.vercel.com", "http://localhost:5173", "http://localhost:5174"],
            methods: ["GET", "POST"]
        },
        pingTimeout: 60000,
        pingInterval: 25000
    });

    // Track connected users { userId: socketId }
    const connectedUsers = new Map();
    // Track typing status { userId: { recipientId: boolean } }
    const typingStatus = new Map();

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Register user with their ID from JWT
        socket.on('register', async (userId, callback) => {
            try {
                if (!userId) {
                    throw new Error('User ID is required');
                }

                // Update user connection info
                connectedUsers.set(userId, socket.id);

                await User.findByIdAndUpdate(userId, {
                    online: true,
                    socketId: socket.id,
                    lastSeen: new Date()
                });

                // Initialize typing status tracker
                typingStatus.set(userId, {});

                // Notify others this user is online
                socket.broadcast.emit('user-online', userId);

                // Deliver pending messages
                const pendingMessages = await Message.find({
                    recipient: userId,
                    delivered: false
                }).populate('sender', 'name avatar');

                if (pendingMessages.length > 0) {
                    socket.emit('pending-messages', pendingMessages);
                    await Message.updateMany(
                        { _id: { $in: pendingMessages.map(m => m._id) } },
                        { delivered: true, deliveredAt: new Date() }
                    );
                }

                if (typeof callback === 'function') {
                    callback({ status: 'success' });
                }
            } catch (error) {
                console.error('Registration error:', error);
                if (typeof callback === 'function') {
                    callback({ status: 'error', error: error.message });
                }
            }
        });

        // Handle private messages with proper acknowledgment
        // Modify the private-message handler
        socket.on('private-message', async ({ recipientId, content, tempId }, callback) => {
            try {
                const senderId = [...connectedUsers.entries()]
                    .find(([_, sockId]) => sockId === socket.id)?.[0];

                if (!senderId) throw new Error('Sender not registered');
                if (!recipientId || !content) throw new Error('Recipient ID and content are required');

                const message = new Message({
                    sender: senderId,
                    recipient: recipientId,
                    content,
                    delivered: connectedUsers.has(recipientId),
                    deliveredAt: connectedUsers.has(recipientId) ? new Date() : null
                });

                const savedMessage = await message.save();
                const populatedMessage = await Message.populate(savedMessage, {
                    path: 'sender',
                    select: 'name avatar'
                });

                const messageData = {
                    ...populatedMessage.toObject(),
                    tempId, // Include the tempId in the response
                    timestamp: new Date()
                };

                // Unified message event instead of separate ones
                if (connectedUsers.has(recipientId)) {
                    io.to(connectedUsers.get(recipientId)).emit('chat-message', messageData);
                }

                // Send back to sender with the same structure
                callback({
                    status: 'success',
                    message: messageData // Include full message data
                });

            } catch (error) {
                console.error('Message error:', error);
                callback({ status: 'error', error: error.message });
            }
        });

        // Handle typing indicators
        // Backend: Enhance your typing handler
        socket.on('typing-indicator', ({ recipientId, isTyping }) => {
            try {
                const senderId = [...connectedUsers.entries()]
                    .find(([_, sockId]) => sockId === socket.id)?.[0];

                if (!senderId || !recipientId) return;

                // Notify recipient
                if (connectedUsers.has(recipientId)) {
                    io.to(connectedUsers.get(recipientId)).emit('typing-status', {
                        userId: senderId,
                        isTyping
                    });
                }
            } catch (error) {
                console.error('Typing indicator error:', error);
            }
        });

        // Handle read receipts
        socket.on('mark-as-read', async (messageIds) => {
            try {
                const userId = [...connectedUsers.entries()]
                    .find(([_, sockId]) => sockId === socket.id)?.[0];

                if (!userId || !messageIds?.length) return;

                await Message.updateMany(
                    { _id: { $in: messageIds }, recipient: userId },
                    { read: true, readAt: new Date() }
                );

                // Notify sender that messages were read
                const messages = await Message.find({ _id: { $in: messageIds } });
                const senders = new Set(messages.map(m => m.sender.toString()));

                senders.forEach(senderId => {
                    if (connectedUsers.has(senderId)) {
                        io.to(connectedUsers.get(senderId)).emit('messages-read', {
                            readerId: userId,
                            messageIds
                        });
                    }
                });
            } catch (error) {
                console.error('Read receipt error:', error);
            }
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
            try {
                const userId = [...connectedUsers.entries()]
                    .find(([_, sockId]) => sockId === socket.id)?.[0];

                if (userId) {
                    connectedUsers.delete(userId);
                    typingStatus.delete(userId);

                    await User.findByIdAndUpdate(userId, {
                        online: false,
                        lastSeen: new Date()
                    });

                    io.emit('user-offline', userId);
                }
            } catch (error) {
                console.error('Disconnection error:', error);
            }
        });
    });

    return io;
};