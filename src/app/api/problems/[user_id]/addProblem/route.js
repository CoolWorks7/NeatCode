import { connectionStr } from "@/app/lib/db";
import { problemSchema } from "@/app/lib/problemModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(req, content) {
    try {
        const id = content.params.user_id
        let payload = await req.json()
        await mongoose.connect(connectionStr)

        let timestamp = Date.now()
        const newProblem = new problemSchema({...payload, user_id: id, created_at: timestamp, last_updated: timestamp})
        const result = await newProblem.save()

        return NextResponse.json({result, success: true})
    } catch (error) {
        return NextResponse.json({error, success: false})
    }
}