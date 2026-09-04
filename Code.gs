const ESV_API_URL = 'https://api.esv.org/v3/passage/text/';

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'passage') {
    return getPassage_();
  }

  return HtmlService
    .createHtmlOutputFromFile('index')
    .setTitle('EBRM · John 1:1–5')
    .addMetaTag(
      'viewport',
      'width=device-width, initial-scale=1, viewport-fit=cover'
    );
}

function getPassage_() {
  const key = PropertiesService
    .getScriptProperties()
    .getProperty('ESV_API_KEY');

  if (!key) {
    return json_({
      error: 'ESV_API_KEY is not configured'
    });
  }

  const params = {
    q: 'John 1:1-5',
    'include-headings': 'false',
    'include-footnotes': 'false',
    'include-verse-numbers': 'true',
    'include-short-copyright': 'true'
  };

  const query = Object.keys(params)
    .map(function (key) {
      return encodeURIComponent(key) +
        '=' +
        encodeURIComponent(params[key]);
    })
    .join('&');

  const response = UrlFetchApp.fetch(
    ESV_API_URL + '?' + query,
    {
      method: 'get',
      headers: {
        Authorization: 'Token ' + key
      },
      muteHttpExceptions: true
    }
  );

  return ContentService
    .createTextOutput(response.getContentText())
    .setMimeType(ContentService.MimeType.JSON);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
