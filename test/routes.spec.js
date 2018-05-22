const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server.js');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('API-ROUTES', () => {
  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
        .then(() => {
          database.seed.run()
        })
        .then(() => {
          done()
        })
      })
    })

  describe('GET /api/v1/photos', () => {
    it('should get all the photos', () => {
      return chai.request(server)
        .get('/api/v1/photos')
          .then(response => {
            console.log(response.body)
            response.should.be.json;
            response.should.have.status(200);
            response.body.should.be.an('array');
            response.body[0].should.have.property('id');
            response.body[0].id.should.equal(1);
            response.body[0].should.have.property('title');
            response.body[0].title.should.equal('Chimis');
            response.body[0].should.have.property('photo_url');
            response.body[0].photo_url.should.equal('https://cdn3.tmbi.com/secure/RMS/attachments/37/300x300/Beef-Chimichangas_exps8535_MB2751679C04_09_1b_RMS.jpg');

          })
          .catch(error => {
            throw error
          })
    })
  })

  describe('POST /api/v1/photos', () => {
    it('should post a new photo to db', () => {
      return chai.request(server)
        .post('/api/v1/photos')
        .send({
          title: "taco",
          photo_url: "08/10/1900"
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(1);
        })
        .catch(error => {
          throw error;
        })
    })

    it('should send 422 status code if missing params', () => {
      return chai.request(server)
        .post('/api/v1/photos')
        .send({
          title: 'Merle'
        })
        .then(response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.error.should.equal('Expected format: { title: <String>, photo_url: <String>. You are missing a photo_url property.')
        })
    })
  })

  describe('DELETE /api/v1/photos/:id', () => {
    it('should delete a record with a spec id', () => {
      return chai.request(server)
        .delete(`/api/v1/photos/1`)
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        })
    })
  })

  it('should send a status of 404 if the id does not match', () => {
      return chai.request(server)
        .delete('/api/v1/photos/2022')
        .then(response => {
          response.should.have.status(404)
        })
        .catch(error => {
          throw error
        })
    })
  })
