module.exports = {
  definition: {
    openapi: '3.0.0', // supported openapi version
    info: {
      title: 'URL Monitoring App', // short title.
      description: 'An app for monitoring the uptime of the url', // description
      version: '1.0.0', // version number
      contact: {
        name: 'Rehab Ayman', // your name
        email: 'rehab.a.anwer@gmail.com', // your email
      },
    },
  },
  apis: ['./routes/*.js'],
};

