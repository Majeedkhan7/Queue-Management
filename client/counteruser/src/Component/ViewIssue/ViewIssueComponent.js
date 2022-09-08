import React,{useState,useEffect} from 'react'
import './viewIssue.scss'
import {Button,Form} from 'react-bootstrap';
import axiosInstance from '../axios/axios'
import { useParams,useNavigate } from 'react-router-dom';
import { TabTitle } from '../Title/title';

export default function ViewIssueComponent() {
  TabTitle("Single Issue")
  const navigate = useNavigate();
  const {id} = useParams();
  const [Issue, setIssue] = useState([]);
  const [error, seterror] = useState({});
  const [values, setvalues] = useState({solution:""});

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
  }

  const SingleIssue = async (id) =>{
    await  axiosInstance.get(`${process.env.REACT_APP_URL}/api/counterUser/ViewIssue/+${id}`)
    .then(function (response) {
      setIssue(response.data)
    })
  }

  const Done = async (id,status) =>{
    if(!values.solution){
      return seterror({...error,solution:true})
    }else{
      let url
      if(status===true){
         url=`${process.env.REACT_APP_URL}/api/counterUser/Issue/done/Callnext/+${id}`;
      }else{
         url=`${process.env.REACT_APP_URL}/api/counterUser/Issue/done/+${id}`;
      }
  
      await axiosInstance.put(`${url}`,{solution:values.solution})
      .then((response) => {
        if(response.status === 200){
          navigate("/home")
        } 
      })
    }
  }
  
  useEffect(()=>{
  if(id) SingleIssue(id)
  },[id])

  useEffect(() => {
    if(!localStorage.getItem('counterjwt')) navigate('/')
  },[]);
  return (
    <div>
      <div className="container h-50 w-75 border border-dark d-flex flex-column">
        <div className="d-flex flex-row">
              <div className="rounded-circle border text-danger border-dark p-2 token mt-3">
                {Issue.token}
              </div>
              <div className='d-flex flex-column ml-3 mt-3'>
                  <small>{Issue.name}</small>
                  <small className="text-primary">{Issue.phoneNo}</small>
              </div>
        </div>
        <div className="mt-3 ml-5">
          <h5>Issue</h5>
          <p>
          {Issue.issue}
         </p>
        </div> 
        <div className="mt-5 solution">
        <Form.Group className="mb-5" controlId="formBasicissue">
            <Form.Control as="textarea" size="lg" name="solution" rows="2"  placeholder="solution"  onChange={onChange}/>
            {error.solution &&<Form.Text  className="validationText">solution cannot be empty</Form.Text>} 
          </Form.Group>
        </div>
        <div className="btn d-flex flex-row-reverse">
          <Button variant="info"  className="ml-5" onClick={()=>Done(Issue.id,true)}>Done & Call Next</Button>
           <Button variant="success"  className="ml-5" onClick={()=>Done(Issue.id,false)}>Done</Button>
        </div>
      </div>
      
    </div>
  )
}
