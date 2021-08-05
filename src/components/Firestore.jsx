import React, { useEffect, useState } from "react";
import moment from 'moment'
import 'moment/locale/es'
import {db} from '../Firebase'

function Firestore(props) {

  const [listaTarea, setListaTarea] = useState([])
  const [tarea, setTarea] =useState('')
  const [modoEdicion, setModoEdicion] = useState(false)
  const [id, setId] =useState("")
  const [ultimo, setUltimo] = useState("")
  const [desactivar, setDesactivar] = useState(false)

  useEffect(()=>{

    const obtenerDatos = async () =>{
      try {

        setDesactivar(true)

        const data = await db.collection(props.user.uid)
          .limit(3)
          .orderBy('fecha')
          .get()
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        setUltimo(data.docs[data.docs.length - 1])

        setListaTarea(arrayData)

        const query = await db.collection(props.user.uid)
          .limit(3)
          .orderBy('fecha')
          .startAfter(data.docs.length - 1)
          .get()

        if(query.empty){
          console.log('no hay más documentos')
          setDesactivar(true)
        }else{
          setDesactivar(false)
        }
        
      } catch (error) {
        console.log(error)
      }
    }
    obtenerDatos()
  },[props.user.uid])

  const siguiente =async () =>{
    setDesactivar(true)
    
    try {

      const data = await db.collection(props.user.uid)
      .limit(3)
      .orderBy('fecha')
      .startAfter(ultimo)
      .get()

      const arrayData = data.docs.map(doc => ({id:doc.id , ...doc.data()}))
      setListaTarea([...listaTarea, ...arrayData])
     
      setUltimo(data.docs[data.docs.length - 1]) 
      console.log(ultimo)
      console.log(listaTarea)
      console.log(arrayData)

      const query = await db.collection(props.user.uid)
      .limit(3)
      .orderBy('fecha')
      .startAfter(ultimo)
      .get()

      if(query.empty){
        setDesactivar(true)
      }
      else{
        setDesactivar(false)
      }
      
    } catch (e) {
      console.log(e)
    }
  }

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
                <li key={item.id} className="list-group-item ">{item.name} - {moment(item.fecha).format("LLL")}
                  <div className="d-md-flex justify-content-md-end">
                 <button onClick={()=> eliminarTarea(item.id)} className="btn btn-danger btn-sm me-md-2">Eliminar</button>
                 <button onClick={()=> activarEdicion(item)} className="btn btn-warning btn-sm">Editar</button>
                  </div> 
                 </li>
              ))               
            }
          </ul>
          <button disabled={desactivar} onClick={()=>siguiente()} className="btn-info btn-block -mt-2 btn-sm"> Siguiente</button>
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
