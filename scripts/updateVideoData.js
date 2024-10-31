const fs = require('fs');
const https = require('https');

const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
const LOCAL_JSON_PATH = './public/VideoGrid.json';

function fetchVideoData() {
  return new Promise((resolve, reject) => {
    https.get(GOOGLE_SHEET_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function updateVideoData() {
  try {
    const data = await fetchVideoData();
    fs.writeFileSync(LOCAL_JSON_PATH, JSON.stringify(data, null, 2));
    console.log('VideoGrid.json updated successfully');
  } catch (error) {
    console.error('Error updating VideoGrid.json:', error);
  }
}

// Run immediately
updateVideoData();

// Then run every hour
setInterval(updateVideoData, 3600000);