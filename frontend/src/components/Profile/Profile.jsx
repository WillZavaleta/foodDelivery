import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';

const Profile = ({ setShowProfile }) => {
    const [animationClose, setAnimationClose] = useState(false);
    const { horarios, estadoActual } = useContext(StoreContext);

    // ✅ Función para convertir a formato AM/PM
    const formatAMPM = (time) => {
        if (!time) return "";
        const [hours, minutes] = time.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    };

    useEffect(() => {
        console.log(estadoActual)
    })

    useEffect(() => {

        const timeout = setTimeout(() => {
            animationClose && setShowProfile(false)
        }, 400);

        return () => clearTimeout(timeout);
    }, [animationClose])

    return (
        <div className='profile-popup'>
            <img className='cross' onClick={() => setAnimationClose(true)} src={assets.cross} alt="" />
            <div className={`container-profile ${animationClose ? 'animate__animated animate__fadeOutLeft' : ''}`}>
                <div className='profile-header'>
                    <div className='profile-circle'>
                    </div>
                </div>
                <div className='profile-content'>
                    <div className='profile-title'>
                        <h2>Restaurante</h2>
                        <div className={`dot ${estadoActual === 'Cerrado' && 'dotCerrado'}`}><p>{estadoActual}</p></div>
                    </div>
                    <div className='profile-social-icons'>
                        <img src={assets.social_fa} alt="" />
                        <img src={assets.social_ins} alt="" />
                        <img src={assets.social_in} alt="" />
                    </div>
                    <div className='profile-contact'>
                        <a href="mailto:zavaleta.will@gmail.com"><p>zavaleta.will@gmail.com</p></a>
                        <a href="tel:522283556682"><p>228 355 6682</p></a>
                    </div>
                    <div className='profile-horario-container'>
                        {horarios.map((horario, id) => {
                            return (
                                <div key={id} className='profile-horario-item'>
                                    <p>{horario.dia}</p>
                                    <p>{horario.abierto ? "🕒" + formatAMPM(horario.apertura1) : ""}</p>
                                    <p>{horario.abierto ? "-" : "Cerrado"}</p>
                                    <p>{horario.abierto ? formatAMPM(horario.cierre1) : ""}</p>
                                </div>

                            )
                        })}
                    </div>
                    <hr />
                    <div className='profile-location'>
                        <img src={assets.pin} alt="" />
                        <a href="https://www.google.com/maps/dir/?api=1&destination=19.432608,-99.133209" target="_blank">
                            <p>Cómo llegar</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Profile