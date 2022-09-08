import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {useState}from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import LoginComponent from './Components/Login/LoginComponent'
import IssueComponent from './Components/Issue/IssueComponent'
import QueueComponent from './Components/Queue/QueueComponent'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import NotFound from './Components/404/404'
import { HeaderComponent } from './Components/Header/HeaderComponent'
import axiosInstance from './Components/axios/axios'
import socketIO from 'socket.io-client'

export const socket = socketIO(process.env.REACT_APP_URL);

function App() {
const [Notification, setNotification] = useState([]);
const [NoOfNewNotification, setNoOfNewNotification] = useState(0);
const [Solution,setSolution] = useState([]);
const [NoOfSolution,setNoOfSolution] = useState(0);

const NotificationDetails = async () => {
  await axiosInstance.get(`${process.env.REACT_APP_URL}/api/normaluser/view/notifications`)
    .then(function (response) {
      setNotification(response.data)
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  const SolutionDetails = async () => {
    await axiosInstance.get(`${process.env.REACT_APP_URL}/api/normaluser/view/solution`)
      .then(function (response) {
        setSolution(response.data)
      })
      .catch(function (error) {
        console.log(error);
      })
    }  
  
  const resetNotification = ()=>{
    setNoOfNewNotification(0)
  }

  const resetSolution = ()=>{
    setNoOfSolution(0)
  }

  const increaseNotification  = ()=>{
    setNoOfNewNotification(NoOfNewNotification+1)
  } 
  const increaseSolution = ()=>{
    setNoOfSolution(NoOfSolution+1)
  } 

const WithHeader = (Page)=>{
  return(
    <>
    <HeaderComponent NotificationText={Notification} SolutionText={Solution} NoSolution={NoOfSolution}   NoNotification={NoOfNewNotification} resetNotification={resetNotification} resetSolution={resetSolution }/>
    <Page getNotification={NotificationDetails} getSolution={SolutionDetails} increaseNotification={increaseNotification} increaseSolution={increaseSolution}/>
    </>
  )
}

  return (
    <BrowserRouter>
              <ToastContainer />
        <Routes>
          <Route path='/' element={<LoginComponent/>} />
          <Route path='/addissue' element={WithHeader(IssueComponent)} />
          <Route path='/onqueue' element={WithHeader(QueueComponent)} />
          <Route path='*' element={<NotFound/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
