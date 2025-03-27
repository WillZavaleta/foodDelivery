import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const List = ({url}) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data)
    }
    else {
      toast.error("Error")
    }
  }

  const removeFood = async(foodId) => {
    const response = await axios.post(`${url}/api/food/remove`,{id:foodId})
    await fetchList();
    if (response.data.success){
      toast.success(response.data.message)
    }
    else{
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  useEffect(()=>{
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer)
  },[list])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Imagen</b>
          <b>Nombre</b>
          <b>Categoría</b>
          <b>Precio</b>
          <b>Acción</b>
        </div>
        {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div> {/* Spinner */}
                </div>
            ) : 
        list.map((item,index)=>{
          return(
            <div key={index} className='list-table-format'>
              {/* <img src={`${url}/images/`+item.image} alt="" /> */}
              <img src={item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p onClick={() => removeFood(item._id)} className='cursor delete'><img src={assets.cesto} alt="" /></p>
            </div>
          )
        })
      }
      </div>
    </div>
  )
}

export default List