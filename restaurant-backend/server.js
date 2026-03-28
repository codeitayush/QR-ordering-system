require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.set('io', io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

// CORS CONFIGURATION
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// PRE-FLIGHT HANDLING
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// BODY PARSER
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API ROUTES
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// HEALTH CHECK
app.get('/', (req, res) => {
  res.json({ 
    message: 'QR Restaurant Ordering API is running',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// SERVER START
const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`API accessible from mobile devices on same WiFi`);
});

const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const createAdmin = async () => {
  try {
    const existing = await Admin.findOne({ username: 'admin' });

    if (!existing) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await Admin.create({
        username: 'admin',
        password: hashedPassword
      });

      console.log("🔥 Admin created: admin / admin123");
    } else {
      console.log("Admin already exists");
    }
  } catch (err) {
    console.error("Admin creation error:", err);
  }
};

createAdmin();