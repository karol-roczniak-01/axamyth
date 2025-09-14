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
  clientSecret 
} : { 
  clientSecret: string 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;
    
    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) return;

    // Confirm payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Customer Name', // You can collect this from form
          email: 'customer@example.com', // You can collect this from form
        },
      },
    });

    if (error) {
      setError(error.message || 'Payment failed');
      setIsLoading(false);
    } else if (paymentIntent.status === 'succeeded') {
      setSucceeded(true);
      setIsLoading(false);
    }
  };

  if (succeeded) {
    return (
      <div className="success-message">
        <h2>Payment succeeded!</h2>
        <p>Thank you for your purchase.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Card details</label>
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
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: false,
            }}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="submit-button"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

// Main checkout component
const StripeElementsCheckout = () => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch client secret when component mounts
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 2000, // Amount in cents ($20.00)
            currency: 'usd',
          }),
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientSecret();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!clientSecret) {
    return <div>Error loading payment form</div>;
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
            },
          },
        }}
      >
        <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
};

export default StripeElementsCheckout;