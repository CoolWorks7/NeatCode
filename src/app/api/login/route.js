import { connectionStr } from "@/app/lib/db";
import { userSchema } from "@/app/lib/userModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(req) {
    const payload = await req.json()
    await mongoose.connect(connectionStr)
    let existing = await userSchema.findOne({email: payload.email, password: payload.password})

    let emailExists = await userSchema.findOne({email: payload.email})

    if (emailExists && !existing) return NextResponse.json({message: 'Password might be incorrect!', success: false})
    else if (!emailExists && !existing) return NextResponse.json({message: 'No such user found!', success: false})
    else return NextResponse.json({payload: existing, message: 'Logged in successfully!', success: true})
}