const express = require('express');
const {
  getInvoices,
  triggerZapierReminder,
  seedInvoice
} = require('../controller/invoiceCOntroller');

const ensureAuth = require('../utils/authMiddleware'); 

const router = express.Router();


router.get('/invoices', ensureAuth, getInvoices);

router.post('/trigger-zapier', ensureAuth, triggerZapierReminder);

router.post('/seed', ensureAuth, seedInvoice);

module.exports = router;
