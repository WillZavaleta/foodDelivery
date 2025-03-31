import React, { useContext, useEffect, useState } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {
    const [loading, setLoading] = useState(true);
    const { food_list, cartItems } = useContext(StoreContext)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [food_list])

    return (
        <div className='food-display' id='food-display'>
            <h2>Añade al carrito con un solo click</h2>
            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div> {/* Spinner */}
                </div>
            ) : (
                <div className='food-display-list'>
                    {[...food_list]
                        .sort((a, b) => {
                            const inCartA = cartItems[a._id] ? 1 : 0;
                            const inCartB = cartItems[b._id] ? 1 : 0;
                            return inCartB - inCartA;  // Ordena los que están en el carrito primero
                        })
                        .map((item, id) => {
                            { console.log(category, item.category); }
                            if (category === "All" || category === item.category) {
                                return <FoodItem key={id} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} category={item.category} />
                            }
                        })}
                </div>
            )}
        </div>
    )
}

export default FoodDisplay