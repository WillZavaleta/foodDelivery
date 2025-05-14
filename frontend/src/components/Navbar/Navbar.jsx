import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowProfile, setShowlogin }) => {
    const [menu, setMenu] = useState("menu");
    // const [menuOpen, setMenuOpen] = useState(false);
    // const [burger_class, setBurgerClass] = useState("burgerBar unclicked")
    const [navbar, setNavbar] = useState(false)
    //const { getTotalCartAmount } = useContext(StoreContext);
    const {getTotalCartAmount,token,setToken} = useContext(StoreContext);

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }

    //animación menu
    const changeNavbar = () => {
        window.scrollY >= 100 ? setNavbar(true) : setNavbar(false)
    }

    window.addEventListener("scroll", changeNavbar)

    return (
        <div className={`navbar ${navbar && 'menu-fixed'}`}>
            <Link to="/"><img src={assets.logo} alt="" className='logo animate__animated animate__rubberBand animate__delay-1s' /></Link>
            <ul className='navbar-menu animate__animated animate__bounceInLeft'>
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>inicio</Link>
                <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menú</a>
                {/* <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"? "active":""}>mobile-app</a> */}
                <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contacto</a>
            </ul>
            <div className='navbar-right animate__animated animate__bounceInLeft'>
                {/* <img src={assets.search_icon} alt="" /> */}
                {/* <div className='navbar-search-icon'>
                    <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div> */}
                {!token?<button onClick={()=>setShowlogin(true)}>Ingresar</button>
                :<div className='navbar-profile'>
                    <img src={assets.profile_icon} alt="" />
                    <ul className='nav-profile-dropdown'>
                        <li onClick={()=>navigate("/myorders")}><img src={assets.bag_icon} alt="" />Pedidos</li>
                        <hr />
                        <li onClick={logout}><img src={assets.logout_icon} alt="" />Salir</li>
                    </ul>
                </div>
                }
                <div className="menu" onClick={() => {
                    setShowProfile(true)
                    // setMenuOpen(!menuOpen)
                    // menuOpen ? setBurgerClass("burgerBar unclicked") : setBurgerClass("burgerBar clicked")
                }}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    )
}

export default Navbar