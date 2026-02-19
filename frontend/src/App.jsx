import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import {Toaster} from 'react-hot-toast'
import Courses from './components/Courses.jsx'
import Buy from './components/Buy.jsx'
import Purchases from './components/Purchases.jsx'
import 'material-icons/iconfont/material-icons.css';
import AdminRegister from './admin/AdminRegister.jsx'
import AdminLogin from './admin/AdminLogin.jsx'
import Dashboard from './admin/Dashboard.jsx'
import CourseCreation from './admin/CourseCreation.jsx'
import UpdateCourse from './admin/UpdateCourse.jsx'
import OurCourse from './admin/OurCourse.jsx'
const App = () => {

  const user = localStorage.getItem("user")
  const admin = localStorage.getItem("admin")

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Other Routes */}
        <Route path='/courses' element={<Courses />} />
        <Route path='/buy/:courseId' element={<Buy />} />
        <Route 
          path='/purchases' 
          element={user ? <Purchases /> : <Navigate to={'/login'}/>}
        />
        
        {/* Admin Routes */}
        <Route path='/admin/register' element={<AdminRegister />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route 
          path='/admin/dashboard'
          element={admin ? <Dashboard /> : <Navigate to={'/admin/login'}/>} 
        />
        <Route path='/admin/course-creation' element={<CourseCreation />} />
        <Route path='/admin/update-course/:id' element={<UpdateCourse />} />
        <Route path='/admin/our-courses' element={<OurCourse />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App