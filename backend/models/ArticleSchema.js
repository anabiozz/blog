import mongoose, { Schema } from 'mongoose';
import CommentSchema from './CommentSchema';

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false,
        default: 'anonymous'
    }
});
// , comments: [CommentSchema]
let Article = mongoose.model('Article', ArticleSchema);

export default Article;
