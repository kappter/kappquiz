const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static(__dirname));

app.get('/vocab-sets', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            res.status(500).send('Error reading uploads');
            return;
        }
        const csvFiles = files.filter(file => file.endsWith('.csv'));
        res.json(csvFiles);
    });
});

app.get('/vocab/:setName', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.setName);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const newPath = path.join(__dirname, 'uploads', req.file.originalname);
    fs.renameSync(req.file.path, newPath);
    res.send('File uploaded successfully.');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});