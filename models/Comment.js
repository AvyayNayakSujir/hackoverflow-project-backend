
const mongoose = require("mongoose");
const {Schema} = mongoose;

const commentSchema = new Schema({
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    likes:{
        type:Number,
        default:0
    },
    likedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User', // Assuming your user model is named 'User'
        },
    ],
    commentedBy:{
        type:String,
        default:"annonymous"
    },
    commentedAt:{
        type:Date,
        default:Date.now()
    }
    
    });

 
  module.exports = mongoose.model.Comment||  mongoose.model("Comment", commentSchema);
