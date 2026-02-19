import bcryptjs from 'bcryptjs'
import {z} from 'zod'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import config from "../config.js";
import { Admin } from "../models/admin.model.js";
dotenv.config();


export const register = async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;

        const adminSchema = z.object({
            firstName: z.string().min(2,{message:"firstName must be atleast 6 char log"}),
            lastName: z.string().min(2,{message:"lastName must be atleast 6 char log"}),
            emailId: z.string().email(),
            password: z.string().min(8,{message:"firstName must be atleast 8 char log"})
        })

        const validatedData = adminSchema.safeParse(req.body)
        if(!validatedData.success){
            return res.status(400).json({errors: validatedData.error.issues.map(err => err.message)})
        }

        if (!firstName || !lastName || !emailId || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }
        const admin = await Admin.findOne({ emailId })
        if (admin) {
            return res.status(400).json({ errors: 'Admin already registered' })
        }

        const hashPass = await bcryptjs.hash(password, 10)
        const newAdmin = new Admin({
            firstName,
            lastName,
            emailId,
            password: hashPass
        })
        await newAdmin.save();
        
        res.status(200).json({ message: "Admin registered successfully", newAdmin })
    } catch (error) {
        console.log("Error in admin registration");
        res.status(500).json({ errors: "Error in admin registration" })
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

        const admin = await Admin.findOne({emailId})
        if(!admin){
            return res.status(400).json({
                errors:'Invalid credentials'
            })
        }
        const isMatch = await bcryptjs.compare(password, admin.password)
        if(!isMatch){
            return res.status(400).json({
                errors:"Invalid credentials"
            })
        }

        const token = jwt.sign({id:admin._id}, config.JWT_ADMIN_PASSWORD, {expiresIn: '1d'});

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            sameSite: "None"
        }
        res.cookie("token", token, cookieOptions)
         
        res.status(200).json({
            message:'Login successfully',
            admin: admin,
            token
        })
    } catch (error) {
        console.log('Login Error', error)
        return res.status(500).json({
            errors:'Error in login admin'
        })
    }
}

export const logout = async (req, res) => {
    try {
        // res.cookie("token", "", {httpOnly: true, expires: new Date(0)})
        if(!req.cookies.token){
            return res.status(400).json({errors:'Kinidly login first'})
        }
        res.clearCookie('token')
        res.status(200).json({
            message: 'Logged out successfully'
        })
    } catch (error) {
        return res.status(500).json({
            errors: 'Logout error'
        })
    }
}