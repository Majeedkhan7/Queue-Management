import React,{useEffect,useState,useCallback} from 'react'
import './Queue.scss'
import {Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios/axios'
import { toast } from 'react-toastify';
import { TabTitle } from '../Title/title';
import { socket } from '../../App';



export default function QueueComponent(props) {
  const navigate = useNavigate()
  const [Current, setCurrent] = useState(0);
  const [Next, setNext] = useState(null);
  const [token, settoken] = useState(0);
  const [isuueid, setisuueid] = useState(0);
  TabTitle("Queue")
  useEffect(()=>{
    AthenticateIssue();
    counterDetails()
  },[])

  useEffect(() => {
    if(!localStorage.getItem('normaluserjwt')) {
      navigate('/')
    }
    socket.on("reference_counter",(response) => {
      AthenticateIssue();
      if(response){
        setCurrent(response.current)
        setNext(response.next)
      }
    })
    socket.on("notification",()=>{
      props.increaseNotification()
    })
    socket.on("solution",()=>{
      props.increaseSolution()
    })
    socket.on("cancel_counter",(response)=>{
      if(response){
        setNext(response.next)
      }
    })
  },[socket]);

  //Athenticate Issue Function
  const AthenticateIssue = async () =>{
  await  axiosInstance.get(`${process.env.REACT_APP_URL}/api/normaluser/IssueCheck`)
    .then(function (response) {
        if(response.data === false){
          return navigate("/addissue")
        }else{
          props.getNotification()
          props.getSolution()
        }
    })
  }

  //get Counter Details Function
  const counterDetails = async () => {
    await axiosInstance.get(`${process.env.REACT_APP_URL}/api/normaluser/details`)
      .then(function (response) {
        setCurrent(response.data.current)
        setNext(response.data.next)
        setisuueid(response.data.issueid)
        settoken(response.data.token)
      })
    }


  //CancelIsuue Function
  const CancelIsuue = async (id) =>{
   await axiosInstance.delete(`${process.env.REACT_APP_URL}/api/normaluser/issue/cancel/${id}`)
      .then(function (response) {
        toast.success(`cancellation successful`)
        navigate('/addissue')
      })
  }
  

  return (
      Current !== token ? <div>
      <h2 className='ml-5'>Ongoing Queue</h2>
      <div className='content d-flex flex-column justify-content-center border pt-4 pr-5 pl-5 pb-3 shadow-sm '>
        <h3>Current No</h3>
        <h1 className="currentno">{Current}</h1>
      </div>
      <div className="upcomming d-flex flex-column">
          <h4>Next {Next == null?"END":Next}</h4> 
          <h4>My No {token}</h4>
      </div>
      <Button variant="danger" type="submit" className="cancelbtn" onClick={()=>CancelIsuue(isuueid)} >Cancel</Button> 
  </div>  :   <div>
      <h1 className='text-danger display-1 next'>
        Your Next
      </h1>
    </div>
)}
