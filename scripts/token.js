require('dotenv').config();
const axios = require('axios');
const { env } = process;
const jwt = require('jwt-simple');

const applicationStatus = (robot) => {
  robot.respond(/token status/i, async (msg) => {
    const checks = [
      {
        environment: 'production',
        url: env.PRODUCTION_URL,
        token: env.PRODUCTION_TOKEN,
        secret: env.PRODUCTION_SECRET,
      },
      {
        environment: 'staging',
        url: env.STAGING_URL,
        token: env.STAGING_TOKEN,
        secret: env.STAGING_SECRET,
      },
      {
        environment: 'test6',
        url: env.TEST6_URL,
        token: env.TEST6_TOKEN,
        secret: env.TEST6_SECRET,
      },
    ];

    await checks.forEach(async (check) => {
      let expirationMessage = '';

      if (check.secret && check.token) {
        const decodedToken = jwt.decode(check.token, check.secret, true);
        const expireAt = new Date(decodedToken.exp * 1000);
        expirationMessage = ` (Token expires at ${expireAt})`;
      }

      try {
        axios.defaults.headers['Authorization'] = `Bearer ${check.token}`;
        const response = await axios.get(`${check.url}/v1/harbors`);

        return msg.send(`${check.environment}: :ok_hand:${expirationMessage}`);

      } catch (error) {
        const errorMessage = error.response ? error.response.data : error;

        return msg.send(`${check.environment}: ${errorMessage}`);
      }
    });
  });
}

module.exports = applicationStatus;
