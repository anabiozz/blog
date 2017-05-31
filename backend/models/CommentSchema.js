import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: false,
        default: new Date()
    }
});

export default CommentSchema;
