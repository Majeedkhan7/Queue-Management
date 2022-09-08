import React,{useState,useEffect} from 'react'
import './home.scss'
import {Button} from 'react-bootstrap'
import axiosInstance from '../axios/axios'
import {useNavigate,Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import ReactPaginate from 'react-paginate'
import { TabTitle } from '../Title/title'
import { socket } from '../../App'

const HomeComponent = () => {
  const navigate = useNavigate();
  const [Issue, setIssue] = useState([]);
  const [pageNumber, setpageNumber] = useState(0);
  TabTitle("Issues")
  
  useEffect(() => {
    if(!localStorage.getItem('counterjwt')) navigate('/')
    getIssues()
  },[]);

  useEffect(() => {
    socket.on("reference_issue", () => {
      getIssues()
    });
  },[socket]);



//Get Issue Function
  const getIssues = async () =>{
    await axiosInstance.get(`${process.env.REACT_APP_URL}/api/counterUser/ViewIssues`).
    then(function (response) {
      setIssue(response.data)
    })
  }

//Call Token
  const CallToken = async (id) =>{
    await  axiosInstance.put(`${process.env.REACT_APP_URL}/api/counterUser/CallToken`,{
      id:id
    })
    .then((response) => {
      toast.success(`${response.data}`)
    })
  }


  const ReCall = async (id) =>{
    await  axiosInstance.post(`${process.env.REACT_APP_URL}/api/counterUser/Recall`,{id:id})
    .then((response) => {
      toast.success(`${response.data}`)
    })
  }

  

  //close Counter
  const CloseCounter = async () =>{
    await  axiosInstance.put(`${process.env.REACT_APP_URL}/api/counterUser/logout`,{})
    .then(function (response) {
      if(response.status === 200){
        localStorage.clear()
        navigate("/")
      }
    })
  }
   
  
  const issuePerPage = 5
  const pagesVisited = pageNumber * issuePerPage
  const pageCount = Math.ceil(Issue.length /issuePerPage);
  const changePage = ({ selected }) => {
    setpageNumber(selected)
  };

  const PaginationsLink = () =>{
    return(
      <div className="Parginate mt-4">
        <ReactPaginate 
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"} 
        pageLinkClassName={"no"}
        />
      </div>
    )

  }
  return (
    <div>
      <Button variant="danger" className="closeCounterbtn" onClick={()=>CloseCounter(localStorage.getItem('countername'))}>Closer Counter</Button>
      {Issue.slice(pagesVisited, pagesVisited + issuePerPage).map((item,index) => {
    return (
      <div className='d-flex mt-4 justify-content-center align-items-center' key={index}>
              <div className="d-flex  w-75  align-items-center border rounded-pill">
                  <div className="p-2 pr-4 pt-2 rounded-circle bg-white shadow-sm text-danger justify-content-center ">
                    <small className='token'>{item.token}</small> 
                  </div>
                  <div className="ml-3 d-flex flex-column">
                    <small>{item.name}</small>
                    <small className="text-primary">{item.phoneNo}</small>
                  </div>
                  {
                    item.status === 'ONGOING'?
                    <div className="btnCall">
                      <Link to={`/issue/${item.id}`}>
                          <Button variant="primary" size='sm' className="mr-4">View</Button>
                      </Link>
                      <Button variant="outline-success" size='sm' className="mr-3" onClick={()=>ReCall(item.id)}>ReCall</Button>
                    </div>
                    :
                    <div className="btnCall">
                    <Button variant="outline-success" size='sm' className="mr-3" onClick={()=>CallToken(item.id)}>Call</Button>
                    </div>
                  }  
              </div>
        </div>
              );
        })}
      { pageCount > 0 ? PaginationsLink(): null }  

    </div>
  )
}

export default HomeComponent;