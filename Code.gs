const ESV_API_BASE = 'https://api.esv.org/v3/passage/';

/**
 * EBRM V0.2
 * John 1 全章
 *
 * API Key:
 * Apps Script → 项目设置 → 脚本属性
 * ESV_API_KEY = 你的 ESV API Key
 */

function doGet(e) {

  const action = e && e.parameter
    ? e.parameter.action
    : '';

  if (action === 'passage') {
    return getPassage_(e.parameter.q || 'John 1');
  }

  if (action === 'audio') {
    return getAudio_(e.parameter.q || 'John 1');
  }

  return HtmlService
    .createHtmlOutputFromFile('index')
    .setTitle('EBRM V0.2 · John 1')
    .addMetaTag(
      'viewport',
      'width=device-width, initial-scale=1, viewport-fit=cover'
    );
}


/**
 * 获取 ESV 经文
 */
function getPassage_(q) {

  return callESV_(
    'text/',
    {
      q: q,

      'include-headings': 'false',
      'include-footnotes': 'false',
      'include-verse-numbers': 'true',
      'include-short-copyright': 'true',

      'indent-paragraphs': 'false',
      'indent-using': 'spaces',
      'line-length': '0'
    }
  );
}


/**
 * 获取 ESV Audio
 */
function getAudio_(q) {

  return callESV_(
    'audio/',
    {
      q: q
    }
  );
}


/**
 * ESV API 通用请求
 */
function callESV_(endpoint, params) {

  const apiKey =
    PropertiesService
      .getScriptProperties()
      .getProperty('ESV_API_KEY');

  if (!apiKey) {

    return json_({
      success: false,
      error: 'ESV_API_KEY is not configured'
    });

  }

  const query = Object.keys(params)
    .map(function(key) {

      return encodeURIComponent(key)
        + '='
        + encodeURIComponent(params[key]);

    })
    .join('&');


  try {

    const response = UrlFetchApp.fetch(
      ESV_API_BASE + endpoint + '?' + query,
      {
        method: 'get',

        headers: {
          Authorization: 'Token ' + apiKey
        },

        muteHttpExceptions: true
      }
    );


    const status =
      response.getResponseCode();


    const text =
      response.getContentText();


    if (status < 200 || status >= 300) {

      return json_({
        success: false,
        status: status,
        error: text
      });

    }


    return ContentService
      .createTextOutput(text)
      .setMimeType(
        ContentService.MimeType.JSON
      );

  } catch (error) {

    return json_({
      success: false,
      error: String(error)
    });

  }
}


/**
 * JSON
 */
function json_(data) {

  return ContentService
    .createTextOutput(
      JSON.stringify(data)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );

}
