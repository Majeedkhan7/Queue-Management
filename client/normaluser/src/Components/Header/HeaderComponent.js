import React from 'react'
import './Header.scss'
import {FaBell,FaArrowAltCircleRight,FaRegHandPointRight } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import Badge from 'react-bootstrap/Badge'
import {useNavigate} from 'react-router-dom'
import { VscAccount } from "react-icons/vsc";

export function HeaderComponent(props) {
  const navigate = useNavigate();

  function menuToggle() {
    const toggleMenu = document.querySelector(".nofificationlist");
    toggleMenu.classList.toggle("active");
  }
  function menuSolution() {
    const toggleMenu = document.querySelector(".solution");
    toggleMenu.classList.toggle("active");
  }

  function proflie() {
    const toggleMenu = document.querySelector(".proflie");
    toggleMenu.classList.toggle("active");
  }


  const HandleLogout = () =>{
    localStorage.clear();
    navigate("/")  
  }

  const NotHaveNotification = () =>{
    return(
      <li>
        <p className='text-center'>Notification not available</p> 
      </li>
    )
  }

  
  return (

    <div className='d-flex flex-row-reverse mt-5 mr-5'>
        <div className='rounded-pill d-flex flex-row border'>
            <h4 className='pr-4 mt-2 ml-3'>{localStorage.getItem("normalusername")}</h4>
            <h3 className='icon pr-4' onClick={proflie}><VscAccount/></h3>
            <div className="proflie">
                <ul>
                  <li>
                   <h5 onClick={HandleLogout} className="Logoutbtn"><FaArrowAltCircleRight/> Logout</h5>
                  </li>
                </ul>
            </div>
        </div>
        <div className='d-flex'  onClick={props.resetNotification}>
        <h3 className='icon' onClick={menuToggle}><FaBell /></h3>
        <Badge pill bg="danger" className='badge'>{props.NoNotification}</Badge>
        </div>
        <div className='d-flex'  onClick={props.resetSolution}>
        <h2 className='icon' onClick={menuSolution}><MdEmail/></h2>
        <Badge pill bg="danger" className='badge2'>{props.NoSolution}</Badge>
        </div>
        <div className="nofificationlist" id='scrollbar'>
        <ul>
           {props.NotificationText.length > 0?props.NotificationText.map((item,index)=>{return(<li key={index}><p><FaRegHandPointRight/> {item.notification}.</p> </li>)}):NotHaveNotification()} 
        </ul>
      </div>
      <div className="solution" id='scrollbar'>
        <ul>
           {props.SolutionText.length > 0?props.SolutionText.map((item,index)=>{return(<li key={index}><p><FaRegHandPointRight/> {item.solution}.</p> </li>)}):NotHaveNotification()} 
        </ul>
      </div>
    </div>
  )
}

