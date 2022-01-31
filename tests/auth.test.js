const app = require('../server');
require('dotenv-expand')(require('dotenv').config());
const db = require('../database/db');
const request = require('supertest');
const {faker} = require('@faker-js/faker');
const {User} = require('../models/user');

describe('Authentication Endpoints Tests', function() {
  afterAll(() => {
    db.disconnect();
    app.close();
  });

  describe('POST /auth/signup', function() {
    test('User should sign up successfully', async () => {
      const name = faker.name.findName();
      const email = faker.internet.email();
      const password = faker.internet.password();

      const {status} = await request(app)
          .post('/auth/signup')
          .send({name, email, password});

      expect(await User.exists({email})).toBeTruthy();

      expect(status).toBe(201);
    });

    test('Missing email, should return 400 with error message', async () => {
      const name = faker.name.findName();
      const password = faker.internet.password();

      const {status, body} = await request(app)
          .post('/auth/signup')
          .send({name, password});

      expect(body.message).toBeDefined();
      expect(status).toBe(400);
    });
  });

  describe('GET /verify/email', function() {
    test('User should sign up and verify email successfully', async () => {
      const name = faker.name.findName();
      const email = faker.internet.email();
      const password = faker.internet.password();

      const {status} = await request(app)
          .post('/auth/signup')
          .send({name, email, password});

      let user = await User.findOne({email});

      expect(user).toBeTruthy();

      expect(status).toBe(201);

      const {status: verificationStatus} = await request(app)
          .get('/auth/verify/email?'+user.verificationLink.split('?')[1])
          .send();

      expect(verificationStatus).toBe(200);

      user = await User.findOne({email});

      expect(user.isVerified).toBe(true);
    });
  });

  describe('POST /auth/signin', function() {
    test('User signs in successfully', async () => {
      const name = faker.name.findName();
      const email = faker.internet.email();
      const password = faker.internet.password();

      const user = new User({
        name, email, password,
        isVerified: true,
      });

      await user.save();

      const {status, body} = await request(app)
          .post('/auth/signin')
          .send({email, password});

      expect(body.accessToken).toBeDefined();

      expect(status).toBe(200);
    });

    test('Missing email, should return 400 with error message', async () => {
      const password = faker.internet.password();

      const {status, body} = await request(app)
          .post('/auth/signin')
          .send({password});

      expect(body.message).toBeDefined();

      expect(status).toBe(400);
    });
  });
});
