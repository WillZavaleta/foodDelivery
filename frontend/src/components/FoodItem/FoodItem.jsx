import React, { useContext,useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'
import FoodModal from '../FoodModal/FoodModal'

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

      // Estado individual para controlar el modal de cada ítem
      const [isModalOpen, setIsModalOpen] = useState(false);

    const add = () => {
        addToCart(id)
        toast.success("Añadido al carrito")
    }

    const toggleModal = () => {
        setIsModalOpen(prev => !prev);  // Alterna entre abrir/cerrar el modal solo del ítem actual
    };

    return (
        <>
        
        <div className='food-item'>
            <div className='food-item-img-container'>
                {/* <img className='food-item-image' src={url + "/images/" + image} alt="" /> */}
                <img className='food-item-image' src={image} alt="" />
                {/* Botón para abrir el modal específico del ítem */}
                {/* <button onClick={toggleModal}>Abrir</button> */}
                {!cartItems[id]
                    ? <img className='add' onClick={toggleModal} src={assets.eye} alt="" />
                    : <div className='food-item-counter' onClick={toggleModal}>
                        <p>{cartItems[id]}</p>
                    </div>
                }
                {/* {!cartItems[id]
                    ? <img className='add' onClick={add} src={assets.add_icon_white} alt="" />
                    : <div className='food-item-counter'>
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                        <p>{cartItems[id]}</p>
                        <img onClick={add} src={assets.add_icon_green} alt="" />
                    </div>
                } */}
            </div>
            <div className='food-item-info'>
                <div className='food-item-name-rating'>
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="" />
                </div>
                <p className='food-item-desc'>{description}</p>
                <p className='food-item-price'>${price}.00</p>
            </div>
        </div>
        {/* Muestra solo el modal del ítem seleccionado */}
        {isModalOpen && <FoodModal id={id} name={name} price={price} description={description} image={image} setIsModalOpen={setIsModalOpen} />}
        </>

    )
}

export default FoodItem