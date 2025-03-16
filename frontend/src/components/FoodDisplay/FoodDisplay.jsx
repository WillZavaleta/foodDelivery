import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {

    const {food_list} = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
        <h2>Platillos Top cerca de ti</h2>
        <div className='food-display-list'>
            {food_list.map((item, id)=>{
                {console.log(category,item.category);}
                if (category==="All" || category===item.category){
                    return <FoodItem key={id} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>                    
                }
            })}
        </div>
    </div>
  )
}

export default FoodDisplay