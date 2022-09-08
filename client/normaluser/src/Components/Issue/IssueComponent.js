import React,{useState,useEffect} from 'react'
import './Issue.scss'
import {Form,Button} from 'react-bootstrap';
import axiosInstance from '../axios/axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {TabTitle} from '../Title/title.js'
import { socket } from '../../App';

export default function IssueComponent(props) {
  TabTitle("Add Issue") 
  const navigate = useNavigate()
  const [values, setvalues] = useState({name:"",telephone:"",email:"",issue:""});
  const [error, seterror] = useState({});
  const [emailFormat, setemailFormat] = useState();
  const [telephoneFormat, settelephoneFormat] = useState();


  useEffect(() => {
    if(!localStorage.getItem('normaluserjwt')) navigate('/')
    AthenticateIssue()
    props.getNotification()
    props.getSolution()
  },[]);

  //Athenticate Issue Function
  const AthenticateIssue = async () =>{
    await  axiosInstance.get(`${process.env.REACT_APP_URL}/api/normaluser/IssueCheck`)
      .then(function (response) {
          if(response.data === true){
            return navigate("/onqueue")
          }
      })
    }  



  const onChange = (e) =>{
    //store value into state
    setvalues({...values,[e.target.name]:e.target.value})
    //set errors
    if(e.target.value)
    {
      seterror({...error,[e.target.name]:false})
    }else{
      seterror({...error,[e.target.name]:true})
    }
    //email formate validation
    if(e.target.name === 'email')
    {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value)){
        setemailFormat(false)
      }else{
        setemailFormat(true)
      }
    }
    //phone number format validation
    if(e.target.name === 'telephone'){
      const phoneno =/^\d{10}$/;
      if(e.target.value.match(phoneno)){
        settelephoneFormat(false)
      }else{
        settelephoneFormat(true)
      }
    }

  }


  //AddIssue Function
  const AddIssue = async () =>{
   await axiosInstance.post(`${process.env.REACT_APP_URL}/api/normaluser/addissue`, {
      issue:values.issue,
      name:values.name,
      email:values.email,
      phoneno:values.telephone
    })
    .then(function (response) {
     if(response.status===201){
      toast.success(`${response.data.msg}`)
      socket.emit("join_room",response.data.id);
      navigate('/onqueue')
     }
    })
  }


  const HandleSubmit = (event) =>{
    event.preventDefault();
    if(!values.name) return seterror({...error,name:true})
    if(!values.telephone) return seterror({...error,telephone:true})
    if(telephoneFormat === true) return settelephoneFormat(true)
    if(!values.email) return seterror({...error,email:true})
    if(emailFormat === true) return setemailFormat(true)
    if(!values.issue) return seterror({...error,issue:true})
    AddIssue()
  }
  return (
    <div>
      <div className="issueDetails">
        <h2 className="pb-4">Add your issue details</h2>
        <Form className='w-75' onSubmit={HandleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicname">
            <Form.Control type="text" size="lg" name="name" placeholder="Name" onChange={onChange} />
            {error.name &&<Form.Text id="UsernameHelpBlock"  className="validationText">Name cannot be empty</Form.Text>} 
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasictelephone">
            <Form.Control type="text" size="lg" name="telephone" placeholder="Telephone" onChange={onChange} />
            {error.telephone &&<Form.Text id="UsernameHelpBlock"  className="validationText">Telephone cannot be empty</Form.Text>} 
            {telephoneFormat &&<Form.Text id="UsernameHelpBlock"  className="validationText">Invalid Telephone</Form.Text>} 
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control type="email" size="lg" name="email" placeholder="Email" onChange={onChange} />
            {error.email &&<Form.Text id="UsernameHelpBlock"  className="validationText">Email cannot be empty</Form.Text>} 
            {emailFormat &&<Form.Text id="UsernameHelpBlock"  className="validationText">Invalid Email</Form.Text>} 
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicissue">
            <Form.Control as="textarea" size="lg" name="issue" rows="6"  placeholder="lssue"  onChange={onChange}/>
            {error.issue &&<Form.Text id="UsernameHelpBlock"  className="validationText">Issue cannot be empty</Form.Text>} 
          </Form.Group>
          <Button variant="primary" type="submit" className="float-right" size="sm">Submit</Button>
        </Form>
      </div>
    </div>
  )
}
