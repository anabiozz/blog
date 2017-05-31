import Article from '../models/ArticleSchema';

const getAllPosts = (req, res) => {
    Article.find({}, (err, blogPosts) => {
        if(!err) {
            res.json({
                posts: blogPosts
            });
        } else {
            res.status(err.status || 500);
            res.json({
                err: err
            });
        }
    });
}

const blog = (req, res) => {
    res.json({
        message:'Hello Blog' 
    })
}

const newPost = (req, res) => {
    let article = new Article({
        title: req.body.title,
        body: req.body.body
    });
    article.save((err) => {
        if(err) {
            res.status(err.status || 500);
            res.json({
                err: err
            });
        } else {
            res.json({
                message: 'Saved'
            })
        }
    });
}

export default {
    getAllPosts,
    blog,
    newPost
}