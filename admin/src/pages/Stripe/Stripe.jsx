import React, { useState } from 'react'
import "./Stripe.css"
import axios from 'axios';

const Stripe = ({url}) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const handleConnect = async (event) => {
        event.preventDefault();
        const { data } = await axios.post(url+'/api/stripe/stripe-connect-account', {
            name: name,
            email: email,
        }, 
        { headers: { token } });

        if (data.success) {
            window.location.href = data.url; // Redirige al onboarding
        }
    };
    return (
        <div className='stripe-container'>
            <h1>Stripe Connect</h1>
            <p>Mediante este módulo podrás conectar tu Menú Digital para poder recibir pagos en línea de tus clientes. Ingresa nombre y correo de tu negocio, da click al botón y sigue los pasos que te piden.</p>
            <form onSubmit={handleConnect} className='stripe-form'>
                <input type="text" placeholder='Nombre del negocio' value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Correo del negocio" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type='submit'>Conectar con Stripe</button>
            </form>
        </div>
    )
}

export default Stripe