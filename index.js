const express = require('express');
const processArticle = require('./api/processArticle');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/process', processArticle);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
