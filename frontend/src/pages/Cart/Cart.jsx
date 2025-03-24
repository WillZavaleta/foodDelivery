import React, { useContext, useEffect, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Swal from "sweetalert2";

const Cart = () => {
  const { cartItems, food_list, setCarItems, removeFromCart, getTotalCartAmount, url, getTarifa } = useContext(StoreContext);
  const navigate = useNavigate();
  const [tarifa, setTarifa] = useState(null);
  const [isOn, setIsOn] = useState(true);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    phone: ""
  })

  const phoneNumber = "522283556682";

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const sendOrderToWhatsApp = (event) => {
    event.preventDefault();
    let message = "🚀 *Hola! Me gustaría ordenar lo siguiente:* 🚀\n\n";

    food_list.map((item, id) => {
      if (cartItems[item._id] > 0) {
        message += `- *${item.name}* - Cantidad: ${cartItems[item._id]} - Precio: $${item.price * cartItems[item._id]}\n`;
      }
    });

    [data].map((item, id) => {
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

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  useEffect(() => {
    const fetchTarifa = async () => {
      const value = await getTarifa();  // ✅ Obtienes el valor real
      setTarifa(value);
      // value === 0?setTarifa("gratis"):setTarifa(value);                // Asignas la tarifa real al estado
    };

    fetchTarifa();
  }, []);

  return (
    <div className='cart'>
      <div className='cart-items'>
        <div className='cart-items-title'>
          <p></p>
          <p>Nombre</p>
          <p>Precio</p>
          <p>Cantidad</p>
          <p>Total</p>
          <p></p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'><img src={assets.cesto} alt="" /></p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <form onSubmit={sendOrderToWhatsApp}>
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
              <input required={isOn} name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder='Dirección' />
              <div className='multi-fields'>
                <input required={isOn} name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="Ciudad" />
                <input required={isOn} name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder='Teléfono' />
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
            {/* <button onClick={() => navigate('/order')}>PROCCED TO CHECKOUT</button> */}
            <button type='submit'>PEDIR POR WHATSAPP</button>
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
  )
}

export default Cart