const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

dotenv.config();
require('./config/googleAuth');

const invoiceRoutes = require('./routes/invoiceRoutes');
const Invoice = require('./models/Invoice');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    secure: false
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', invoiceRoutes);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:5173/dashboard');
  }
);

app.get('/api/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

app.post('/api/init-user', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userEmail = req.user?.emails?.[0]?.value;
  const displayName = req.user?.displayName || "Unknown User";

  if (!userEmail) {
    return res.status(400).json({ message: "Email not found" });
  }

  try {
    const existing = await Invoice.findOne({ userEmail });

    if (!existing) {
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
        userEmail,
      });
    }

    res.status(200).json({ message: "User initialized" });
  } catch (err) {
    res.status(500).json({ message: "Internal error" });
  }
});

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('http://localhost:5173');
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('DB connection failed:', err));
