import React, { useCallback, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { auth } from '../Firebase'

const Recuperar = (props) => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState(null)

    const procesarDatos = (e) =>{
        e.preventDefault()
        if(!email.trim()){
            setError("ingrese su correo")
            return
        }
        recuperar()
        setError(null)
        
    }

    const recuperar = useCallback(async () => {
        try {
            await auth.sendPasswordResetEmail(email)
            console.log("correo enviado")
            props.history.push("/login")
            
        } catch (error) {
            console.log(error)
            setError(error.message)
            
        }
    },[email, props.history])
    return (
        <div className="mt-5">
        <h3 className="text-center">
           Reiniciar contraseña
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
                    <div className=" d-grid gap-2">
                    <button className="  btn btn-dark btn-lg btn-block mb-2" type="submit">Recuperar contraseña</button>       
                     </div>
                </form>
             </div>
         </div>
    </div>
    
    )
}

export default withRouter(Recuperar)
