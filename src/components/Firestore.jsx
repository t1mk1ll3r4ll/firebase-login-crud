import React, { useEffect, useState } from "react";
import {db} from '../Firebase'

function Firestore(props) {

  const [listaTarea, setListaTarea] = useState([])
  const [tarea, setTarea] =useState('')
  const [modoEdicion, setModoEdicion] = useState(false)
  const [id, setId] =useState("")

  useEffect(()=>{
    const obtenerDatos = async () =>{
      try{
          const data = await db.collection("Tareas").get()
          const arrayData = data.docs.map(doc => ({id:doc.id , ...doc.data()}))
          setListaTarea(arrayData)
      }
      catch(e){
        console.log(e)
      }

    }
    obtenerDatos()
  },[])

  const agregarTarea = async (e) =>{
    e.preventDefault()
    if(!tarea.trim()){
      window.alert("Escriba el nombre de la tarea")
      return
    }

    try{
    const nuevaTarea = {name:tarea , fecha: Date.now()}
    const data = await db.collection(props.user.uid).add(nuevaTarea)
     setListaTarea([...listaTarea, {...nuevaTarea, id:data.id}])
    }catch(e){
      console.log(e)
    }
    e.target.reset()
    setTarea("")
  }

  const eliminarTarea = async (id) =>{
    try {
      await db.collection(props.user.uid).doc(id).delete()
      const arrayFiltrado = listaTarea.filter(item =>item.id !== id)
      setListaTarea(arrayFiltrado)
    } catch (error) {
      console.log(error)
    }
  }
  const activarEdicion = (item) =>
  {
    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id)
  }
  const editarTarea = async (e) =>{
    e.preventDefault()
    if(!tarea.trim())
    {
      window.alert("el nombre de la tarea esta vacio")
      return
    }

    try {
      await db.collection(props.user.uid).doc(id).update({name:tarea, updated: Date.now()})
      const arrayEditado = listaTarea.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, name:tarea} :item
      ))
      setListaTarea(arrayEditado)
      setModoEdicion(false)
      setTarea("")
      setId("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container mt3">     
     <h1> CRUD FIRESTORE</h1>
     <hr/>
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center"> Lista de tareas</h3>
          <ul className="list-group">
            {
              listaTarea.map(item =>(
                <li key={item.id} className="list-group-item ">{item.name} 
                  <div className="d-md-flex justify-content-md-end">
                 <button onClick={()=> eliminarTarea(item.id)} className="btn btn-danger btn-sm me-md-2">Eliminar</button>
                 <button onClick={()=> activarEdicion(item)} className="btn btn-warning btn-sm">Editar</button>
                  </div> 
                 </li>
              ))               

            }
          </ul>
        </div>
        <div className="col-md-6">
          <h3 className="text-center">{modoEdicion ? "Editar tarea" : "Añadir tarea"}</h3>
          <form onSubmit={modoEdicion ? editarTarea : agregarTarea}>
            <input type="text" placeholder="nombre de tarea"
            className="form-control mb-2"
            onChange={e =>setTarea(e.target.value)}
            value={tarea}
            />
            <button type="submit" className={ modoEdicion ? "btn btn-warning mx-auto" : "btn btn-dark mx-auto"}>{modoEdicion ? "Editar tarea" : "Añadir tarea"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Firestore;
