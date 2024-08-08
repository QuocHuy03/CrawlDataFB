const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const cloudinary = require('../config/cloudinaryConfig');

const scrapeContent = async (url) => {
  let options = new chrome.Options();
  options.addArguments("--headless"); // Chạy Chrome ở chế độ ẩn
  options.addArguments("--disable-gpu"); // Vô hiệu hóa GPU (thường cần thiết cho chế độ ẩn)
  options.addArguments("--no-sandbox"); // Vô hiệu hóa sandboxing (cần thiết cho một số môi trường)

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(url);
    await driver.wait(
      until.elementLocated(By.css("div.x1iorvi4.x1pi30zi.x1l90r2v.x1swvt13")),
      10000
    );
    let content = "";
    const divElements = await driver.findElements(
      By.css("div.x1iorvi4.x1pi30zi.x1l90r2v.x1swvt13")
    );
    for (let element of divElements) {
      content += await element.getText();
    }

    const images = [];
    const videos = [];
    const imgElements = await driver.findElements(
      By.css("div.x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z img")
    );
    for (let img of imgElements) {
      const src = await img.getAttribute("src");
      if (src && src.startsWith("https://scontent.")) {
        images.push(src);
      }
    }
    const videoElements = await driver.findElements(By.css('a[href*="videos"]'));
    for (let video of videoElements) {
        const href = await video.getAttribute('href');
        if (href && href.startsWith('https://www.facebook.com')) {
            // Tải video lên Cloudinary
            const result = await cloudinary.uploader.upload(href, { resource_type: 'video' });
            videos.push(result.secure_url);
        }
    }

    const status = images.length > 0 || videos.length > 0 ? 1 : 0;
    return { url, content, images, videos, status };
  } catch (error) {
    console.error(`Error scraping ${url}: `, error);
    return { url, error: error.message };
  } finally {
    await driver.quit();
  }
};

module.exports = scrapeContent;
