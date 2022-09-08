import React from 'react'
import './header.scss'
import {FaArrowAltCircleRight} from 'react-icons/fa';
import { VscAccount } from "react-icons/vsc";
import {useNavigate} from 'react-router-dom'
import axiosInstance from '../axios/axios'

export const HeaderComponent = () => {

  const navigate = useNavigate();

  function proflie() {
    const toggleMenu = document.querySelector(".proflie");
    toggleMenu.classList.toggle("active");
  }

  //logout function 
  const Logout = async () =>{
    await axiosInstance.put(`${process.env.REACT_APP_URL}/api/counterUser/logout`,{})
    .then(function (response) {
      if(response.status === 200){
        localStorage.clear()
        navigate("/")
      }
    })   
} 
  return (
    <div className="d-flex mt-5 mr-5">
       <div className="p-2">
        <h4>Counter</h4>
        <h6 className="badge badge-pill badge-secondary">Counter - {localStorage.getItem("countername")}</h6>
        </div>
        <div className="ml-auto p-2 ">
          <div className='rounded-pill d-flex flex-row border'>
          <h4 className='username pr-4 mt-2 ml-3'>{localStorage.getItem("counterusername")}</h4>
            <h2 className='username pr-4' onClick={proflie}><VscAccount/></h2>
            <div className="proflie">
                <ul>
                  <li>
                   <h5 onClick={Logout}><FaArrowAltCircleRight/> Logout</h5>
                  </li>
                </ul>
            </div>
          </div>
           
        </div>
    </div>
  )
}

