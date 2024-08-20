import React, { useEffect, useState } from "react";
import axios from 'axios';
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [user, setUser] = useState("");
    const token = localStorage.getItem("token");

    const fetchUsername = async () => {
        try {
            const response = await axios.get("http://localhost:3000/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data.username);
        } catch (error) {
            console.error("Error fetching username:", error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get("http://localhost:3000/chat", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data.messages);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error("Chat route not found");
            } else {
                console.error(error);
            }
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() !== "") {
            try {
                await axios.post("http://localhost:3000/chat", { message: input.trim() }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInput("");
                fetchMessages();
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        fetchUsername();
        fetchMessages();
    }, [token]);

    return (
        <div className="container mx-auto p-4 bg-gray-100">
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Socket.IO Chat</h1>
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <ul className="space-y-2">
                    {messages.map((msg, index) => (
                        <li key={index} className={`p-2 rounded ${msg.sender === user ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                            <strong className={msg.sender === user ? 'text-white' : 'text-black'}>
                                {String(msg.sender?.username)}:
                            </strong>{" "}
                            <span className={msg.sender === user ? 'text-white' : 'text-gray-800'}>
                                {String(msg.message)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <form className="flex" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-l"
                    placeholder="Type your message..."
                    autoComplete="off"
                />
                <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                    Send
                </Button>
            </form>
        </div>
    );
};

export default Chat;