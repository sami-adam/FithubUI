// src/components/Checkout.js
import React, { useEffect } from 'react';
import useStripeStore from '../state/stripeState';
import { loadStripe } from '@stripe/stripe-js';

export default function StripePaymentPage() {
    const { publicKey, sessionId, fetchPublicKey, createCheckoutSession, setStripe } = useStripeStore();

    useEffect(() => {
      const fetchAndSetStripe = async () => {
        await fetchPublicKey();
        const stripe = await loadStripe(publicKey);
        setStripe(stripe);
      };
      fetchAndSetStripe();
    }, [fetchPublicKey, publicKey, setStripe]);
    const handleCheckout = async () => {
    try {
        const sessionId = await createCheckoutSession(5000); // Amount in cents
        const stripe = window.Stripe(publicKey);
        stripe.redirectToCheckout({ sessionId })
        .then(result => {
            if (result.error) {
            alert(result.error.message);
            }
        })
        .catch(error => console.error('Error redirecting to checkout:', error));
    } catch (error) {
        console.error('Error during checkout process:', error);
    }
    };

    return (
    <button onClick={handleCheckout}>Checkout</button>
    );
    };