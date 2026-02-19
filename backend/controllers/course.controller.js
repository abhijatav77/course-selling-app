import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";

export const createCourse = async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price } = req.body;
    try {
        if (!title || !description || !price) {
            return res.status(400).json({
                success: false,
                errors: `All fields are required`
            })
        }

        const { image } = req.files
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                errors: 'No file upload'
            })
        }

        const allowedFormat = ['image/png', 'image/jpeg', 'image/avif']
        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({
                success: false,
                errors: 'Invalid file formate. Only JPG and PNG are allowed'
            })
        }


        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({
                success: false,
                errors: 'Error uploading file to cloudinary'
            })
        }

        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.url
            },
            creatorId: adminId
        }
        const course = await Course.create(courseData);
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            course,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            errors: "Error creating course"
        })
    }

}

export const updateCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price, image } = req.body;
    try {
        const courseSearch = await Course.findById(courseId)
        if (!courseSearch) {
            return res.status(400).json({ errors: 'Course not found' })
        }
        const course = await Course.findOneAndUpdate({
            _id: courseId,
            creatorId: adminId
        }, {
            title,
            description,
            price,
            image: {
                public_id: image?.public_id,
                url: image?.url,
            }
        })
        if(!course){
            return res.status(400).json({errors: "can't be update, created by other admin"})
        }
        res.status(200).json({ message: 'Course updated successfully', course })
    } catch (error) {
        res.status(500).json({ errors: 'Error in course updating' })
        console.log("Error in course updating", error)
    }
}

export const deleteCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    try {
        const course = await Course.findOneAndDelete({
            _id: courseId,
            creatorId: adminId,
        })
        if (!course) {
            return res.status(400).json({ errors: "can't be delete, created by other admin" })
        }
        res.status(200).json({ message: 'Course deleted successfully' })
    } catch (error) {
        res.status(500).json({ errors: 'Error in course deleting' })
        console.log('Error in course deletng', error)
    }
}

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({})
        res.status(201).json({ courses })
    } catch (error) {
        res.status(500).json({ errors: 'Error to getting courses' })
        console.log("Error to get courses", error)
    }
}

export const courseDetails = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(400).json({ errors: 'Course not found' })
        }
        res.status(200).json({ course })
    } catch (error) {
        console.log("Error in course details", error);
        res.status(500).json({ errors: "Error in getting course details" })
    }
}


import Stripe from 'stripe'
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY)
console.log(config.STRIPE_SECRET_KEY)


export const buyCourses = async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;

  try {
    console.log("Buy course API hit");
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ error: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({
        error: "User already purchased this course",
      });
    }

    // 🔥 IMPORTANT: convert to cents
    const amount = course.price
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({
        message: "Course purchase successfully",
        course,
        clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.log("Error in buyCourses:", error);
    return res.status(500).json({ error: "Server error" });
  }
}; 
