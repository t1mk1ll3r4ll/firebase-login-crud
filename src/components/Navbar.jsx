import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import { auth } from '../Firebase'


 const Navbar = (props) => {
    
    const cerrarSesion =  () =>{
         auth.signOut().then(
             ()=>
             {
                props.history.push("/login")
             }
         )
    }
    return (
        <div className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">Auth</Link>

                <NavLink className=" btn btn-dark" to="/" exact>
                    Inicio
                </NavLink>
                {
                    props.firebaseUser !== null ? (<NavLink className=" btn btn-dark" to="/admin">
                    Admin
                </NavLink>
                    )
                :null
                }
                {
                        
                        props.firebaseUser !== null ? (
                        <button 
                            className="btn btn-dark" 
                            onClick={() => cerrarSesion()}
                        >
                            Cerrar Sesión
                        </button>
                        ): (
                        <NavLink 
                            className="btn btn-dark" 
                            to="/login"
                        >
                            Login
                        </NavLink>
                        )
                    }

            </div>
            
        </div>
    )
}
export default withRouter (Navbar)