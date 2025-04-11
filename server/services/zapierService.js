const axios = require('axios');

const triggerZapier = async (invoiceData) => {
  return axios.post(process.env.ZAPIER_WEBHOOK_URL, invoiceData);
};

module.exports = triggerZapier;
