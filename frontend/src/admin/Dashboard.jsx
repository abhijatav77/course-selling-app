import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import logo from '../assets/logo.webp'

const Dashboard = () => {

    const handleLogout = () => {
        localStorage.removeItem("admin");
        navigate("/admin/login");
    };


    return (
        <div className='flex h-screen'>
            <div className='w-64 bg-gray-100 p-5'>
                <div className='flex items-center flex-col mb-10'>
                    <img src={logo} alt="Profile" className='rounded-full h-20 w-20' />
                    <h2 className='text-lg font-semibold mt-4'>I'm Admin</h2>
                </div>
                <nav className='flex flex-col space-y-4'>
                    <Link to='/admin/our-courses'>
                        <button className='w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded'>Our Courses</button>
                    </Link>
                    <Link to='/admin/course-creation'>
                        <button className='w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded'>Create Course</button>
                    </Link>
                    <Link to='/'>
                        <button className='w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded'>Home</button>
                    </Link>
                    <Link to='/admin/login'>
                        <button onClick={handleLogout} className='w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded'>Logout</button>
                    </Link>
                </nav>
            </div>
            <div className='flex h-screen items-center justify-center ml-[35%]'>Welcome!!</div>
        </div>
    )
}

export default Dashboard