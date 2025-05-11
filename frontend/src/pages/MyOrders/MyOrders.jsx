import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {

    const { url, token, getTarifa } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [tarifa, setTarifa] = useState(null);

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
        console.log(response.data.data)
    }

    useEffect(() => {
        console.log(!token);
        if (token) {
            fetchOrders();
        }
    }, [token])

    useEffect(() => {
        const fetchTarifa = async () => {
            const value = await getTarifa();  // ✅ Obtienes el valor real
            setTarifa(value);
        };

        fetchTarifa();
    }, []);

    return (
        <div className='my-orders'>
            <h2>Mis Pedidos</h2>
            <div className='container'>
                {data.map((order, index) => {
                    return (
                        <div key={index} className='my-orders-order'>
                            {/* <img src={assets.parcel_icon} alt="" /> */}
                            <div className='my-orders-group'>{order.items.map((item, index) => {
                                return (
                                    <p key={index}>✅{item.name}<br />{item.quantity + " x $" + item.price + ".00"}</p>
                                )
                                // if (index === order.items.length-1) {
                                //     return item.name+" x "+item.quantity
                                // }
                                // else{
                                //     return item.name+" x "+item.quantity+", "
                                // }
                            })}</div>
                            <div className='my-orders-group'>
                                <p>
                                    {order.delivery && (
                                        <>
                                            <strong>Tarifa de entrega:</strong> ${tarifa}
                                        </>
                                    )}
                                </p>
                                <p><strong>Total:</strong> ${order.amount}.00</p>
                            </div>
                            <p><strong>Fecha de Pedido:</strong> <br />{new Date(order.date).toLocaleDateString("es-MX", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}</p>
                            <p>{order.delivery ? (
                                <>
                                    <strong>Dirección de entrega:</strong><br />{order.address.street}
                                </>
                            ) : (
                                "Se recoge en local"
                            )}</p>
                            <div className='my-orders-group'>
                                <p><span>&#x25cf;</span><b>{order.status}</b></p>
                                {/* <button onClick={fetchOrders}>Rastrear Pedido</button> */}
                                <button onClick={fetchOrders}>PEDIR POR WHATSAPP</button>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default MyOrders