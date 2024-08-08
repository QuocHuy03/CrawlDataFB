const axios = require("axios");
const scrapeContent = require("../utils/scrapeContent");

const processArticle = async (req, res) => {
  try {
    const articles = req.body.articles;

    const promises = articles.map((article) => scrapeContent(article.url));
    const results = await Promise.all(promises);

    res
      .status(200)
      .json({ status: 1, message: "Processing complete", results });
  } catch (error) {
    res
      .status(500)
      .json({ status: 0, message: "An error occurred", error: error.message });
  }
};

module.exports = processArticle;
