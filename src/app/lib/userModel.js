const { default: mongoose } = require("mongoose");


const userModel = mongoose.Schema({
    name: String,
    email: String,
    password: String
})


export const userSchema = mongoose.models.users || mongoose.model("users", userModel)