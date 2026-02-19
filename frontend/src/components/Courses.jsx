
import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.webp'
import { Link, useNavigate } from 'react-router-dom'
import { FaDiscourse, FaDownload, FaUserCircle } from "react-icons/fa";
import { IoMdLogIn, IoMdLogOut, IoMdSettings } from "react-icons/io";
import { FiSearch } from 'react-icons/fi'
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import axios from 'axios'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { toast } from 'react-hot-toast';
// import 'material-icons/iconfont/material-icons.css';
import { RiHome2Fill } from 'react-icons/ri'
import { BACKEND_URL } from '../utils/utils';


const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    console.log("Course", courses)
    //token
    useEffect(() => {
        const token = localStorage.getItem("user");
        if (token) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [])

    //logout
    const handleLogout = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/user/logout`, {
                withCredentials: true
            })
            toast.success(response.data.message)
            localStorage.removeItem("user");
            setIsLoggedIn(false)
            navigate('/')
        } catch (error) {
            console.log("Error in logging out ", error)
            toast.error(error.response.data.errors || "Error in logging out")
        }
    }

    //fetch course
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/course/courses`, { withCredentials: true })
                console.log(response?.data?.courses)
                setCourses(response?.data?.courses)
                setLoading(false)
            } catch (error) {
                console.log("Error in fetchCourses ", error)
            }
        }
        fetchCourses();
    }, [])

    return <div className='flex'>
        {/* Sidebar */}
        <aside className='w-64 bg-gray-100 h-screen p-5 fixed'>
            <div className='flex items-center mb-10'>
                <img src={logo} alt="Profile" className='rounded-full h-12 w-12' />
            </div>
            <nav>
                <ul>
                    <li className='mb-4'>
                        <a href="/" className='flex items-center'>
                            <span className='material-icons mr-2'>
                                <RiHome2Fill />
                            </span>{" "}
                            Home
                        </a>
                    </li>
                    <li className='mb-4'>
                        <a href="/" className='flex items-center text-blue-500'>
                            <span className='material-icons mr-2'>
                                <FaDiscourse />
                            </span>{" "}
                            Course
                        </a>
                    </li>
                    <li className='mb-4'>
                        <a href="/purchases" className='flex items-center'>
                            <span className='material-icons mr-2'>
                                <FaDownload />
                            </span>{" "}
                            Purchases
                        </a>
                    </li>
                    <li className='mb-4'>
                        <a href="/" className='flex items-center'>
                            <span className='material-icons mr-2'>
                                <IoMdSettings />
                            </span>{" "}
                            Setting
                        </a>
                    </li>
                    <li className='mb-4'>
                        {isLoggedIn ? (
                            <button className='flex items-center' onClick={handleLogout}>
                                <span className='material-icons mr-2'>
                                    <IoMdLogOut />
                                </span>{" "}
                                Logout
                            </button>
                        ) : (
                            <a href="/login" className='flex items-center'>
                                <span className='material-icons mr-2'>
                                    <IoMdLogIn />
                                </span>{" "}
                                Login
                            </a>
                        )}
                    </li>
                </ul>
            </nav>
        </aside>

        {/* Main Content */}

        <main className='ml-[20%] w-[80%] bg-white p-10'>
            <header className='flex justify-between items-center mb-10'>
                <h1 className='text-xl font-bold'>Courses</h1>
                <div className='flex items-center space-x-3'>
                    <div className='flex items-center'>
                        <input
                            type="text"
                            placeholder='Type here to search...'
                            className='border border-gray-300 rounded-l-full px-4 py-2 h-10 focus:outline-none'
                        />
                        <button className='h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center'>
                            <FiSearch className='text-xl text-gray-600' />
                        </button>
                    </div>
                    <FaUserCircle className='text-4xl text-blue-600' />
                </div>
            </header>

            {/* Vertically scrollable course section */}
            <div className='overflow-y-auto h-[75vh]'>
                {loading ? (
                    <p className='text-center text-gray-500'>Loading...</p>
                ) : courses.length === 0 ? (
                    <p>No courses posted yet by admin</p>
                ) : (
                    <div className="flex flex-wrap gap-6">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className="w-65 border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition duration-300 bg-white"
                            >
                                <img
                                    src={course.image?.url}
                                    alt={course.title}
                                    className="h-32 w-full object-cover rounded-md mb-3"
                                />

                                <h2 className="font-semibold text-md mb-2 line-clamp-1">
                                    {course.title}
                                </h2>

                                <p className="text-gray-600 text-sm mb-3">
                                    {course.description?.length > 60
                                        ? `${course.description.slice(0, 60)}...`
                                        : course.description}
                                </p>

                                <div className="flex justify-between mb-3">
                                    <span className="font-bold text-lg text-black">
                                        ${course.price} 
                                    <span className='text-sm text-gray-500 line-through'>5999</span>
                                    </span>
                                    <span className="text-green-600 text-sm">20% off</span>
                                </div>

                                <Link
                                    to={`/buy/${course._id}`}
                                    className="block text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-blue-900 duration-300"
                                >
                                    Buy Now
                                </Link>
                            </div>
                        ))}
                    </div>

                )}
            </div>
        </main>
    </div>
}

export default Courses