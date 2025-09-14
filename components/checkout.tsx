"use client";

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Payment form component
const CheckoutForm = ({ 
  clientSecret,
  userEmail,
  onSuccess
} : { 
  clientSecret: string, 
  userEmail: string,
  onSuccess: (paymentIntentId: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState(userEmail);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;
    
    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setError('Card element not found');
      setIsLoading(false);
      return;
    }

    // Basic validation
    if (!customerName.trim()) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }

    try {
      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerName.trim(),
            email: email.trim(),
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setIsLoading(false);
      } else if (paymentIntent?.status === 'succeeded') {
        setSucceeded(true);
        setIsLoading(false);
        // Call the success callback with payment intent ID
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (succeeded) {
    return (
      <div className="success-message">
        <h2>Payment succeeded!</h2>
        <p>Thank you for your purchase, {customerName}!</p>
        <p>A confirmation email has been sent to {email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-group">
        <label htmlFor="customerName">Full Name *</label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter your full name"
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="form-input"
          required
        />
      </div>
      
      <div className="form-group">
        <label>Card details *</label>
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  lineHeight: '1.4',
                  padding: '12px',
                },
                invalid: {
                  color: '#9e2146',
                },
                complete: {
                  color: '#4caf50',
                },
              },
              hidePostalCode: false,
            }}
          />
        </div>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="submit-button"
      >
        {isLoading ? 'Processing...' : 'Complete Purchase'}
      </button>
    </form>
  );
};

// Main checkout component
const StripeElementsCheckout = ({ 
  userEmail, 
  adId, 
  amount,
  onSuccess 
}: {
  userEmail: string;
  adId: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
}) => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch client secret when component mounts
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adId,
            userEmail,
            amount, // Pass the amount directly
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize payment');
      } finally {
        setIsLoading(false);
      }
    };

    if (adId && userEmail && amount) {
      fetchClientSecret();
    }
  }, [adId, userEmail, amount]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Initializing payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Unable to load payment form</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="error-container">
        <h3>Payment initialization failed</h3>
        <p>Unable to create payment intent. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#0570de',
              colorBackground: '#ffffff',
              colorText: '#30313d',
              colorDanger: '#df1b41',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              spacingUnit: '4px',
              borderRadius: '6px',
              focusBoxShadow: '0 0 0 1px #0570de',
            },
          },
        }}
      >
        <CheckoutForm 
          clientSecret={clientSecret} 
          userEmail={userEmail}
          onSuccess={onSuccess}
        />
      </Elements>
    </div>
  );
};

export default StripeElementsCheckout;