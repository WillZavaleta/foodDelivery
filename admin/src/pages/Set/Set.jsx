import React, { useState, useEffect } from 'react'
import "./Set.css"
import axios from "axios"
import { toast } from 'react-toastify'

const Set = ({ url }) => {
    const [data, setData] = useState({
        tarifa: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    useEffect(() => {
        console.log(data);
    }, [data])

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("tarifa", Number(data.tarifa))
        const response = await axios.post(`${url}/api/set/update`, formData);
        if (response.data.success) {
            setData({
                tarifa: ""
            })
            toast.success(response.data.message)
        }
        else {
            toast.error(response.data.message)
        }
    }

    return (
        <div className='settings'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-product-name flex-col'>
                    <p>Tarifa de entrega</p>
                    <input onChange={onChangeHandler} value={data.tarifa} type="Number" name='tarifa' />
                </div>
                <button type='submit' className='add-btn'>GUARDAR</button>
            </form>
        </div>
    )
}

export default Set