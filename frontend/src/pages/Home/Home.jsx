import React, { useState, useContext } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
// import AppDownload from '../../components/AppDownload/AppDownload'
import { Link} from 'react-router-dom';
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';

const Home = ({ setShowFood, showFood }) => {
  const {getTotalCartAmount} = useContext(StoreContext);

  const [category, setCategory] = useState("All");

  return (
    <div>
      <div className='navbar-search-icon'>
        <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
        <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
      </div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      {/* <AppDownload/> */}
    </div>
  )
}

export default Home