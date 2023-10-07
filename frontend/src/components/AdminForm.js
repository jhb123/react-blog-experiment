// import * as React from 'react';
import { useState, useContext } from "react";
import Button from '@mui/material/Button';
import axios from "axios";
import { AdminContext } from "../pages/Layout";
import {instance} from "../requests/admin"
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const LabeledField = ({type, name, label, onChange}) => {
  return (
    <div className="admin-control">
      <label>{label}</label>
      <input type={type} name ={name} onChange={onChange}></input>
    </div>
  )
}


const AdminForm = ({open, setOpen}) => {
  
  const [password, setPassword] = useState("")
  const handleSetPassword = (event) => {
    setPassword((password) => event.target.value)
  }
  const [isErr, setIsErr] = useState(false)
  const [isAdmin, setIsAdmin] = useContext(AdminContext);

  // const [open, setOpen] = useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setIsErr(false)
    setOpen(false);
  };

  const admin_req = (input_password) => 
    axios.post('/admin_login', {password: input_password})
      .then(function (response) {
        setOpen(false);
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
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Admin</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sign in for admin powers. 
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={handleSetPassword}
            error={isErr}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => admin_req(password)} variant="contained">Sign in</Button>
        </DialogActions>
      </Dialog>
    // <div className="scrim">
    //   <div className="admin-control">
    //   <div className="background admin-form">
    //   <LabeledField label="Admin" type="text" name = "password" onChange={handleSetPassword}/>
    //   { isErr ? <p1>Error logging in</p1> : null}
    //   <button className="primary" onClick={() => admin_req(password)}>sign in</button>
    //   <button className="secondary" onClick={handleToggleShowAdminPage}>cancel</button>
    //   </div>
    //   </div>
    //  </div>
  );
};


export default AdminForm;