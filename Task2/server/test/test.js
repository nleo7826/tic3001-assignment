const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, PORT } = require('../../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Products', () => {
  let productId;
  let server = app.listen(PORT);

  // Test POST route
  describe('POST /api/products', () => {
    it('should create a new product', (done) => {
      chai.request(server)
        .post('/api/products')
        .send({
          'name': 'Test Product',
          'price': 9.99,
          'quantity': 3
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.name).to.equal('Test Product');
          expect(res.body.data.price).to.equal(9.99);
          expect(res.body.data.quantity).to.equal(3);
          // save the ID for later use
          productId = res.body.data._id;
          console.log('productId: ', productId);
          done();
        });
    });
  });

  // Test GET route
  describe('GET /api/products', () => {
    it('should get a list of all products', (done) => {
      chai.request(app)
        .get('/api/products')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          // expect(res.body.data).to.have.lengthOf.at.least(1);
          done();
        });
    });
  });

  // Test GET by ID route
  describe('GET /api/products/:product_id', () => {
    it('should get a product by ID', (done) => {
      chai.request(app)
        .get(`/api/products/${productId}`)
        .end((err, res) => {
          // error handling if product ID is not found
          if (err) {
            done(err);
          } else if (res.status === 404) {
            done(new Error(`Product with ID ${productId} not found`));
          } else {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data._id).to.equal(productId);
          expect(res.body.data.name).to.equal('Test Product');
          expect(res.body.data.price).to.equal(9.99);
          expect(res.body.data.quantity).to.equal(3);
          done();
          }
        });
    });
  });

  // Test PUT route
  describe('PUT /api/products/:product_id', () => {
    it('should update a product by ID', (done) => {
      chai.request(app)
        .put(`/api/products/${productId}`)
        .send({
          name: 'Modified Product',
          price: 19.99,
          quantity: 8
        })
        .end((err, res) => {
          // error handling if product ID is not found
          if (err) {
            done(err);
          } else if (res.status === 404) {
            done(new Error(`Product with ID ${productId} does not exist, cannot update`));
          } else {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data._id).to.equal(productId);
          expect(res.body.data.name).to.equal('Modified Product');
          expect(res.body.data.price).to.equal(19.99);
          expect(res.body.data.quantity).to.equal(8);
          done();
          }
        });
    });
  });

//   // Test DELETE route
  describe('DELETE /api/products/:product_id', () => {
    it('should delete a product by ID', (done) => {
      chai.request(app)
        .delete(`/api/products/${productId}`)
        .end((err, res) => {
          if (err) {
            done(err);
          } else if (res.status === 404) {
            done(new Error(`Product not found, cannot delete`));
          } else {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data).to.not.exist;
          expect(res.body.message).to.equal('Product successfully deleted');
          done();
          }
        });
    });
  });
});

var assert = require('assert');
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});