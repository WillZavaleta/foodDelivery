import React, { useState, useEffect } from 'react'
import './FoodModal.css'
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const FoodModal = ({ id, name, price, description, image, category, setIsModalOpen }) => {
    const { cartItems, addToCart, removeFromCart, getTotalCartAmount } = useContext(StoreContext)
    const [animationClose, setAnimationClose] = useState(false);
    const [isOn, setIsOn] = useState(false);

    const add = () => {
        addToCart(id, isOn);
        toast.success("Añadido al carrito")
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            animationClose && setIsModalOpen(false)
        }, 400);

        return () => clearTimeout(timeout);
    }, [animationClose])

    // ✅ Obtener la cantidad total combinada (considerando variaciones con/sin orilla)
    const totalCantidad = cartItems[id]?.reduce((total, item) => total + item.cantidad, 0) || 0;

    // ✅ Obtener las cantidades desglosadas por variación
    const cantidadConOrilla = cartItems[id]?.find(item => item.conOrilla)?.cantidad || 0;
    const cantidadSinOrilla = cartItems[id]?.find(item => !item.conOrilla)?.cantidad || 0;


    return (
        <div className='food-popup'>
            <img className='cross' onClick={() => { setAnimationClose(true) }} src={assets.cross} alt="" />
            <div className={`container-food ${animationClose ? 'animate__animated animate__fadeOutRight' : ''}`}>
                <div className='food-header'>
                    <img src={image} alt="" />
                </div>
                <div className='food-content'>
                    <h2>{name}</h2>
                    <p className='food-description'>{description}</p>
                    <p className='food-price'>${isOn ? `${price + 15}.00` : `${price}.00`}</p>
                    {category === "Pizza" && (
                        <>
                            <div className='switch-container'>
                                <label className="switch">
                                    <input type="checkbox" checked={isOn} onChange={() => setIsOn(!isOn)} />
                                    <span className="slider"></span>
                                </label>
                                <p>{isOn ? "Con orilla de queso" : "Sin orilla de queso"}</p>
                            </div>

                            <div className='etiquetas'>
                                <p>Con orilla de queso: {cantidadConOrilla} </p>
                                <p>Sin orilla de queso: {cantidadSinOrilla} </p>
                            </div>
                        </>
                    )}
                    <div className='modal-cart-icon'>
                        <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
                        <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                    </div>
                    {/* {!cartItems[id]
                        ? <div className='add-food' onClick={add}><span>+</span></div>
                        : <div className='food-counter'>
                            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                            <p>{cartItems[id]?.cantidad}</p>
                            <img onClick={add} src={assets.add_icon_green} alt="" />
                        </div>
                    } */}
                    {totalCantidad === 0 ? (
                        <div className='add-food' onClick={add}>
                            <span>+</span>
                        </div>
                    ) : (
                        <div className="food-counter">
                            <img onClick={() => removeFromCart(id, isOn)} src={assets.remove_icon_red} alt="-" />
                            <p>{totalCantidad}</p>
                            <img onClick={add} src={assets.add_icon_green} alt="+" />
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}

export default FoodModal