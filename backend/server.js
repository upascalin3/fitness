const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');  // PostgreSQL client

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',  // replace with your PostgreSQL username
  host: 'localhost',
  database: 'fitness',  // replace with your database name
  password: 'root',  // replace with your PostgreSQL password
  port: 5432,
});

// Dummy sensor data object
let sensorData = {
  heartRate: null,
  cadence: null,
  speed: null,
  oxygen: null,
  lastUpdated: null,
};

// HTTP POST - Allow pushing data into Node.js (future use if needed)
app.use(express.json());

app.post('/api/sensor', async (req, res) => {
  const { type, value } = req.body;

  if (!type || typeof value === 'undefined') {
    return res.status(400).json({ error: 'Invalid data' });
  }

  // Update the sensor data based on the type
  if (type === 'heartRate') {
    sensorData.heartRate = value;
  } else if (type === 'cadence') {
    sensorData.cadence = value;
  } else if (type === 'oxygen') {
    sensorData.oxygen = value;
  } else if (type === 'speed') {
    sensorData.speed = value;
  } else {
    return res.status(400).json({ error: 'Unknown sensor type' });
  }

  // Update the lastUpdated field
  sensorData.lastUpdated = new Date();

  try {
    // Insert data into PostgreSQL
    const query = `
      INSERT INTO sensor_data (heart_rate, cadence, speed, oxygen, last_updated)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [
      sensorData.heartRate,
      sensorData.cadence,
      sensorData.speed,
      sensorData.oxygen,
      sensorData.lastUpdated,
    ];

    await pool.query(query, values);

    // Notify WebSocket clients with the latest sensor data
    io.emit('sensorData', sensorData);

    res.json({ success: true });
  } catch (err) {
    console.error('Error saving data to PostgreSQL:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// HTTP GET - Allow fetching latest sensor data
app.get('/api/sensor', (req, res) => {
  res.json(sensorData);
});

// WebSocket - Real-time updates
io.on('connection', (socket) => {
  console.log('Client connected via WebSocket.');
  socket.emit('sensorData', sensorData);

  socket.on('disconnect', () => {
    console.log('Client disconnected.');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Node.js API server listening at http://localhost:${PORT}`);
});
