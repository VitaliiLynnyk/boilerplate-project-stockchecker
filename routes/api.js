/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const expect = require('chai').expect;
const axios = require('axios');

module.exports = (app) => {
  app.route('/api/stock-prices').get((req, res) => {
    const { stock, like } = req.query;
    let promiseArray = Array.isArray(stock) ? [...stock] : [stock];

    promiseArray = promiseArray.map((stock) => getPrice(stock));

    Promise.all(promiseArray).then((results) => {
      if (results.length === 1) {
        return res.json(checkIfValid(results[0], like));
      } else {
        let parsed = results.map((e) => {
          return checkIfValid(e, like);
        });
        return res.json({ stockData: parsed });
      }
    });
  });
};

function checkIfValid(requestRes, like) {
  if (requestRes.price) {
    return { stockData: { ...requestRes, likes: +!!like } };
  } else {
    return { stockData: { error: 'external source error', likes: +!!like } };
  }
}

async function getPrice(stock) {
  const response = await axios.get(
    `https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`
  );
  return { stock: stock, price: response.data.latestPrice };
}
