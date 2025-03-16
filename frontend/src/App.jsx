import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import "@fontsource/outfit";
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import Profile from './components/Profile/Profile';

const App = () => {

  const [showLogin, setShowlogin] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  return (
    <>
    {showLogin?<LoginPopup setShowlogin={setShowlogin}/>:<></>}
    {showProfile?<Profile setShowProfile={setShowProfile}/>:<></>}
      <div className='app'>
        <ScrollToTop />
        <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
        />
        <Navbar setShowProfile={setShowProfile} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
        </Routes>
      </div>
      <Footer setShowlogin={setShowlogin}/>
    </>

  )
}

export default App