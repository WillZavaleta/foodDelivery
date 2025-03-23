import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setToken }) => {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <div className='navbar-right'>
        <button onClick={logout}>Salir</button>
        <img className='profile' src={assets.profile_image} alt="" />
      </div>
    </div>
  )
}

export default Navbar