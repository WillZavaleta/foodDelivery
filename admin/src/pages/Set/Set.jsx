import React, { useState, useEffect } from 'react'
import "./Set.css"
import axios from "axios"
import { toast } from 'react-toastify'

const Set = ({ url }) => {
    const [data, setData] = useState({
        tarifa: ""
    })
    const [horario, setHorario] = useState({
        dia: "Lunes",
        apertura1: "",
        cierre1: "",
        abierto: true
    })
    const [settings, setSettings] = useState([]);
    const [isOn, setIsOn] = useState(horario.abierto);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        //const checked = event.target.checked;
        // Asigna el valor al usestate correspondiente
        switch (name) {
            case "tarifa":
                setData(data => ({ ...data, [name]: value }))
                break;
            case "dia":
                setHorario(horario => ({ ...horario, [name]: value }))
                break;
            case "apertura1":
                setHorario(horario => ({ ...horario, [name]: value }))
                break;
            case "cierre1":
                setHorario(horario => ({ ...horario, [name]: value }))
                break;
            case "abierto":
                setHorario((horario) => ({ ...horario, [name]: !horario.abierto }));
                break;
            default:
                console.log(`No hay estado para el input: ${name}`);
        }
    }

    const onSubmitSettings = async (event) => {
        event.preventDefault();
        // // Verifica si es un número y que no sea NaN
        // if (!data.tarifa || isNaN(Number(data.tarifa))) {
        //     toast.error("Por favor, ingresa un número válido");
        //     return;   // Detiene la ejecución si no es un número
        // }
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

    // ✅ Manejar el cambio de día
    const handleSelectDay = (event) => {
        const selectedDay = event.target.value;
        getTimeDia(selectedDay);
    };

     // ✅ Manejar el cambio del checkbox
     const handleCheckboxChange = (event) => {
        setIsOn(event.target.checked);  // Actualiza `isOn` al hacer click
    };

    const getTimeDia = async (dia) => {
        //const dia = event.target.value;
        try {
            const response = await axios.get(url + "/api/time/getone",{params: { dia }});//para get se usa params para enviar el parámetro a consultar
            
            if (response.data.success) {
                const { dia, apertura1, cierre1, abierto } = response.data.data;
                setHorario({
                    dia: dia || "Lunes",                 // Si no hay valor, usa el predeterminado
                    apertura1: apertura1 || "",          // Si no hay valor, cadena vacía
                    cierre1: cierre1 || "",
                    abierto: abierto !== undefined ? abierto : true // Si no hay valor, usa true
                });

                // ✅ Sincroniza el estado del checkbox
                setIsOn(abierto !== undefined ? abierto : true);
                console.log(horario);
            }else{
                toast.error("Error")
            }
        } catch (error) {
            console.error("Error al obtener horario:", error);
            toast.error("Error al conectar con la API");
        }
        
    }

    const onSubmitHorario = async (event) => {
        event.preventDefault();
        const response = await axios.post(url + "/api/time/update", {
            dia: horario.dia,
            apertura1: horario.apertura1,
            cierre1: horario.cierre1,
            apertura2: "",
            cierre2: "",
            abierto: horario.abierto
        })
        console.log(response)
        if (response.data.success) {
            // setHorario({
            //     dia: "Lunes",
            //     apertura1: "",
            //     cierre1: "",
            //     abierto: true
            // })
            toast.success(response.data.message)
            //getSettings();
        } else {
            toast.error(response.data.message)
        }
    }

    useEffect(() => {
        getSettings();
        getTimeDia("Lunes");
    }, [])

    useEffect(() => {
        console.log(horario);
    }, [horario])

    return (
        <div className='settings-container flex-col'>
            <form className='flex-col' onSubmit={onSubmitSettings}>
                <h3>Tarifa de entrega</h3>
                <div className='settings-group'>
                    <input onChange={onChangeHandler} value={data.tarifa || (settings[0]?.tarifa || "")} type="Number" name='tarifa' />
                    <button className='save-btn' type='submit'>GUARDAR</button>
                </div>
            </form>
            <hr />
            <div className='flex-col'>
                <form className='form-horarios-container flex-col' onSubmit={onSubmitHorario}>
                    <h3>Horarios</h3>
                    <div className='settings-group'>
                        <select onChange={(event)=>{onChangeHandler(event); handleSelectDay(event);}} name="dia" required>
                            <option value="Lunes">Lunes</option>
                            <option value="Martes">Martes</option>
                            <option value="Miércoles">Miércoles</option>
                            <option value="Jueves">Jueves</option>
                            <option value="Viernes">Viernes</option>
                            <option value="Sábado">Sábado</option>
                            <option value="Domingo">Domingo</option>
                        </select>
                        <label className="switch">
                            <input type="checkbox" name="abierto" checked={isOn} onChange={(event) => {setIsOn(!isOn); handleCheckboxChange; onChangeHandler(event); }} />
                            <span className="slider"></span>
                        </label>
                        <p>{isOn ? "Abierto" : "Cerrado"}</p>
                    </div>
                    <div className={`settings-group ${isOn? "showform":"hideform"}`}>
                        <div className='date-container'>
                            <label htmlFor="apertura1">Apertura:</label>
                            {/* Se ponen las comillas en value={horario.apertura1 || ""} para que genere error de componente controlado */}
                            <input onChange={onChangeHandler} type="time" name="apertura1" value={horario.apertura1 || ""} required /> 
                        </div>
                        <div className='date-container'>
                            <label htmlFor="cierre1">Cierre:</label>
                            <input onChange={onChangeHandler} type="time" name="cierre1" value={horario.cierre1 || ""} required />
                        </div>
                    </div>
                    <button type="submit" className='save-btn'>GUARDAR</button>
                </form>
            </div>
            <hr />
        </div>
    )
}

export default Set