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
        return { success: true, data: response.data.publicKey };
      } catch (error) {
        return { success: false, error: { message: 'Error fetching public key!', details: error.response.data.message } };
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
        return { success: true, data: response.data.id };
      } catch (error) {
        return { success: false, error: { message: 'Error creating checkout session!', details: error.response.data.message } };
      }
    },
    setStripe: (stripeInstance) => set({ stripe: stripeInstance })
  }));

export default useStripeStore;
