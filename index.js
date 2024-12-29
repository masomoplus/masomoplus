const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON bodies

// Example Route: Get Items
app.get('/api/items', (req, res) => {
    res.status(200).json([
        { id: 1, name: 'Pre-Primary 1' },
        { id: 2, name: 'Grade 1' },
        { id: 3, name: 'Grade 2' }
    ]);
});

// Example Route: Post Item
app.post('/api/items', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }
    res.status(201).json({ message: 'Item created successfully', item: { id: new Date().getTime(), name } });
});

// Example Route: Default 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
