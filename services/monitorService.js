const Monitor = require('ping-monitor');
const axios = require('axios');
const nodemailer = require('nodemailer');

const sendEmailNotification = async (user, data) => {
  const url = data.website;
  const urlStatus = data.statusMessage;
  const statusCode = data.statusCode;

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, // user
      pass: process.env.EMAIL_PASS, // password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: `URL Monitoring App <${process.env.EMAIL_USER_DISPLAY}>`,
    to: user.email,
    subject: 'Check Status',
    text: `Your check with url: ${url} has changed status 
    to be ${urlStatus} with status code: ${statusCode}`,
  });
};

const sendWebhookNotification = async (webhookUrl, data) => {
  const url = data.website;
  const urlStatus = data.statusMessage;
  const statusCode = data.statusCode;
  await axios.post(webhookUrl, {
    url,
    urlStatus,
    statusCode,
  });
};

exports.monitorCheck = (checks, user) => {
  checks.forEach((check) => {
    const checkOptions = {
      website: check.url,
      title: check.name,
      interval: check.interval,
      config: check.config,
      ignoreSSL: check.ignoreSSL,
    };

    if (check.port) {
      checkOptions.port = check.port;
    }

    const urlMonitor = new Monitor(checkOptions);

    try {
      urlMonitor.on('up', async (res, state) => {
        if (check.status != 'up') {
          check.status = 'up';
          await check.save();
          sendEmailNotification(user, res);
          if (check.webhook) {
            sendWebhookNotification(check.webhook, res);
          }
        }
      });

      urlMonitor.on('down', async (res, state) => {
        if (check.status != 'down') {
          check.status = 'down';
          await check.save();
          sendEmailNotification(user, res);
          if (check.webhook) {
            sendWebhookNotification(check.webhook, res);
          }
        }
      });

      urlMonitor.on('stop', async (res, state) => {
        if (check.status != 'stop') {
          check.status = 'stop';
          await check.save();
          sendEmailNotification(user, res);
          if (check.webhook) {
            sendWebhookNotification(check.webhook, res);
          }
        }
      });

      urlMonitor.on('error', async (res, state) => {
        if (check.status != 'error') {
          check.status = 'error';
          await check.save();
          sendEmailNotification(user, res);
          if (check.webhook) {
            sendWebhookNotification(check.webhook, res);
          }
        }
      });
    } catch (error) {
      return res.status(500).send({message: 'Something went wrong'});
    }
  });
};
