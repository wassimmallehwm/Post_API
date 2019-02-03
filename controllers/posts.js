const Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title : req.body.title,
        content : req.body.content,
        imagePath : url + '/img/' + req.file.filename,
        creator : req.userData.userId
    });
    post.save().then((result) => {
        res.status(201).json({
            post : {
                _id : result._id,
                title : result.title,
                content : result.content,
                imagePath : result.imagePath
            }
        });
        
    })
    .catch(error => {
        res.status(500).json({
            message: 'Post creation failed !'
        })
    });
}


exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
        postQuery.skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    postQuery.find().then((posts) => {
        fetchedPosts = posts;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            posts: fetchedPosts,
            nbPosts: count
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Fetching posts failed!'
        })
    });
}



exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/img/" + req.file.filename
      }
    const post = new Post({
        _id: req.body._id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator : req.userData.userId
    });
    Post.findOneAndUpdate({_id : req.params.id, creator: req.userData.userId}, post)
    .then((result)=>{
        if(result) {
            res.status(200).json({message : 'post updated !'});
        } else {
            res.status(401).json({message : 'Not authorized !'});
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't update post !"
        })
    });
}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    }).catch(error => {
        res.status(500).json({
            message: 'Fetching post failed!'
        })
    });
}

exports.deletePost = (req, res, next) => {
    Post.findOneAndDelete({_id : req.params.id, creator: req.userData.userId})
    .then((result)=>{
        if(result) {
            res.status(200).json({message : 'post deleted !'});
        } else {
            res.status(401).json({message : 'Not authorized !'});
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Deleting post failed!'
        })
    });
}

