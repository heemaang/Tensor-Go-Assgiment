import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/invoice.css';


const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
 

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/invoices', {
        withCredentials: true,
      });
      setInvoices(res.data);
    } catch (err) {
      setError("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/me', {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  const handleTriggerZapier = async (invoice) => {
    try {
      await axios.post('http://localhost:5000/api/trigger-zapier', {
        recipient: invoice.recipient,
        recipientEmail: invoice.recipientEmail,
        amount: invoice.amount,
        dueDate: invoice.dueDate,
        formattedDueDate: invoice.formattedDueDate,
        status: invoice.status
      }, {
        withCredentials: true
      });
      setSuccessMessage(`Reminder sent to ${invoice.recipientEmail}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setSuccessMessage('Error triggering reminder.');
    }
  };
  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/logout';
  };

  useEffect(() => {
    fetchUser();
    fetchInvoices();
  }, []);

  return (
    <div className="invoice-wrapper">
      <div className="invoice-header">
        <div>
          <h1 className="invoice-title">Invoice Dashboard</h1>
          {user && (
            <p className="welcome-text">
              Welcome, <strong>{user.displayName}</strong> <br />
              Email: {user.email || user.emails?.[0]?.value}
            </p>
          )}
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div>
        <p className="summary-text"><strong>Total Invoices:</strong> {invoices.length}</p>
      </div>

      {successMessage && <div className="message success">{successMessage}</div>}
      {error && <div className="message error">{error}</div>}

      <div className="invoice-grid">
        {loading ? (
          <p className="text-center">Loading invoices...</p>
        ) : invoices.length > 0 ? (
          invoices.map((invoice, index) => (
            <div key={index} className="invoice-card">
              <div>
                <h3>{invoice.recipient}</h3>
                <p>Amount: ₹{invoice.amount}</p>
                <p>
                  Due: {invoice.formattedDueDate || new Date(invoice.dueDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p>Status: <strong>{invoice.status}</strong></p>
                <p>Email: {invoice.recipientEmail}</p>
              </div>
              <button
                onClick={() => handleTriggerZapier(invoice)}
                className="trigger-btn"
              >
                Trigger Reminder
              </button>
            </div>
          ))
        ) : (
          <p>No invoices yet.</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
