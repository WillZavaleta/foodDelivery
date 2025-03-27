import React, { useContext, useEffect, useState } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {
    const [loading, setLoading] = useState(true);
    const {food_list} = useContext(StoreContext)

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setLoading(false);
        },1000);

        return () => clearTimeout(timer);
    },[food_list])

  return (
    <div className='food-display' id='food-display'>
        <h2>Añade al carrito con un solo click</h2>
        {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div> {/* Spinner */}
                </div>
            ) : (
        <div className='food-display-list'>
            {food_list.map((item, id)=>{
                {console.log(category,item.category);}
                if (category==="All" || category===item.category){
                    return <FoodItem key={id} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>                    
                }
            })}
        </div>
            )}
    </div>
  )
}

export default FoodDisplay