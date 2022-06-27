const axios = require('axios');

const applicationStatus = (robot) => {
  robot.respond(/status/i, async (msg) => {
    const checks = [
      {
        environment: 'production',
        url: 'https://transport.api.basworld.com',
      },
      {
        environment: 'staging',
        url: 'https://staging-transport.api.basworld.con',
      },
      {
        environment: 'test6',
        url: 'https://test6-transport.api.basworld.com',
      },
    ];

    await checks.forEach(async (check) => {
      try {
        const response = await axios.get(check.url);
        return msg.send(`${check.environment}: ':ok_hand:'`);

      } catch (error) {
        return msg.send(`${check.environment}: ${error}`);
      }
    });
  });
}

module.exports = applicationStatus;
