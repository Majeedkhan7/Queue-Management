import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import LoignComponent from './Component/Login/LoignComponent'
import HomeComponent from './Component/Home/HomeComponent'
import ViewIssueComponent from './Component/ViewIssue/ViewIssueComponent'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './Component/404/404'
import { HeaderComponent } from './Component/Header/HeaderComponent'
import socketIO from 'socket.io-client'

export const socket = socketIO(process.env.REACT_APP_URL);
const WithHeader = (Page)=>{
  return(
    <>
    <HeaderComponent/>
    <Page/>
    </>
  )
}
function App() {
  return (
    <BrowserRouter>
        <ToastContainer />
        <Routes>
            <Route path='/' element={<LoignComponent/>}/>
            <Route path='/home' element={WithHeader(HomeComponent)}/>
            <Route path='/issue/:id' element={WithHeader(ViewIssueComponent)}/>
            <Route path='*' element={<NotFound/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
