import React, { useState } from 'react'
import './FoodModal.css'
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext';

const FoodModal = ({ id, name, price, description, image, setIsModalOpen }) => {
    const { cartItems, addToCart, removeFromCart, } = useContext(StoreContext)
    const [animationClose, setAnimationClose] = useState(false);

    const add = () => {
        addToCart(id)
        toast.success("Añadido al carrito")
    }

    return (
        <div className='food-popup'>
            <img className='cross' onClick={() => { setAnimationClose(true); setIsModalOpen(false); }} src={assets.cross} alt="" />
            <div className={`container-food ${animationClose ? 'animate__animated animate__fadeOutLeft' : ''}`}>
                <div className='food-header'>
                    <img src={image} alt="" />
                </div>
                <div className='food-content'>
                    <h2>{name}</h2>
                    <p className='food-description'>{description}</p>
                    <p className='food-price'>${price}.00</p>
                    {!cartItems[id]
                        ? <div className='add-food' onClick={add}><span>+</span></div>
                        : <div className='food-counter'>
                            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                            <p>{cartItems[id]}</p>
                            <img onClick={add} src={assets.add_icon_green} alt="" />
                        </div>
                    }
                </div>
            </div>
        </div>

    )
}

export default FoodModal