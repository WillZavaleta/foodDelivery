import React, { useState, useEffect } from 'react'
import "./Set.css"
import axios from "axios"
import { toast } from 'react-toastify'

const Set = ({ url }) => {
    const [data, setData] = useState({
        tarifa: ""
    })
    const [settings, setSettings] = useState([]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        // Verifica si es un número y que no sea NaN
        if (!data.tarifa || isNaN(Number(data.tarifa))) {
            toast.error("Por favor, ingresa un número válido");
            return;   // Detiene la ejecución si no es un número
        }

        const response = await axios.post(url + "/api/set/update", {
            tarifa: Number(data.tarifa)
        })
        if (response.data.success) {
            setData({
                tarifa: ""
            })
            toast.success(response.data.message)
            getSettings();
        } else {
            toast.error(response.data.message)
        }
    }

    const getSettings = async () => {
        const response = await axios.get(url + "/api/set/get");
        if (response.data.success) {
            setSettings(response.data.data);
            console.log(response.data.data);
        }
        else {
            toast.error("Error")
        }
    }

    useEffect(() => {
        getSettings();
    }, [])

    return (
        <div className='settings'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-product-name flex-col'>
                    <p>Tarifa de entrega</p>
                    <input onChange={onChangeHandler} value={data.tarifa || (settings[0]?.tarifa || "")} type="Number" name='tarifa' />
                </div>
                <button type='submit' className='add-btn'>GUARDAR</button>
            </form>
        </div>
    )
}

export default Set