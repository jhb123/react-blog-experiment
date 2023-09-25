
import { useState } from "react";
import axios from "axios";

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
    

  const admin_req = (input_password) => axios.post('/admin_login', {
    password: input_password,
  }).then(function (response) {
    handleAdminToggle(true);
    handleToggleShowAdminPage();
    setIsErr(false);
  })
  .catch(function (error) {
    console.log(error);
    setIsErr(true);
  });



  return (
    <div className="scrim">
        <div className="admin-control">
          <div className="admin-form">
          <LabeledField label="Admin" type="text" name = "password" onChange={handleSetPassword}/>
          { isErr ? <p1>Error logging in</p1> : null}
          <button onClick={() => admin_req(password)}>sign in</button>
          <button onClick={handleToggleShowAdminPage}>cancel</button>
          </div>
        </div>
     </div>
  );
};


export default AdminForm;