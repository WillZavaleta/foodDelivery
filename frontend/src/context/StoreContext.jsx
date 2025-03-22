import { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCarItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : {}; // Si hay datos, convertirlos a objeto
      });
    // const url = "https://food-del-backend-raas.onrender.com"
    const url = "http://localhost:4000";
    const [token,setToken] = useState("");
    const [food_list,setFoodList] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [estadoActual, setEstadoActual] = useState({});

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCarItems((prev)=>({...prev,[itemId]:1}))
        }
        else {
            setCarItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }        
        if (token) {//if token, si el usuario está loggeado
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        setCarItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if (token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }

    useEffect(()=>{
        console.log(cartItems);
        localStorage.setItem("cart",JSON.stringify(cartItems));//guardar carrito en el localstorage
    },[cartItems])

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        // console.log(food_list);
        for (const item in cartItems){
            if(cartItems[item] > 0){
                let itemInfo = food_list.find((product) => product._id === item);
                // console.log("aca",itemInfo);
                totalAmount += itemInfo?.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list")
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCarItems(response.data.cartData);
    }

    const fetchHorarios = async () => {
        const response = await axios.get(url +"/api/time/get")
        setHorarios(response.data.data);
    }

    const getHorarioDiaActual = async () => {
        try {
            const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const hoy = new Date().getDay();  // Obtiene el día actual (0=Domingo, 1=Lunes, etc.)
            const diaActual = diasSemana[hoy];

            const response = await axios.get(url +"/api/time/getone",{params: {dia: diaActual}});
            if (response.data.success) {
                const horario = response.data.data;
                console.log("hoooy",horario);
                // Verificar si está abierto o cerrado
                verificarEstado(horario);
            }
        } catch (error) {
            console.error("Error:", error);
        }
        
    }

    //will
    const getTarifa = async () => {
        let tarifa = 0;
        const response = await axios.get(url + "/api/set/get");
        if (response.data.success) {
             tarifa = response.data.data[0]?.tarifa;   
        }
        return tarifa;
    }

    useEffect(()=>{
        async function loadData() {
            await fetchFoodList();
            await fetchHorarios();
            if(localStorage.getItem("token")){//si esta logeado
                setToken(localStorage.getItem("token"))
                await loadCartData(localStorage.getItem("token"))
            }  
        }
        loadData();
    },[])

    //useEffect para verificar si esta abierto o cerrado actualmente
    useEffect(() => {
        getHorarioDiaActual();
        const interval = setInterval(() => {
            getHorarioDiaActual();  // Verifica cada minuto
        }, 60000);

        return () => clearInterval(interval);  // Limpia el intervalo
    }, []);

        // ✅ Función para verificar si está abierto o cerrado
        const verificarEstado = (horario) => {
            const ahora = new Date();
            const horaActual = ahora.getHours();
            const minutosActual = ahora.getMinutes();
    
            if (horario.abierto) {
                const [aperturaHoras, aperturaMinutos] = horario.apertura1.split(":").map(Number);
                const [cierreHoras, cierreMinutos] = horario.cierre1.split(":").map(Number);
    
                const apertura = aperturaHoras * 60 + aperturaMinutos;
                const cierre = cierreHoras * 60 + cierreMinutos;
                const actual = horaActual * 60 + minutosActual;
    
                if (actual >= apertura && actual < cierre) {
                    setEstadoActual("Abierto");
                } else {
                    setEstadoActual("Cerrado");
                }
            } else {
                setEstadoActual("Cerrado");
            }
        };

    const contextValue = {
        food_list,
        cartItems,
        setCarItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        getTarifa,
        horarios,
        estadoActual
    }
    return (
        <StoreContext.Provider value = {contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
