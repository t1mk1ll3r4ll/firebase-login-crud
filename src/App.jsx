import React, { useEffect, useState } from "react";
//import firebase from './Firebase'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import  Navbar from "./components/Navbar";
import  Login  from "./components/Login";
import  Admin  from "./components/Admin";
import { auth } from "./Firebase";
import  Recuperar  from "./components/Recuperar";



function App() {
  const [firebaseUser, setFirebaseUser] = useState(false)
  useEffect(()=>{
    auth.onAuthStateChanged(user => {
      //console.log(user)
      if(user){
        setFirebaseUser(user)
      }
      else{
        setFirebaseUser(null)
      }
    })
  },[])
  return firebaseUser !== false ? (
    <Router>
      <div className="container">
        <Navbar firebaseUser={firebaseUser}/>
        <Switch>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="/admin">
            <Admin/>
          </Route>
          <Route path="/recuperar">
            <Recuperar></Recuperar>
          </Route>
          <Route path="/">
            inicio
          </Route>
        </Switch>
      </div>
    </Router>
  ): (
    <div className="d-flex align-items-center">
      <strong>Loading...</strong>
      <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
    </div>
    ) ;
}

export default App;
