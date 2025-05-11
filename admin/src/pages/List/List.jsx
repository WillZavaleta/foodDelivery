import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import Swal from "sweetalert2";
import Modal from './Modal'

const List = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  //const [selectedId, setSelectedId] = useState(null);    // Guarda el ID del modal

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data)
    }
    else {
      toast.error("Error")
    }
  }

  const removeFood = async (foodId) => {
    Swal.fire({
      title: "¿Seguro que desea eliminar el platillo?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6347",
      cancelButtonColor: "#323232",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
        await fetchList();
        if (response.data.success) {
          toast.success(response.data.message)
        }
        else {
          toast.error("Error")
        }
      }
    });
  }

  useEffect(() => {
    fetchList();
  }, [])

  const toggleModal = (id) => {
    //setSelectedId(id);         // Almacena el ID del item seleccionado
    setIsModalOpen(prev => !prev);  // Alterna entre abrir/cerrar el modal solo del ítem actual
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer)
  }, [list])

  return (
    <>
    
    <div className='list add flex-col'>
      <h3>Lista de Platillos</h3>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Imagen</b>
          <b>Nombre</b>
          <b>Categoría</b>
          <b>Precio</b>
          <b>Existencia</b>
          <b>Acción</b>
        </div>
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div> {/* Spinner */}
          </div>
        ) :
          list.map((item, index) => {
            return (
              <div key={index} className='list-table-format'>
                {/* <img src={`${url}/images/`+item.image} alt="" /> */}
                <img src={item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{item.price}</p>
                <p>{item.stock ? "Sí" : "No"}</p>
                <p className='cursor icono'>
                  <img onClick={() => removeFood(item._id)} src={assets.cesto} alt="" />
                  <img onClick={() => {toggleModal(); setSelectedFood(item);}} src={assets.editar} alt="" />
                </p>
              </div>
            )
          })
        }
      </div>
    </div>
    {isModalOpen && (
                <Modal
                setIsModalOpen={setIsModalOpen}
                food={selectedFood}
                url={url}
                fetchList={fetchList()}
                />
            )}
    </>
  )
}

export default List