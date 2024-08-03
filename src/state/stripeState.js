import { create}  from 'zustand';
import axios from 'axios';

const useStripeStore = create(set => ({
    stripe: null,
    publicKey: '',
    sessionId: '',
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchPublicKey: async () => {
      try {
        const response = await axios.get(`${useStripeStore.getState().baseURL}/stripe/public-key`, {
            headers: {
                'Authorization': `Bearer ${useStripeStore.getState().token}`
            }
            });
        set({ publicKey: response.data.publicKey });
        if(!localStorage.getItem('stripePublicKey')){
            localStorage.setItem('stripePublicKey', response.data.publicKey);
        }
      } catch (error) {
        console.error('Error fetching public key:', error);
      }
    },
    createCheckoutSession: async (product,amount) => {
      try {
        const response = await axios.post(`${useStripeStore.getState().baseURL}/stripe/create-checkout-session`, 
        new URLSearchParams({ 
          product,
          amount 
        }), {
            headers: {
                "Authorization": `Bearer ${useStripeStore.getState().token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        set({ sessionId: response.data.id });
        return response.data.id;
      } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
      }
    },
    setStripe: (stripeInstance) => set({ stripe: stripeInstance })
  }));

export default useStripeStore;
