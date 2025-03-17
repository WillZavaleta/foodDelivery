import React from 'react'
import './Header.css'
import ImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css"
import { assets } from '../../assets/assets'

const Header = () => {
  const images = [
    {
      original: `${assets.header_img3}`
    },
    {
      original: `${assets.header_img5}`
    },
    {
      original: `${assets.header_img4}`
    }
  ]
  return (
    <div className='header'>
      <ImageGallery items={images}
        showPlayButton={false}
        showFullscreenButton={false}
        showThumbnails={false}
        showBullets={true}
        showNav={false}
        autoPlay={true}
        slideInterval={5000}
        slideDuration={1000}
      />
      <div className='header-contents'>
        <h2> Ordena tu comida favorita aquí!</h2>
        <p>¡Satisface tu antojo con un solo clic! En nuestra tienda virtual, encontrarás las mejores pizzas, pastas y postres listos para llegar a tu puerta en minutos. No esperes más, ¡ordena ahora y disfruta de la mejor comida sin salir de casa! </p>
        <a href="#explore-menu"><button>Ver Menú</button></a>
      </div>
    </div>
  )
}

export default Header