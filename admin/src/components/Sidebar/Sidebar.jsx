import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className='sidebar-options'>
            <NavLink to='/add' className='sidebar-option'>
                <img src={assets.add_icon} alt="" />
                <p>Agregar</p>
            </NavLink>
            <NavLink to='/list' className='sidebar-option'>
                <img src={assets.list_icon} alt="" />
                <p>Lista</p>
            </NavLink>
            <NavLink to='/orders' className='sidebar-option'>
                <img src={assets.order_icon} alt="" />
                <p>Órdenes</p>
            </NavLink>
            <NavLink to='/sett' className='sidebar-option'>
                <img src={assets.settings_icon} alt="" />
                <p>Ajustes</p>
            </NavLink>
        </div>
        
    </div>
  )
}

export default Sidebar