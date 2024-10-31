function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Videos");
  var data = sheet.getDataRange().getValues();
  var jsonData = [];
  
  // Assuming the first row is headers
  var headers = data[0];
  
  // Loop through the rows
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var video = {};
    
    // Loop through the columns
    for (var j = 0; j < headers.length; j++) {
      video[headers[j]] = row[j];
    }
    
    // Convert tags from comma-separated string to array
    if (video.tags) {
      video.tags = video.tags.split(',').map(tag => tag.trim());
    }
    
    jsonData.push(video);
  }
  
  // Return the JSON data
  return ContentService.createTextOutput(JSON.stringify({videos: jsonData}))
    .setMimeType(ContentService.MimeType.JSON);
}