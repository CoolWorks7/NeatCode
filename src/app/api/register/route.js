import { connectionStr } from "@/app/lib/db";
import { userSchema } from "@/app/lib/userModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(req) {
    const payload = await req.json()
    await mongoose.connect(connectionStr)

    // checking if an user already exists
    const existing = await userSchema.findOne({email: payload.email})
    if (existing) return NextResponse.json({message: "The Email is already being used!", success: false})
    
    // creating a new user
    const newUser = new userSchema(payload)
    const result = await newUser.save()

    if (result) return NextResponse.json({payload: result, message: 'Registered & Logged in successfully!', success: true})
    else return NextResponse.json({message: 'An Error Occured!', success: false})
}