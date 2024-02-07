import React, { useState } from 'react';

const MakePayment = ({ ticketId, onPaymentSuccess, onPaymentFailure }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Simulate a payment process (you can integrate a real payment gateway here)
      // For demonstration purposes, this is just a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      onPaymentSuccess();

      setLoading(false);
    } catch (error) {
      console.error('Error during payment:', error.message);
      onPaymentFailure();

      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Make Payment</h2>
      <form>
        <label>
          Card Number:
          <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
        </label>
        <br />
        <label>
          Expiry Date:
          <input type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        </label>
        <br />
        <label>
          CVV:
          <input type="text" value={cvv} onChange={(e) => setCVV(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing Payment...' : 'Make Payment'}
        </button>
      </form>
    </div>
  );
};

export default MakePayment;
