import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = ({url, setToken}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(url + '/api/user/login',{email,password})
            if (response.data.success) {
                setToken(response.data.token)

            }else{
                toast.error(response.data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

  return (
    <div className='login-container'>
        <div className='login-window'>
            <h1>Panel Administrativo</h1>
            <form onSubmit={onSubmitHandler} className='login-form'>
                <div className='login-input-container'>
                    <p>Email</p>
                    <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='tu@email.com'required />
                </div>
                <div className='login-input-container'>
                    <p>Contraseña</p>
                    <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Ingresa tu contraseña' required/>
                </div>
                <button type='submit'>Ingresar</button>
            </form>
        </div>
    </div>
  )
}

export default Login