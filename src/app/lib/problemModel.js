const { default: mongoose } = require("mongoose");

const problemModel = mongoose.Schema({
    title: String,
    link: String,
    description: String,
    level: String,
    platform: String,
    tags: Array,
    files: Array,
    user_id: mongoose.Schema.Types.ObjectId,
    created_at: Number,
    last_updated: Number
})


export const problemSchema = mongoose.models.problems || mongoose.model('problems', problemModel)