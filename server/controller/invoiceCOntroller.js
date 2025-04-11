
const Invoice = require('../models/Invoice'); 
const triggerZapier = require('../services/zapierService');


const getUserEmail = (user) => user?.emails?.[0]?.value || user?.email;


const getInvoices = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userEmail = getUserEmail(req.user);
    const invoices = await Invoice.find({ userEmail }); 
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoices', error: err.message });
  }
};

const triggerZapierReminder = async (req, res) => {
  try {
    const userEmail = getUserEmail(req.user);

    const payload = {
      ...req.body,
      status: req.body.status || 'due',
      recipient: req.user.displayName || "Unknown",
      recipientEmail: userEmail,
      sentAt: new Date().toISOString()
    };

    await triggerZapier(payload);
    res.status(200).send("Zapier triggered successfully");
  } catch (error) {
    console.error("Zapier error:", error.message);
    res.status(500).send("Failed to trigger Zapier");
  }
};


const seedInvoice = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userEmail = getUserEmail(req.user);
    const displayName = req.user.displayName || "Test User";

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const formattedDueDate = dueDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const invoice = await Invoice.create({
      recipient: displayName,
      recipientEmail: userEmail,
      amount: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
      dueDate: dueDate.toISOString(),
      formattedDueDate,
      status: "due",
      userEmail
    });

    res.status(201).json(invoice);
  } catch (err) {
    console.error("Seed invoice error:", err.message);
    res.status(500).json({ message: 'Error seeding invoice', error: err.message });
  }
};

module.exports = {
  getInvoices,
  triggerZapierReminder,
  seedInvoice
};
