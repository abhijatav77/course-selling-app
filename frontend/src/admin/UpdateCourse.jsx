import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom'

const UpdateCourse = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState("")

  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/course/${id}`, {
          withCredentials: true
        })
        console.log(response.data)
        setTitle(response?.data?.course?.title)
        setDescription(response?.data?.course?.description)
        setPrice(response?.data?.course?.price)
        setImagePreview(response?.data?.course?.image?.url)
        setLoading(false)
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch course data")
        setLoading(false)
      }
    }
    fetchCourseData()
  }, [id])

  const changePhotoHandler = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImagePreview(reader.result)
      setImage(file)
    }
  }

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("price", price)
    if (image) { formData.append("image", image) }

    const admin = JSON.parse(localStorage.getItem("admin"))
    const token = admin?.token

    if (!token) {
      toast.error("Please login and access the admin dashboard")
      navigate("/admin/login")
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/v1/course/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      console.log(response.data)
      toast.success(response?.data?.message || "Course Updated successfully")
      navigate('/admin/our-courses')
      setTitle("")
      setDescription("")
      setPrice("")
      setImage("")
      setImagePreview("")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.errors)
    }
  }

  return (
    <div>
      <div className='min-h-screen py-10'>
        <div className='max-w-xl mx-auto p-6 border rounded-lg shadow-lg'>
          <h3 className='text-2xl font-semibold mb-6'>Update Course</h3>

          <form onSubmit={handleUpdateCourse} className='space-y-2'>
            <div className='space-y-0.5'>
              <label className='block text-lg'>Title</label>
              <input
                type="text"
                placeholder='Enter your course title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none'
              />
            </div>
            <div className='space-y-0.5'>
              <label className='block text-lg'>Description</label>
              <input
                type="text"
                placeholder='Enter your course description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none'
              />
            </div>
            <div className='space-y-0.5'>
              <label className='block text-lg'>Price</label>
              <input
                type="number"
                placeholder='Enter your course price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none'
              />
            </div>
            <div className='space-y-0.5'>
              <label className='block text-lg'>Course Image</label>
              <div>
                <img
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt="Image"
                  className='w-full max-w-sm h-auto rounded-md object-cover'
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandler}
                className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none'
              />
            </div>
            <button
              type='submit'
              className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200'
            >
              Update Course
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateCourse