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
    let promiseArray = [];
    if (Array.isArray(stock)) {
      stock.forEach((e) => {
        promiseArray.push(e);
      });
    } else {
      promiseArray.push(stock);
    }
    promiseArray = promiseArray.map((stock) => getPrice(stock));

    Promise.all(promiseArray).then((results) => {
      if (results.length === 1) {
        res.json({ stockData: { ...results[0], likes: +!!like } });
      } else {
        let parsed = results.map((e) => {
          return { stockData: { ...e, rel_likes: +!!like } };
        });
        res.json({ stockData: parsed });
      }
    });
  });
};

async function getPrice(stock) {
  const response = await axios.get(
    `https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`
  );
  return { stock: stock, price: response.data.latestPrice };
}
