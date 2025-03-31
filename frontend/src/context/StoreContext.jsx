import { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCarItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : {}; // Si hay datos, convertirlos a objeto
      });
    const url = "https://food-del-backend-raas.onrender.com"
    // const url = "http://localhost:4000";
    const [token,setToken] = useState("");
    const [food_list,setFoodList] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [estadoActual, setEstadoActual] = useState({});

    // const addToCart = async (itemId) => {
    //     if (!cartItems[itemId]) {
    //         setCarItems((prev)=>({...prev,[itemId]:1}))
    //     }
    //     else {
    //         setCarItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
    //     }        
    //     if (token) {//if token, si el usuario está loggeado
    //         await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
    //     }
    // }

    // const addToCart = async (itemId, conOrilla = false) => {
    //     setCarItems((prev) => {
    //         const existingItem = prev[itemId];
    
    //         return {
    //             ...prev,
    //             [itemId]: existingItem
    //                 ? { ...existingItem, cantidad: existingItem.cantidad + 1 }
    //                 : { cantidad: 1, conOrilla }
    //         };
    //     });
    
    //     if (token) {
    //         await axios.post(url + "/api/cart/add", { itemId, conOrilla }, { headers: { token } });
    //     }
    // };
    const addToCart = async (itemId, conOrilla = false) => {
        setCarItems((prev) => {
            const existingItems = prev[itemId] || [];
    
            // Verificar si ya existe la misma variación (con/sin orilla)
            const index = existingItems.findIndex(item => item.conOrilla === conOrilla);
    
            let updatedItems;
            if (index !== -1) {
                // Si ya existe la misma variación, incrementar la cantidad
                updatedItems = existingItems.map((item, i) =>
                    i === index ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            } else {
                // Si no existe, agregar un nuevo objeto con la variación
                updatedItems = [...existingItems, { cantidad: 1, conOrilla }];
            }
    
            return {
                ...prev,
                [itemId]: updatedItems
            };
        });
    
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId, conOrilla }, { headers: { token } });
        }
    };
    

    // const removeFromCart = async (itemId) => {
    //     setCarItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
    //     if (token) {
    //         await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
    //     }
    // }
    // const removeFromCart = async (itemId) => {
    //     setCarItems((prev) => {
    //         if (!prev[itemId]) return prev; // Si no existe, no hace nada
    
    //         const newCart = { ...prev };
    
    //         // Si la cantidad es mayor a 1, la reduce
    //         if (newCart[itemId].cantidad > 1) {
    //             newCart[itemId].cantidad -= 1;
    //         } else {
    //             // Si la cantidad llega a 0, elimina el item del carrito
    //             delete newCart[itemId];
    //         }
    
    //         return newCart;
    //     });
    
    //     // Si el usuario está loggeado, actualiza el carrito en la base de datos
    //     if (token) {
    //         await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    //     }
    // };

    const removeFromCart = async (itemId, conOrilla = false) => {
        setCarItems((prev) => {
            const existingItems = prev[itemId] || [];
    
            // Buscar la variación específica
            const updatedItems = existingItems
                .map(item => 
                    item.conOrilla === conOrilla 
                        ? { ...item, cantidad: item.cantidad - 1 } 
                        : item
                )
                .filter(item => item.cantidad > 0);  // Eliminar si cantidad es 0
    
            return {
                ...prev,
                [itemId]: updatedItems.length > 0 ? updatedItems : undefined  // Eliminar clave si no hay más variaciones
            };
        });
    
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId, conOrilla }, { headers: { token } });
        }
    };
    

    useEffect(()=>{
        console.log(cartItems);
        localStorage.setItem("cart",JSON.stringify(cartItems));//guardar carrito en el localstorage
    },[cartItems])

    // const getTotalCartAmount = () => {
    //     let totalAmount = 0;
    //     // console.log(food_list);
    //     for (const item in cartItems){
    //         if(cartItems[item] > 0){
    //             let itemInfo = food_list.find((product) => product._id === item);
    //             // console.log("aca",itemInfo);
    //             totalAmount += itemInfo?.price * cartItems[item];
    //         }
    //     }
    //     return totalAmount;
    // }
    // const getTotalCartAmount = () => {
    //     let totalAmount = 0;
    
    //     for (const item in cartItems) {
    //         const { cantidad } = cartItems[item];  // Extrae la cantidad correctamente
    //         if (cantidad > 0) {
    //             const itemInfo = food_list.find((product) => product._id === item);
    
    //             if (itemInfo) {
    //                 totalAmount += itemInfo.price * cantidad;
    //             }
    //         }
    //     }
    
    //     return totalAmount;
    // };
    const getTotalCartAmount = () => {
        let totalAmount = 0;
    
        for (const id in cartItems) {
            // Verificar si cartItems[id] es un array antes de usar forEach
            if (Array.isArray(cartItems[id])) {
                cartItems[id].forEach(item => {
                    totalAmount += item.cantidad * (item.conOrilla ? 15 + food_list.find(food => food._id === id)?.price : food_list.find(food => food._id === id)?.price);
                });
            }
        }
    
        return totalAmount;
    };
    // const getTotalCartAmount = () => {
    //     let totalAmount = 0;
    
    //     for (const itemId in cartItems) {
    //         cartItems[itemId].forEach(variation => {
    //             const itemInfo = food_list.find(product => product._id === itemId);
    //             if (itemInfo) {
    //                 totalAmount += itemInfo.price * variation.cantidad;
    //             }
    //         });
    //     }
    //     return totalAmount;
    // };
    

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
                //console.log("hoooy",horario);
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
