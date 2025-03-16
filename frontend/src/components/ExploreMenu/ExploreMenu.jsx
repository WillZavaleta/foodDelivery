import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category, setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explora nuestro menú</h1>
        <p className='explore-menu-text'>Elige de nuestro menú variado lo que más te apetezca. Nuestra misión es satisfacer tu paladar y ofrecerte una excelente experiencia culinaria. </p>
        <div className='explore-menu-list'>
            {menu_list.map((item,id)=>{
                return(//cuando se da click a una categoría, si el valor actual de categoría es igual a la categoría que le dio click, cambia el estado de categoría a ALL para que se deseleccione y muestre todos los items
                    <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={id} className='explore-menu-list-item'>
                        <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                        <p>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu