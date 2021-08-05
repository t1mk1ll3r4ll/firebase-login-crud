import React, { useCallback, useState } from 'react'
import { withRouter } from 'react-router-dom'
import {auth, db} from '../Firebase'

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [error, setError] = useState(null)
    const [esRegistro, setEsRegistro] =useState(true)

    const procesarDatos = (e) =>{
        e.preventDefault()
        if(!email.trim()){
            setError("ingrese su correo")
            return
        }
        if(!pass.trim){
            setError("ingrese una contraseña")
            return
        }
        if(pass.length<6){
            setError("la contraseña debe ser mayor a 6 caracteres")
            return
        }
        //window.alert("yay!")
        setError(null)
        if(esRegistro){
            registrar()
        }else{
            loginin()
        }
    }
    const loginin = useCallback(async ()=>{
        try {
            const res = await auth.signInWithEmailAndPassword(email,pass)
            console.log(res)
            setPass("")
            setEmail("")
            setError(null)
            props.history.push("/admin")
            
        } catch (error) {
            if(error.code==='auth/user-not-found'){
                setError("no existe el usuario")
            }
            if(error.code==='"auth/wrong-password"'){
                setError("la contraseña es incorrecta")
            }
            if(error.code==='auth/invalid-email'){
                setError("el correo es invalido")
            }
        }
    },[email, pass, props.history])
    const registrar  =  useCallback (async ()=>{
        try {
           const res = await auth.createUserWithEmailAndPassword(email,pass)
           await db.collection("Usuarios").doc(res.user.uid).set({
               email: res.user.email,
               uid: res.user.uid
           })
           await db.collection(res.user.uid).add(
               {
                   name:"tarea ejemplo",
                   fecha : Date.now()
               }
           )
           setError(null)
           setEmail("")
           setPass("")
           console.log(res)
           props.history.push("/admin")

        } catch (error) {
            if(error.code=== 'auth/invalid-email'){
                setError("Email no valido")
            }
            if(error.code=== 'auth/email-already-in-use'){
                setError("El correo esta en uso, intenta iniciar sesion")
            }
        }

    },[email, pass, props.history])

    return (
        <div className="mt-5">
            <h3 className="text-center">
                {
                    esRegistro ? 'Registro de usuarios' : 'Inicio de sesion'
                }
            </h3>
            <hr/>
            <div className="row justify-content-center">
                <div className="col-12 com-sm-8 col-md-6 col-x1-4">
                    <form onSubmit={procesarDatos}>
                        {
                            error && (<div className="alert alert-danger"> {error} </div>)
                        }
                        <input type="email"
                        placeholder="ingrese un email" 
                        className="form-control mb-2" 
                        onChange={e=>setEmail(e.target.value)}
                        value={email}
                        />

                        <input type="password"
                        placeholder="ingrese su contraseña" 
                        className="form-control mb-2" 
                        autoComplete="password"
                        onChange={e=>setPass(e.target.value)}
                        value={pass}
                        />

                        <div className=" d-grid gap-2">
                        <button className="  btn btn-dark btn-lg btn-block mb-2" type="submit">{esRegistro ? 'Registrarse' : 'Acceder'}</button>
                        <button type="button" onClick={()=> setEsRegistro(!esRegistro)} className="btn btn-info btn-sm btn-block mb-2">
                                {esRegistro ? '¿ya tienes cuenta?' : '¿no tienes cuenta?'}
                        </button>
                        
                        
                        </div>
                        {
                            esRegistro ? null : (<button className="  btn btn-danger btn-sm  mb-2" type="button" onClick={()=>props.history.push("/recuperar")}>Recupera tu cuenta</button>)
                        }
                    </form>
                        
                </div>
            </div>
        </div>
    )
}
    export default withRouter(Login)
