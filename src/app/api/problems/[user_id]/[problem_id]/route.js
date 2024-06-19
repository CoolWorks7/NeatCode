import { connectionStr } from "@/app/lib/db";
import { problemSchema } from "@/app/lib/problemModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET(req, {params}) {
    await mongoose.connect(connectionStr)
    let result = await problemSchema.findOne({_id: params.problem_id, user_id: params.user_id})
    if (result) return NextResponse.json({result, success: true})
    else return NextResponse.json({success: false})
}

export async function PUT(req, {params}) {
    try {
        let payload = await req.json()
        let timestamp = Date.now()
        await mongoose.connect(connectionStr)
        let result = await problemSchema.findOneAndUpdate({_id: params.problem_id, user_id: params.user_id}, {...payload, last_updated: timestamp})

        if (result) return NextResponse.json({result, success: true})
        else return NextResponse.json({success: false})
    } catch (error) {
        return NextResponse.json({success: false})
    }
}

export async function DELETE(req, {params}) {
    try {
        await mongoose.connect(connectionStr)
        let result = await problemSchema.deleteOne({_id: params.problem_id, user_id: params.user_id})
        if (result) return NextResponse.json({result, success: true})
        else return NextResponse.json({success: false})
    } catch (error) {
        return NextResponse.json({success: false})
    }
}