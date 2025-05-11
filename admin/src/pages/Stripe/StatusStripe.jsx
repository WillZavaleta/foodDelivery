// src/components/StripeStatus.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./Stripe.css"

const StripeStatus = ({ accountId, url }) => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const res = await axios.get(`${url}/api/stripe/get-account-status/${accountId}`);
                setAccount(res.data);
            } catch (err) {
                console.error("Error al obtener el estado de la cuenta", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAccount();
    }, [accountId, url]);

    const handleContinueOnboarding = async () => {
        const res = await axios.get(`${url}/api/stripe/get-onboarding-link/${accountId}`);
        window.location.href = res.data.url;
    };

    return (
        <div className='stripe-container'>
            <h1>Estado de tu cuenta de Stripe</h1>
            {loading ?
                (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                ) :
                account?.charges_enabled ? (
                    <>
                        <p style={{ color: "green" }}>✅ Tu cuenta está lista para recibir pagos.</p>

                        {account.requirements?.currently_due?.length > 0 && (
                            <div>
                                <p style={{ color: "orange" }}>⚠️ Aún faltan algunos documentos. Sube los siguientes para evitar bloqueos:</p>
                                <ul>
                                    {account.requirements.currently_due.map((item, index) => (
                                        <li key={index}>{item.replace(/_/g, " ")}</li>
                                    ))}
                                </ul>
                                <button onClick={handleContinueOnboarding}>
                                    Completar registro en Stripe
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <p style={{ color: "red" }}>🚨 Tu cuenta aún no está verificada.</p>
                        <button onClick={handleContinueOnboarding}>
                            Completar registro en Stripe
                        </button>
                    </>
                )

            }

        </div>
    );
};

export default StripeStatus;
