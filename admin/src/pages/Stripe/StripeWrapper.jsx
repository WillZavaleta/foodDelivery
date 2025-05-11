// src/pages/Stripe/StripeWrapper.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Stripe from './Stripe';
import StatusStripe from './StatusStripe';

const StripeWrapper = ({ url, token }) => {
    //const [loading, setLoading] = useState(true);
    const [accountId, setAccountId] = useState(null);

    useEffect(() => {
        const fetchAccountId = async () => {
            try {
                const res = await axios.get(`${url}/api/stripe/get-accountid`,
                    { headers: { token } });

                if (res.data.success && res.data.accountId) {
                    setAccountId(res.data.accountId);
                }
            } catch (error) {
                console.error("Error al obtener accountId:", error);
            } 
            // finally {
            //     setLoading(false);
            // }
        };

        fetchAccountId();
    }, [url, token]);

    // if (loading) return (<div className="spinner-container">
    //     <div className="spinner"></div> {/* Spinner */}
    // </div>);

    return accountId ? (
        <StatusStripe url={url} token={token} accountId={accountId} />
    ) : (
        <Stripe url={url} token={token} />
    );
};

export default StripeWrapper;
