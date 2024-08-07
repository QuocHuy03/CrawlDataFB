const axios = require('axios');
const scrapeContent = require('../utils/scrapeContent');

const processArticle = async (req, res) => {
    try {
        const articles = req.body.articles;

        const promises = articles.map(article => scrapeContent(article.url));
        const results = await Promise.all(promises);

        // Gửi kết quả qua API 2
      //   await axios.post('https://api2.example.com/receive', { results });

        res.status(200).json({ message: 'Processing complete', results });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

module.exports = processArticle;
