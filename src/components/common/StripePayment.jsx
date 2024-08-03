// src/components/Checkout.js
import React, { useEffect } from 'react';
import useStripeStore from '../../state/stripeState';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@mui/joy';
import { RiVisaLine } from "react-icons/ri";
import { RiMastercardFill } from "react-icons/ri";
import { FaApplePay } from "react-icons/fa";

export default function StripePayment() {
    const {sessionId, fetchPublicKey, createCheckoutSession, setStripe } = useStripeStore();

    useEffect(() => {
      const fetchAndSetStripe =() => {
        fetchPublicKey();
        const publicKey = localStorage.getItem('stripePublicKey');
        const stripe = loadStripe(publicKey);
        setStripe(stripe);
      };
      fetchAndSetStripe();
    }, [fetchPublicKey, setStripe]);
    const handleCheckout = async () => {
    try {
        const publicKey = localStorage.getItem('stripePublicKey');
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
    <Button onClick={handleCheckout} variant='soft'
    endDecorator={<div style={{display:"flex", gap:2}}><RiVisaLine color='blue' fontSize={24}/> <RiMastercardFill fontSize={24}/> <FaApplePay color="black" fontSize={24}/></div>}>
        Continue to Payment 
    </Button>
    );
    };