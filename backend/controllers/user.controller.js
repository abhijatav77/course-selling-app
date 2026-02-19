import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import {date, z} from 'zod'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
dotenv.config();


export const register = async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;

        const userSchema = z.object({
            firstName: z.string().min(3,"firstName must be atleast 3 char log"),
            lastName: z.string().min(3,"lastName must be atleast 3 char log"),
            emailId: z.string().email(),
            password: z.string().min(8,"Password must be atleast 8 char log")
        })

        const validatedData = userSchema.safeParse(req.body)
        if(!validatedData.success){
            return res.status(400).json({errors: validatedData.error.issues.map(err => err.message)})
        }

        if (!firstName || !lastName || !emailId || !password) {
            return res.status(400).json({ errors: 'All fields are required' })
        }
        const user = await User.findOne({ emailId })
        if (user) {
            return res.status(400).json({ errors: 'User already exist' })
        }

        const hashPass = await bcryptjs.hash(password, 10)
        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password: hashPass
        })
        await newUser.save();
        
        res.status(200).json({ message: "User registered successfully", newUser })
    } catch (error) {
        console.log("Error in user registration");
        res.status(500).json({ errors: "Error in user registration" })
    }
}

export const login = async (req, res) => {
    try {
        const {emailId, password} = req.body;
        if(!emailId || !password){
            return res.status(400).json({
                errors:'All fields are required'
            })
        }

        const user = await User.findOne({emailId})
        if(!user){
            return res.status(400).json({
                errors:'Invalid credentials'
            })
        }
        const isMatch = await bcryptjs.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                errors:"Invalid credentials"
            })
        }

        const token = jwt.sign({id:user._id}, config.JWT_USER_PASSWORD, {expiresIn: '1d'});

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            sameSite: "None"
        }
        res.cookie("token", token, cookieOptions)
         
        res.status(200).json({
            message:'Login successfully',
            user,
            token
        })
    } catch (error) {
        console.log('Login Error', error)
        return res.status(500).json({
            errors:'Error in login user'
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {httpOnly: true, expires: new Date(0)})
        // if(!req.cookies.token){
        //     return res.status(400).json({errors: 'Kindly login first'})
        // }
        // res.clearCookie('token')
        res.status(200).json({
            message: 'Logged out successfully'
        })
    } catch (error) {
        return res.status(500).json({
            errors: 'Logout error'
        })
    }
}

export const purchases = async(req, res) => {
    const userId = req.userId;
    try {
        const purchased = await Purchase.find({userId})

        let purchasedCourseId = [];

        for(let i = 0; i<purchased.length; i++){
            purchasedCourseId.push(purchased[i].courseId)
        }
        const courseData = await Course.find({
            _id: {$in: purchasedCourseId},
        })

        res.status(200).json({purchased, courseData})
    } catch (error) {
        console.log("Error in purchase", error)
        res.status(500).json({errors:'Error in purchase'})
    }
}