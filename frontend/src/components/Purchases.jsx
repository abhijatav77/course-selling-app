import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FaDiscourse, FaDownload } from 'react-icons/fa';
import { IoIosLogOut, IoMdSettings } from 'react-icons/io';
import { RiHome2Fill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../utils/utils';


const Purchases = () => {
  const [purchases, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState(true)

  const navigate = useNavigate()
  console.log("Purchases", purchases)
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
    const user = JSON.parse(localStorage.getItem("user"))
    const token = user.token
    const fetchPurchases = async () => {
      if (!token) {
        setErrorMessage("Please login to purchase course")
        return
      }
      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        })
        setPurchase(response?.data?.courseData)
      } catch (error) {
        setErrorMessage(error?.response?.data?.errors || "Failed to fetch purchase data")
      }
    };
    fetchPurchases()
  }, [])
  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      <div className='w-64 bg-gray-100 p-5'>
        <nav>
          <ul>
            <li className='mb-4'>
              <Link to='/' className='flex items-center'>
                <RiHome2Fill className='mr-2' /> Home
              </Link>
            </li>
            <li className='mb-4'>
              <Link to='/courses' className='flex items-center'>
                <FaDiscourse className='mr-2' /> Course
              </Link>
            </li>
            <li className='mb-4'>
              <Link to='#' className='flex items-center'>
                <FaDownload className='mr-2' /> Purchases
              </Link>
            </li>
            <li className='mb-4'>
              <Link to='/settings' className='flex items-center'>
                <IoMdSettings className='mr-2' /> Settings
              </Link>
            </li>
            <li className='mb-4'>
              {isLoggedIn ? (
                <button onClick={handleLogout} className='flex items-center cursor-pointer'>
                  <IoIosLogOut /> Logout
                </button>
              ) : (
                <Link to='/login' className='flex items-center cursor-pointer'>
                  <IoMdSettings className='mr-2' /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* main content */}
      <div className='flex-1 p-8 bg-gray-50 overflow-y-auto'>

        {/* Header */}
        <h2 className='text-2xl font-bold mb-6'>My Purchases</h2>

        {/* Error message */}
        {errorMessage && (
          <div className='text-red-500 mb-4'>
            {errorMessage}
          </div>
        )}

        {/* Purchase Grid */}
        {purchases.length > 0 ? (
          <div className='flex flex-wrap gap-6'>
            {purchases.map((purchase, index) => (
              <div
                key={index}
                className="w-65 aspect-square bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition duration-300 flex flex-col"
              >
                <img
                  src={purchase.image?.url || "https://placehold.co/200"}
                  alt={purchase.title}
                  className="h-28 w-full object-cover rounded-md mb-2"
                />

                <h3 className="font-semibold text-md line-clamp-1">
                  {purchase.title}
                </h3>

                <p className="flex-1 text-gray-600 text-sm flex">
                  {purchase.description?.length > 60
                    ? `${purchase.description.slice(0, 60)}...`
                    : purchase.description}
                </p>

                <span className="text-green-700 font-semibold text-sm">
                  ${purchase.price} Only
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500'>You have no purchases yet.</p>
        )}

      </div>
    </div>
  )
}

export default Purchases