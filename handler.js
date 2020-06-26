'use strict';

const fetch = require('node-fetch');

const proxy = async event => {
  const { headers, httpMethod, queryStringParameters } = event;
  const { url } = queryStringParameters;

  if (!url) {
    return { statusCode: 404 }
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
    statusCode: r.status,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': headers['Content-Type']
    }
  };
};

module.exports = { proxy }; 
