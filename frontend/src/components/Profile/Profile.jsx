import React, { useEffect, useState } from 'react'
import './Profile.css'
import { assets } from '../../assets/assets'

const Profile = ({setShowProfile}) => {
    const [animationClose, setAnimationClose] = useState(false);

    useEffect(()=>{
        
        const timeout = setTimeout(() => {
            animationClose && setShowProfile(false)
          }, 400); 
      
          return () => clearTimeout(timeout);
    },[animationClose])

    return (
        <div className='profile-popup'>
            <img className='cross' onClick={()=>setAnimationClose(true)} src={assets.cross} alt="" />
            <div className={`container-profile ${animationClose?'animate__animated animate__fadeOutLeft':''}`}>
                <div className='profile-header'>
                <div className='profile-circle'>
                </div>
                </div>                
                <div className='profile-content'>
                    <h2>Restaurante</h2>
                    <div className='profile-social-icons'>
                        <img src={assets.social_fa} alt="" />
                        <img src={assets.social_ins} alt="" />
                        <img src={assets.social_in} alt="" />
                    </div>
                    <div className='profile-contact'>
                        <p>tomato@gmail.com</p>
                        <p>228 355 6682</p>
                    </div>
                    <hr />
                    <div className='profile-location'>
                        <img src={assets.pin} alt="" />
                        <p>Xalapa, Veracruz</p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Profile