const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Save data to data.json
app.post('/api/save_data', (req, res) => {
    try {
        const data = req.body;
        
        // Validate data structure
        if (!data.sections || !data.categories) {
            return res.status(400).json({ 
                error: 'Invalid data structure. Expected sections and categories.' 
            });
        }

        // Path to data.json file
        const dataPath = path.join(__dirname, '../client/public/data.json');
        
        // Write data to file with proper formatting
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
        
        console.log('Data saved successfully to data.json');
        console.log('Sections:', data.sections.length);
        console.log('Categories:', data.categories.length);
        
        res.json({ 
            success: true, 
            message: 'Data saved successfully',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ 
            error: 'Failed to save data', 
            details: error.message 
        });
    }
});

// Get current data from data.json
app.get('/api/get_data', (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../client/public/data.json');
        
        if (!fs.existsSync(dataPath)) {
            return res.status(404).json({ error: 'Data file not found' });
        }
        
        const data = fs.readFileSync(dataPath, 'utf8');
        const jsonData = JSON.parse(data);
        
        res.json(jsonData);
        
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ 
            error: 'Failed to read data', 
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        server: 'Kitchen Planner API'
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  POST /api/save_data - Save admin panel data');
    console.log('  GET /api/get_data - Get current data');
    console.log('  GET /api/health - Health check');
});