import { useState } from 'react';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        // Avoid loading the script twice
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = RAZORPAY_SCRIPT_URL;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

/**
 * useRazorpay — reusable hook for Razorpay checkout.
 *
 * Usage:
 *   const { initiatePayment, loading } = useRazorpay();
 *   initiatePayment({ amount, name, description, onSuccess, onFailure });
 *
 * onSuccess(razorpay_payment_id) — called when payment completes
 * onFailure()                    — called when popup is closed or errors
 */
export function useRazorpay() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const initiatePayment = async ({ amount, name, description, onSuccess, onFailure }) => {
        setLoading(true);
        setError(null);

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            const msg = 'Razorpay SDK failed to load. Please check your internet connection.';
            setError(msg);
            setLoading(false);
            if (onFailure) onFailure(msg);
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: Math.round(Number(amount) * 100), // paise
            currency: 'INR',
            name: name || 'MealStack',
            description: description || 'Payment',
            image: '/foodimages/mealstack.png',
            handler: async (response) => {
                setLoading(false);
                if (onSuccess) onSuccess(response.razorpay_payment_id);
            },
            modal: {
                ondismiss: () => {
                    setLoading(false);
                    if (onFailure) onFailure('Payment cancelled');
                }
            },
            prefill: {
                name: 'Student',
                email: 'student@example.com',
                contact: '9999999999'
            },
            theme: { color: '#4caf50' }
        };

        try {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', () => {
                setLoading(false);
                if (onFailure) onFailure('Payment failed');
            });
            rzp.open();
        } catch (e) {
            setLoading(false);
            setError(e.message);
            if (onFailure) onFailure(e.message);
        }
    };

    return { initiatePayment, loading, error };
}
