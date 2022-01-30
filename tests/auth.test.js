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

  describe('SignUp Tests', function() {
    test('POST /auth/signup', async () => {
      const name = faker.name.findName();
      const email = faker.internet.email();
      const password = faker.internet.password();

      const {status} = await request(app)
          .post('/auth/signup')
          .send({name, email, password});

      expect(await User.exists({email})).toBeTruthy();

      expect(status).toBe(201);
    });
  });

  describe('SignIn Tests', function() {
    test('POST /auth/signin', async () => {
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
  });
});
