const axios = require('axios');

// Danh sách các token truy cập Facebook
const ACCESS_TOKENS = [
  "EAAD6V7os0gcBOyzVE9j5Xf54pQHDfkS3ClAT82ue2NvkSBurFRAOGC3wfhLxyp7Tu0ipckBQwpxaGIDuXSGWqxyRjgRQGRiQIRaQ4tXBLpFv185lsBMV4qF72XxgIZC6X64TGNobC9i51cz5rW296gZC1ytZCUJwsoBSruFueTLWqeWSsw9tGuZByExAZClpLvq7Oi19V",
  "EAAD6V7os0gcBO1voadJqV6oU2PV07lFXzkxg7CTWqPZACXriDIUvlErMxs4qdorus7rXG9RDEv04bMBoZANyhFxkLhIgukqgsoRlpTXFwNqPvwX7L5b50BHdxM9cMVuWrqfW9mK85kmIT9AvB2E9yMLkoUU8NVLZC19ryAljNCXz7CGBNDwPN7rZCPjZCbmouLIJaHAfK",
  "EAAD6V7os0gcBO3w9s4FGuMndLx0zgoSWoN19VpfE6ZBYEWvFus9w3Lzg1f3AhphZAw6uBJlHNyBAPdjy3KtK97lez1e1oRrgDDUcrktzWVUteZAKHC9c28eGE3r2WMUPrnmYCmq72UM0f2tUAzsayqvdVD34MasWFcDTizUIwC1Bbq6HltzNX70tPzfZCaBZCNI8z9Jk1XgZDZD",
  "EAAD6V7os0gcBO8uHjxkC6GyqRn0Oq6cMRJepWZBZAdf61veN5DIvmlrteDro5siEi0ibMJf2oeLLQasf215ZCIQo5e98ZBK6ySEH4ADwEBdULTYKZCQstAUZBRvc9fSToqZAklKuyqK4j18rXfgh9KF2qDw2i6IvD4Uh79K1mZCENXZBZAkVxw4eZCyOewozVumYNQByqj4x15ycAZDZD",
  "EAAD6V7os0gcBO9WL2xbfZBTR6KmNKZCeFHujNwNxJUmvkUJlL0X6qZAvpWATyquApzF4aIR0QeF65REpm8ZAKYn6Yac59L2qNvAlyeF9mEdpZBj677EJ7W2qVusDcPdnzpApHknhgvbPtlzUkLHF9ThMcepAo7yjMgeuzqydu5jjMsnNmLdC1xXqLPQKCfKnSZBZCyI9yOS"
];

// Hàm để lấy URL video từ Facebook
async function getFacebookVideoUrl(videoId, token) {
  try {
    const url = `https://graph.facebook.com/v14.0/${videoId}?fields=source&access_token=${token}`;
    console.log('Request URL:', url); // In ra URL yêu cầu để kiểm tra
    const response = await axios.get(url);
    return response.data.source;
  } catch (error) {
    console.error('Error fetching video URL:', error.response?.data || error.message);
    if (error.response && error.response.data) {
      console.error('Error details:', error.response.data.error);
    }
    throw error;
  }
}

// Trích xuất video ID từ URL
function extractVideoIdFromUrl(url) {
  const match = url.match(/[?&]v=([0-9]+)/);
  return match ? match[1] : null;
}

// Hàm để lấy URL video từ Facebook bằng cách thử từng token
async function getVideoUrlFromFacebook(fbUrl) {
  const videoId = extractVideoIdFromUrl(fbUrl);
  if (!videoId) {
    throw new Error('Invalid Facebook video URL');
  }

  for (const token of ACCESS_TOKENS) {
    try {
      const videoUrl = await getFacebookVideoUrl(videoId, token);
      return videoUrl; // Trả về video URL nếu thành công
    } catch (error) {
      console.error(`Token failed: ${token}`);
    }
  }

  throw new Error('All tokens failed');
}

// Ví dụ URL video
const facebookVideoUrl = 'https://www.facebook.com/watch/?v=1577705272754401';
getVideoUrlFromFacebook(facebookVideoUrl)
  .then(videoUrl => {
    console.log('Video URL:', videoUrl);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
