import React from 'react'
import './Modal.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'

const Modal = ({ food: { _id, name, price, description, image, category, stock }, setIsModalOpen, url, fetchList }) => {
    const [imagen, setImagen] = useState(false);
    const [animationClose, setAnimationClose] = useState(false);
    const [data, setData] = useState({
        name: name,
        description: description,
        price: price,
        category: category,
        stock: stock,
        image: image
    });
    const [isOn, setIsOn] = useState(data.stock);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === "stock") {
            setData(data => ({ ...data, [name]: !data.stock }))
        } else {
            setData(data => ({ ...data, [name]: value }))
        }

    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("id", _id)
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", Number(data.price))
        formData.append("category", data.category)
        formData.append("stock", data.stock)
        formData.append("image", imagen ? imagen : image)
        const response = await axios.post(`${url}/api/food/edit`, formData);
        if (response.data.success) {
            // setData({
            //     name: "",
            //     description: "",
            //     price: "",
            //     category: ""
            // })
            //console.log(response.data.image)
            fetchList
            toast.success(response.data.message)
        }
        else {
            toast.error(response.data.message)
        }
    }

    // ✅ Manejar el cambio del checkbox
    const handleCheckboxChange = (event) => {
        setIsOn(event.target.checked);  // Actualiza `isOn` al hacer click
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            animationClose && setIsModalOpen(false)
        }, 400);

        return () => clearTimeout(timeout);
    }, [animationClose])

    return (
        <div className='food-popup'>
            <img className='cross' onClick={() => { setAnimationClose(true) }} src={assets.cross} alt="" />
            <div className={`container-food ${animationClose ? 'animate__animated animate__fadeOutRight' : ''}`}>
                <div className='edit-container'>
                    <div className='food-header'>
                        <img src={imagen ? URL.createObjectURL(imagen) : image} alt="" />
                    </div>
                    <h3>Editar Platillo</h3>
                    <form className='flex-col' onSubmit={onSubmitHandler}>
                        <div className='add-img-upload flex-col'>
                            <p>Cambiar imagen</p>
                            <label htmlFor="image">
                                <img src={assets.upload_area} alt="" />
                            </label>
                            <input onChange={(e) => setImagen(e.target.files[0])} type="file" id="image" hidden />
                        </div>
                        <div className='add-product-name flex-col'>
                            <p>Nombre</p>
                            <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='Nombre del producto' required />
                        </div>
                        <div className='add-product-description flex-col'>
                            <p>Descripción</p>
                            <textarea onChange={onChangeHandler} value={data.description} name="description" rows="4"></textarea>
                        </div>
                        <div className='add-category-price'>
                            <div className='add-category flex-col'>
                                <p>Categoría</p>
                                <select onChange={onChangeHandler} value={data.category} name="category">
                                    <option value="Pizza">Pizza</option>
                                    <option value="Pasta">Pasta</option>
                                    <option value="Alitas">Alitas</option>
                                    <option value="Papas">Papas</option>
                                    <option value="Postre">Postre</option>
                                </select>
                            </div>
                            <div className='add-price flex-col'>
                                <p>Precio</p>
                                <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='$20' />
                            </div>
                            <div className='flex-col'>
                                <p>Existencia</p>
                                <div className='add-stock'>
                                    <label className="switch">
                                        <input type="checkbox" name="stock" checked={isOn} onChange={(event) => { setIsOn(!isOn); handleCheckboxChange; onChangeHandler(event); }} />
                                        <span className="slider"></span>
                                    </label>
                                    <p>{isOn ? "Sí" : "No"}</p>
                                </div>
                            </div>
                        </div>
                        <button type='submit' className='add-btn'>GUARDAR</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Modal