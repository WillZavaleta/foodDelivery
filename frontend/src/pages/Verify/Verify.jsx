import React, { useContext, useEffect } from 'react'
import "./Verify.css"
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import Swal from "sweetalert2";

const Verify = () => {

    // const [searchParams, setSearchParams] = useSearchParams();
    // const success = searchParams.get("success")
    // const orderId = searchParams.get("orderId")
    const {setCarItems,url} = useContext(StoreContext);
    const navigate = useNavigate();

    // const verifyPayment = async () => {
    //     const response = await axios.post(url+'/api/order/verify',{success,orderId});
    //     if (response.data.success) {
    //         navigate("/myorders")
    //     }
    //     else{
    //         navigate("/")
    //     }
    // }
    const verifyPayment = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get("success") === "true";
        const orderId = urlParams.get("orderId");
        const userId = urlParams.get("userId");
    
        if (orderId) {
            await axios.post(url + "/api/order/verify", {
                orderId,
                success,
                userId: userId
            });
    
            if (success) {
                Swal.fire({
                      title: "Pago exitoso. ¡Gracias por su compra!",
                      // text: "You won't be able to revert this!",
                      icon: "success",
                      showCancelButton: false,
                      confirmButtonColor: "#ff6347",
                      confirmButtonText: "Aceptar",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        localStorage.removeItem("cart");
                        setCarItems({});
                        navigate("/myorders");
                      }
                    });
            } else {
                Swal.fire({
                      title: "Pago cancelado o fallido. Puedes intentarlo de nuevo.",
                      // text: "You won't be able to revert this!",
                      icon: "warning",
                      showCancelButton: false,
                      confirmButtonColor: "#ff6347",
                      confirmButtonText: "Aceptar.",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate("/cart");
                      }
                    });
            }
        }
    };
    

    useEffect(()=>{
        verifyPayment();
    },[])

  return (
    <div className='verify'>
        <div className='spinner'>

        </div>
    </div>
  )
}

export default Verify