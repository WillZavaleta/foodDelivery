import React, { useContext, useEffect, useState, useRef } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const LoginPopup = ({ setShowlogin, isOpen }) => {

    const { url, setToken } = useContext(StoreContext)

    const [currState, setCurrState] = useState("Login")
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    //Bloque para cerrar modal si da click fuera
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowlogin(false); // cierra el modal si haces clic fuera
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!isOpen) return null;
    ///////////////////////////////////////

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    // useEffect(()=>{
    //     console.log(data);
    // },[data])

    const onLogin = async (event) => {
        event.preventDefault()
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login"
        }
        else {
            newUrl += "/api/user/register"
        }

        const response = await axios.post(newUrl, data);

        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowlogin(false);
        }
        else {
            alert(response.data.message)
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className='login-popup-container' ref={modalRef}>
                <div className='login-popup-title'>
                    <h2>{currState}</h2>
                    <img onClick={() => setShowlogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className='login-popup-inputs'>
                    {currState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Tu nombre' required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Tu email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Tu contraseña' required />
                </div>
                <button type='submit'>{currState === "Sign Up" ? "Crear cuenta" : "Ingresar"}</button>
                <div className='login-popup-condition'>
                    <input type="checkbox" required />
                    <p>Para continuar, acepto los términos de uso y políticas de privacidad.</p>
                </div>
                {currState === "Login"
                    ? <p>¿No tienes cuenta? <span onClick={() => setCurrState("Sign Up")}>Click aquí</span></p>
                    : <p>¿Ya tienes una cuenta? <span onClick={() => setCurrState("Login")}>Ingresa aquí</span></p>
                }


            </form>
        </div>
    )
}

export default LoginPopup