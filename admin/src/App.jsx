import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes, useParams, useNavigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Set from './pages/Set/Set'
import Login from './components/Login/Login'
import StripeWrapper from './pages/Stripe/StripeWrapper'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

const App = () => {

  const url = "https://food-del-backend-raas.onrender.com"
  // const url = "http://localhost:4000";
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  function StripeReturn() {
    const { accountId } = useParams();
    return (
      <div className='stripe-result'>
        <h2>✅ ¡Cuenta conectada correctamente!</h2>
        <p className='stripe-cuenta'><strong>ID de cuenta: </strong> {accountId}</p>
      </div>
    );
  }

  function StripeRefresh() {
    const { accountId } = useParams();
    return (
      <div className='stripe-result'>
        <h2>⚠️ No se pudo completar el registro. </h2>
        <p className='stripe-cuenta'><strong>Id de cuenta: </strong>{accountId}</p>
        <p>Por favor, regresa a la pestaña de Stripe para verificar el estado de tu cuenta y continuar con el proceso de registro. </p>
        <button onClick={()=>{navigate('/stripe');}}>Volver al módulo de Stripe</button>
      </div>
    );
  }

  return (
    <div>
      {token === ""
        ? <Login url={url} setToken={setToken} />
        :
        <>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme="dark"
          />
          <Navbar setToken={setToken} />
          <hr />
          <div className='app-content'>
            <Sidebar />
            <div className='content-area'>
              <Routes>
                <Route path="/stripe/return/:accountId" element={<StripeReturn />} />
                <Route path="/stripe/refresh/:accountId" element={<StripeRefresh />} />
                <Route path='/add' element={<Add url={url} token={token} />} />
                <Route path='/list' element={<List url={url} token={token} />} />
                <Route path='/orders' element={<Orders url={url} token={token} />} />
                <Route path='/sett' element={<Set url={url} token={token} />} />
                <Route path='/stripe' element={<StripeWrapper url={url} token={token} />} />
                {/* <Route path='/stripe' element={<Stripe url={url} token={token} />} /> */}
              </Routes>
            </div>
          </div>
        </>
      }

    </div>
  )
}

export default App
