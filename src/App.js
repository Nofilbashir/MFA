import React from 'react'
import Home from './pages/Home/Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
const App = () => {
  return (
    <div><Home />
       <ToastContainer />
    </div>
  )
}

export default App