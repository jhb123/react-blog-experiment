
import { useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../pages/Layout";
import {instance} from "../requests/admin"

const LabeledField = ({type, name, label, onChange}) => {
  return (
    <div className="admin-control">
      <label>{label}</label>
      <input type={type} name ={name} onChange={onChange}></input>
    </div>
  )
}


const AdminForm = ({handleAdminToggle, handleToggleShowAdminPage}) => {
  
  const [password, setPassword] = useState("")
  const handleSetPassword = (event) => {
    setPassword((password) => event.target.value)
  }

  const [isErr, setIsErr] = useState(false)

  const [isAdmin, setIsAdmin] = useContext(AdminContext);


  const admin_req = (input_password) => 
    axios.post('/admin_login', {password: input_password})
      .then(function (response) {
        handleToggleShowAdminPage();
        setIsAdmin(true);
        setIsErr(false);
        console.log(response.data)
        instance.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
        //set("Authorization", "Bearer ${response.statusText}")
      })
      .catch(function (error) {
        setIsAdmin(false);
        setIsErr(true);
      });


  return (
    <div className="scrim">
      <div className="admin-control">
      <div className="background admin-form">
      <LabeledField label="Admin" type="text" name = "password" onChange={handleSetPassword}/>
      { isErr ? <p1>Error logging in</p1> : null}
      <button className="primary" onClick={() => admin_req(password)}>sign in</button>
      <button className="secondary" onClick={handleToggleShowAdminPage}>cancel</button>
      </div>
      </div>
     </div>
  );
};


export default AdminForm;