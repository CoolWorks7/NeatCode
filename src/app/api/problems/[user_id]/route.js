import { connectionStr } from "@/app/lib/db";
import { problemSchema } from "@/app/lib/problemModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET(req, content) {
    try {
        const id = content.params.user_id
        await mongoose.connect(connectionStr)
        let problems = await problemSchema.find({user_id: id})
        
        return NextResponse.json({problems, success: true})
    } catch (error) {
        return NextResponse.json({error, success: false})
    }
}