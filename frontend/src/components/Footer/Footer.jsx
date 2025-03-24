import React, { useContext } from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
// import { useNavigate } from 'react-router-dom';

const Footer = () => {

    // const navigate = useNavigate();

    return (
        <div className='footer' id='footer'>
            <div className='footer-content'>
                <div className='footer-content-left'>
                    <img src={assets.logo} alt="" />
                    <p>En Tomato, llevamos el sabor a otro nivel con la mejor comida hecha con ingredientes frescos y de calidad. 🚀 Desde deliciosas pastas hasta irresistibles pizzas y postres, tenemos todo lo que necesitas para satisfacer tu antojo.</p>
                    <div className='footer-social-icons'>
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className='footer-content-center'>
                    <h2>COMPAÑIA</h2>
                    <ul>
                        <li>Inicio</li>
                        <li>Nosotros</li>
                        {/* <li>Entrega</li> */}
                        <li>Política de privacidad</li>
                    </ul>
                    {/* <button onClick={() => navigate("/myorders")}>Admin</button> */}
                    <a href="https://tomato-admin-i9wq.onrender.com/" target='_blank'><button>Admin</button></a>
                </div>
                <div className='footer-content-right'>
                    <h2>Contacto</h2>
                    <ul>
                        <li><a href="tel:522283556682"><p>228 355 6682</p></a></li>
                        <li><a href="mailto:zavaleta.will@gmail.com"><p>zavaleta.will@gmail.com</p></a></li>
                    </ul>
                    <div className='developer'>
                        <p>Desarrollado por:</p>
                        <a href="https://willwebdeveloper.netlify.app/" target="_blank"><img src={assets.willwebdev} alt="" /></a>
                    </div>
                </div>
            </div>
            <hr />
            <p className='footer-copyright'> 2025 | Tomato.com</p>
        </div>
    )
}

export default Footer