import React,{useState,useEffect} from 'react'
import './login.scss'
import {Form,Button} from 'react-bootstrap';
import axiosInstance from '../axios/axios'
import {useNavigate} from 'react-router-dom'
import { socket } from '../../App';

export default function LoignComponent() {
const navigate = useNavigate()
const [values, setvalues] = useState({username:"",password:""});
const [error, seterror] = useState({});

const user = localStorage.getItem("counterjwt")
useEffect(() => {
  if(user){
    socket.emit("join_room",localStorage.getItem("countername"))
    navigate("/home");
  }
}, [user,navigate]);

const onChange = (e) =>{
  setvalues({...values,[e.target.name]:e.target.value})
  if(e.target.value)
  {
    seterror({...error,[e.target.name]:false})
  }else{
    seterror({...error,[e.target.name]:true})
  }
}
const HandleSubmit = async (event) =>{
  event.preventDefault();
  if(!values.username)return  seterror({...error,username:true})
  if(!values.password)return  seterror({...error,password:true})
  LoginUser() 
}

//login function
const LoginUser = async () =>{
  await axiosInstance.post('http://localhost:5000/api/counterUser/login', {
     username:values.username,
     password: values.password
   })
   .then(function (response) {
      if(response.status===200){
        localStorage.setItem("counterjwt",response.data.accessToken);
        localStorage.setItem("countername",response.data.counterid);
        localStorage.setItem("counterusername",response.data.user);
        socket.emit("join_room",response.data.counterid)
        navigate("/home")
      }
   })  
 }
  return (
    <div className="container w-50">
    <h1 className="heading">Counter Login</h1>
    <Form onSubmit={HandleSubmit}>
       <Form.Group className="mb-3" controlId="formBasicUsername">
         <Form.Control type="text" placeholder="UserName" name="username"  onChange={onChange}  value={values.username} />
        {error.username &&<Form.Text id="UsernameHelpBlock"  className="validationText">username cannot be empty</Form.Text>} 
       </Form.Group>

       <Form.Group className="mb-3" controlId="formBasicPassword">
         <Form.Control type="password" placeholder="Password" name="password" onChange={onChange} value={values.password} />
         {error.password && <Form.Text id="passwordHelpBlock" className="validationText">password cannot be empty</Form.Text>}
       </Form.Group>

       <Button variant="primary" type="submit" className="float-right" size="sm">Login</Button>
     </Form>  
 </div>
  )
}
