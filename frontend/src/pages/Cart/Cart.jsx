import React, { useContext, useEffect, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Swal from "sweetalert2";
import axios from 'axios'
import AddressAutocomplete from './AddressAutoComplete';
import TransferenciaModal from './TransferenciaModal';

const Cart = () => {
  const { cartItems, food_list, setCarItems, removeFromCart, getTotalCartAmount, url, getTarifa, token, stripeAccountId } = useContext(StoreContext);
  const navigate = useNavigate();
  const [tarifa, setTarifa] = useState(null);
  const [isOn, setIsOn] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isOnBtn, setIsOnBtn] = useState(false);
  const [paymentMeth, setPaymentMeth] = useState('efectivo');
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "Xalapa",
    state: "Veracruz",
    zipcode: "",
    country: "México",
    phone: ""
  })

  const phoneNumber = "522283556682";

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const paymenthandleChange = (e) => {
    setPaymentMeth(e.target.value);
  };

  const sendOrderToWhatsApp = (event) => {
    event.preventDefault();
    let message = "🚀 *Hola! Me gustaría ordenar lo siguiente:* 🚀\n\n";

    food_list.forEach((item) => {
      const cartItem = cartItems[item._id];

      if (cartItem && Array.isArray(cartItem) && cartItem.length > 0) {

        cartItem.forEach((variant) => {  // Iterar sobre cada variación
          const orillaText = variant.conOrilla ? " con orilla de queso" : "";
          message += `- *${item.name}*${orillaText} - Cantidad: ${variant.cantidad} - Precio: $${item.price * variant.cantidad}\n`;
        })
      }
    });

    [data].forEach((item) => {
      message += `\nA nombre de ${item.firstName + " " + item.lastName}.\n`;
      if (isOn) {
        message += `Con *envío a domicilio* en dirección: *${item.street}.*\n`
      }
      else {
        message += `Para recoger personalmente.\n`
      }
    });

    message += `\n💰 *Total: $${isOn && getTotalCartAmount() > 0 ? getTotalCartAmount() + tarifa : !isOn && getTotalCartAmount()}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    //eliminar el carrito.. idea, preguntar si ya realizó el pedido o si desea regresar al carrito
    Swal.fire({
      title: "¿Ya envió su pedido por WhatsApp?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6347",
      cancelButtonColor: "#323232",
      confirmButtonText: "Sí, ya lo envié.",
      cancelButtonText: "No, regresar al carrito."
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("cart");
        setCarItems({});
        navigate("/");
      }
    });
  };

  const placeOrderStripe = async (event) => {
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
      amount: getTotalCartAmount() + tarifa,
      delivery: isOn,
      accountId: stripeAccountId
    };

    let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const clickedButton = e.nativeEvent.submitter;
    const action = clickedButton?.value;

    console.log("Botón presionado bro:", action); // Para probar

    if (action === "whatsapp") {
      sendOrderToWhatsApp(e);
    } else if (action === "stripe") {
      placeOrderStripe(e);
    }
  }

  const removeAllCart = () => {
    //eliminar el carrito.. idea, preguntar si ya realizó el pedido o si desea regresar al carrito
    Swal.fire({
      title: "¿Seguro que desea vaciar todo el carrito?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6347",
      cancelButtonColor: "#323232",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("cart");
        setCarItems({});
        navigate("/");
      }
    });
  }

  useEffect(() => {
    console.log(data)
  }, [data])

  useEffect(() => {
    const fetchTarifa = async () => {
      const value = await getTarifa();  // ✅ Obtienes el valor real
      setTarifa(value);
      // value === 0?setTarifa("gratis"):setTarifa(value);                // Asignas la tarifa real al estado
    };

    fetchTarifa();
  }, []);

  // useEffect(() => {
  //   if (isOnBtn && !token) {
  //     Swal.fire({
  //       title: "Para pagar en línea inicie sesión",
  //       // text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: false,
  //       confirmButtonColor: "#ff6347",
  //       confirmButtonText: "Aceptar",
  //     }).then(() => setIsOnBtn(!isOnBtn));
  //   }
  // }, [isOnBtn])

  useEffect(() => {
    if (paymentMeth === 'linea' && !token) {
      Swal.fire({
        title: "Para pagar en línea inicie sesión",
        // text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#ff6347",
        confirmButtonText: "Aceptar",
      }).then(() => setPaymentMeth('efectivo'));
    }
  }, [paymentMeth])

  const handleAddress = (address) => {
    console.log("Dirección seleccionada:", address);
    setData(data => ({ ...data, street: address }));
  };

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);  // Alterna entre abrir/cerrar el modal solo del ítem actual
  };

  return (
    <>
    <div className='cart'>
      <div className='cart-items'>
        <div className='cart-items-title'>
          {/* <button className='vaciar-btn' onClick={setCarItems({})}>Vaciar el carrito</button> */}
          <p></p>
          <p>Nombre</p>
          <p>Precio</p>
          <p>Cantidad</p>
          <p>Total</p>
          <p onClick={removeAllCart}><img src={assets.cesto} alt="" /></p>
        </div>
        <br />
        <hr />
        {/* {food_list.map((item, index) => {
          const cartItem = cartItems[item._id];  // Accede al objeto del carrito
          if (cartItem) {
            return (
              <div key={index}>
                <div className='cart-items-title cart-items-item'>
                  <img src={item.image} alt="" />
                  <p>{item.name} {cartItem.conOrilla?" con orilla de queso":""}</p>
                  <p>${item.price}</p>
                  <p>{cartItem.cantidad}</p>
                  <p>${item.price * cartItem.cantidad}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'><img src={assets.cesto} alt="" /></p>
                </div>
                <hr />
              </div>
            )
          }
        })} */}
        {food_list.map((item, index) => {
          const cartItem = cartItems[item._id];  // Accede al array de variaciones del carrito

          if (cartItem && Array.isArray(cartItem) && cartItem.length > 0) {
            return cartItem.map((variant, variantIndex) => (   // Iterar sobre cada variación
              <div key={`${index}-${variantIndex}`}>
                <div className='cart-items-title cart-items-item'>
                  <img src={item.image} alt="" />
                  <p>{item.name}{variant.conOrilla ? " con orilla de queso" : ""}</p>
                  <p>${variant.conOrilla ? item.price + 15 : item.price}</p>
                  <p>{variant.cantidad}</p>
                  <p>${(variant.conOrilla ? (item.price + 15) : item.price) * variant.cantidad}</p>
                  <p onClick={() => removeFromCart(item._id, variant.conOrilla)} className='cross'>
                    <img src={assets.cesto} alt="" />
                  </p>
                </div>
                <hr />
              </div>
            ));
          }
          return null;  // Si no hay item en el carrito, no renderiza nada
        })}

      </div>
      <form onSubmit={handleSubmit}>
        <div className='cart-bottom'>
          <div className='cart-left'>
            <h2>Información de entrega</h2>
            <div className='multi-fields'>
              <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="Nombre" />
              <input name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Apellidos" />
            </div>
            <div className='multi-fields'>
              <label className="switch">
                <input type="checkbox" checked={isOn} onChange={() => setIsOn(!isOn)} />
                <span className="slider"></span>
              </label>
              <p>{isOn ? "Envío a domicilio" : "Recoger personalmente"}</p>
            </div>
            <div className={isOn ? "showform" : "hideform"}>
              <AddressAutocomplete onPlaceSelected={handleAddress} isOn={isOn} onChangeHandler={onChangeHandler} data={data} />
              {/* <input required={isOn} name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder='Dirección' /> */}
              {/* <div className='multi-fields'>
                <input required={isOn} name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="Ciudad" />
                <input required={isOn} name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="Estado" />
              </div> */}
              <div className='multi-fields'>
                <input required={isOn} name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder='Teléfono' />
                <input required={isOn} name="email" onChange={onChangeHandler} value={data.email} type="text" placeholder='Email' />
              </div>
            </div>
          </div>
          <div className='cart-total'>
            <h2>Totales del carrito</h2>
            <div>
              <div className='cart-total-details'>
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className='cart-total-details'>
                <p>Tarifa de entrega</p>
                <p>{isOn && getTotalCartAmount() > 0 ? (tarifa === 0 ? "Gratis" : "$ " + tarifa) : !isOn && "$ " + 0}</p>
              </div>
              <hr />
              <div className='cart-total-details'>
                <b>Total</b>
                <b>${isOn && getTotalCartAmount() > 0 ? getTotalCartAmount() + tarifa : !isOn && getTotalCartAmount()}</b>
              </div>
            </div>
            {/* <div className='multi-fields'>
              <label className="switch">
                <input type="checkbox" checked={isOnBtn} onChange={() => setIsOnBtn(!isOnBtn)} />
                <span className="slider"></span>
              </label>
              <p>{isOnBtn ? "Pago en Línea" : "Pago en Efectivo"}</p>
            </div> */}
            <div className='radios-payment-container'>
              <h3>Método de Pago</h3>
              <div className='group-radio'>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="efectivo"
                    checked={paymentMeth === 'efectivo'}
                    onChange={paymenthandleChange}
                  />
                  Pago en efectivo
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="linea"
                    checked={paymentMeth === 'linea'}
                    onChange={paymenthandleChange}
                  />
                  Pago en línea
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="transferencia"
                    checked={paymentMeth === 'transferencia'}
                    onChange={paymenthandleChange}
                  />
                  Transferencia
                </label>
              </div>
            </div>
            <div className='multi-buttons'>
              <button type='submit' value="whatsapp">PEDIR POR WHATSAPP</button>
              <button type="submit" value="stripe" className={paymentMeth === 'linea' && token ? "showbtn" : "hidebtn"}>PAGAR EN LÍNEA</button>
              <button type="button" onClick={() => toggleModal()} className={paymentMeth === 'transferencia' ? "showbtn" : "hidebtn"}>DATOS PARA TRANSFERIR</button>
            </div>
          </div>
          {/* <div className='cart-promocode'>
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div> */}
        </div>
      </form>
    </div>
    { isModalOpen && (
      <TransferenciaModal setIsModalOpen={setIsModalOpen} isOpen={isModalOpen} />
    )
    }
  </>
  )
}

export default Cart