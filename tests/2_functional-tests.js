/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('GET /api/stock-prices => stockData object', () => {
    test('1 stock', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          console.log(Object.keys(res.body));
          assert.include(Object.keys(res.body), 'stockData');
          done();
        });
    });

    test('1 stock with like', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'AMZN', like: 'true' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
    });

    test('1 stock with like again (ensure likes arent double counted)', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'AMZN', like: 'true' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
    });

    test('2 stocks', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: ['GOOG', 'MSFT'] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.length, 2);
          done();
        });
    });

    test('2 stocks with like', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: ['GOOG', 'MSFT'], like: 'true' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.length, 2);
          done();
        });
    });
  });
});
