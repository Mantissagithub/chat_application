import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const app = express();
const secret = "mysecretkey"; // Change this to a more secure key in production
const saltRounds = 10;

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
}));
app.use(express.json());

// Create HTTP server and Socket.IO server
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// MongoDB connection
mongoose.connect('mongodb+srv://mantissa6789:Mantis%402510@cluster0.9ramotn.mongodb.net/chat_application', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Chat Schema
const ChatSchema = new mongoose.Schema({
    message: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Chat = mongoose.model('Chat', ChatSchema);

// Hash password before saving to the database
async function hashPassword(plainTextPassword) {
    return await bcrypt.hash(plainTextPassword, saltRounds);
}

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate inputs and check uniqueness
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "Account created successfully.", user });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while creating the account." });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
        res.json({ message: "Logged in successfully!", token });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while logging in." });
    }
});



// Authentication middleware
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user; // Attach the decoded user to the request
        next();
    });
};

// Chat message route
app.post('/chat', authenticateJwt, async (req, res) => {
    try {
        const { message } = req.body;
        const sender = req.user.userId; // Use the user's ID

        const newChat = new Chat({
            message,
            sender // Save sender ID
        });

        await newChat.save();
        // Emit the message to all connected clients
        io.emit('chat message', { message, sender: req.user.userId }); // Send user ID for display
        
        res.json({ status: "Message has been sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get chat messages route
app.get('/chat', authenticateJwt, async (req, res) => {
    try {
        const messages = await Chat.find().populate('sender', 'username'); // Fetch messages from the database
        res.json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// New /me route to get the current user's username
app.get("/me", authenticateJwt, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); // Find the user by ID from the token
        if (!user) {
            return res.status(403).json({ msg: "User doesn't exist" });
        }
        res.json({
            username: user.username // Return the username
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});