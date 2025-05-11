import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const {getTotalCartAmount,token,food_list,cartItems,getTarifa,url} = useContext(StoreContext);
  const [tarifa, setTarifa] = useState(null);

  const [data,setData] = useState({
      firstName:"",
      lastName:"",
      email:"",
      street:"",
      city:"",
      state:"",
      zipcode:"",
      country:"",
      phone:""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];

    // Recorremos cada item en el carrito
    Object.entries(cartItems).forEach(([itemId, variants]) => {
        variants.forEach((variant) => {
            let itemInfo = food_list.find((item) => item._id === itemId);
            if (itemInfo) {
                // Clonamos el objeto del item para evitar modificar el original
                let newItem = { ...itemInfo };
      
                newItem["quantity"] = variant.cantidad;
                newItem["conOrilla"] = variant.conOrilla; // Agregamos la variante

                orderItems.push(newItem);
            }
        });
    });

    let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + tarifa
    };

    let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

    if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
    } else {
        alert("Error");
    }
};


  // const placeOrder = async (event) => {
  //   event.preventDefault();
  //   let orderItems = [];
  //   food_list.map((item)=>{
  //     if (cartItems[item._id]>0) {
  //       let itemInfo = item;
  //       itemInfo["quantity"] = cartItems[item._id];
  //       orderItems.push(itemInfo);
  //     }
  //   })
  //   let orderData = {
  //     address:data,
  //     items:orderItems,
  //     amount:getTotalCartAmount()+35
  //   }
  //   let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
  //   if (response.data.success) {
  //     const {session_url} = response.data;
  //     window.location.replace(session_url);
  //   }
  //   else{
  //     alert("Error");
  //   }
  // }

  //se ejecuta cuando hay cambio en el token de login
  const navigate = useNavigate();
  useEffect(()=>{
    if (!token) {
      navigate('/cart')
    }
    else if (getTotalCartAmount()===0){
      navigate('/cart')
    }
  },[token])

   useEffect(() => {
      const fetchTarifa = async () => {
        const value = await getTarifa();  // ✅ Obtienes el valor real
        setTarifa(value);
        // value === 0?setTarifa("gratis"):setTarifa(value);                // Asignas la tarifa real al estado
      };
  
      fetchTarifa();
    }, []);

  // useEffect(()=>{
  //   console.log(data)
  // },[data])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className='place-order-left'>
        <p className='title'>Información de entrega</p>
        <div className='multi-fields'>
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="Nombre" />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Apellidos" />
        </div>
        <input required name="email" onChange={onChangeHandler} value={data.email} type="text" placeholder='Email' />
        <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder='Dirección' />
        <div className='multi-fields'>
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="Ciudad" />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="Estado" />
        </div>
        <div className='multi-fields'>
          <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="CP" />
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="País" />
        </div>
        <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder='Teléfono' />
      </div>
      <div className='place-order-right'>
        <div className='cart-total'>
          <h2>Totales del Carrito</h2>
          <div>
          <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Tarifa de entrega</p>
              <p>${getTotalCartAmount()===0?0:tarifa}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <b>Total</b>
              <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+tarifa}</b>
            </div>
          </div>
          <button type='submit'>PROCEDER AL PAGO</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder