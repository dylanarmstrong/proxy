const fetch = require('node-fetch');

const proxy = async (event) => {
  const { headers, httpMethod, queryStringParameters } = event;

  if (!queryStringParameters) {
    return { statusCode: 400 };
  }

  const { url } = queryStringParameters;

  if (!url) {
    return { statusCode: 400 };
  }

  let host;
  try {
    ({ host } = new URL(url));
  } catch (e) {
    return { statusCode: 400 };
  }

  headers.Host = host;

  const r = await fetch(url, { headers, method: httpMethod });
  const txt = await r.text();

  return {
    body: JSON.stringify(txt),
    headers: {
      ...r.headers,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: r.status,
  };
};

module.exports = { proxy };
