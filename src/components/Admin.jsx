import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { auth } from '../Firebase'
import Firestore from './Firestore'

const Admin = (props) => {

    const [user, setUser] = useState(null)

    useEffect(()=>{
        if(auth.currentUser){
            setUser(auth.currentUser)
        }
        else{
            props.history.push("/login")
        }
    },[props.history, user])
    return (
        <div>
            <h2>
                Bienvenido
            </h2>
            {
                user && (<Firestore user={user}></Firestore>)
            }
        </div>
    )
}

export default withRouter(Admin)
