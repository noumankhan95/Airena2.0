'use client';

import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "@/components/ChatMessage";
import { ref, push, onValue, off, query, limitToLast } from 'firebase/database';
import { database } from "@/firebase.js";
import { Send } from "lucide-react";
import { Box, Button, TextField } from "@mui/material";
export default function LiveChat({ playbackId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // // Subscribe to chat messages
    useEffect(() => {
        const chatRef = ref(database, `chats/${playbackId}/messages`);
        const recentMessagesQuery = query(chatRef, limitToLast(100));

        onValue(recentMessagesQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messageList = Object.entries(data).map(([id, value]) => ({
                    id,
                    ...value,
                }));
                setMessages(messageList);
            }
        });

        return () => {
            off(recentMessagesQuery);
        };
    }, [playbackId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const chatRef = ref(database, `chats/${playbackId}/messages`);
        await push(chatRef, {
            text: newMessage.trim(),
            username: 'Anonymous',
            timestamp: Date.now(),
        });

        setNewMessage('');
    };

    return (
        <Box className="h-[700px] max-h-full flex flex-col rounded-lg " style={{
            backgroundColor: '#101010'
        }}>
            {/* Chat Header */}
            <div className="p-4 border-b ">
                <h3 className="text-lg font-medium text-white">Live Chat</h3>
            </div>

            {/* Messages Container */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                    />
                ))}
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                    <TextField
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1  text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className=" text-gray-900 rounded-lg px-4 py-2 hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </form>
        </Box>
    )
}
