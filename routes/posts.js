const express = require('express');
const postController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');
const fileStorage = require('../middleware/file-storage');
const router = express.Router();



router.post('/', 
    checkAuth, 
    fileStorage, 
    postController.createPost
);

router.get('/', postController.getPosts);

router.delete('/:id', 
    checkAuth, 
    postController.deletePost
);

router.get("/:id", postController.getPost);

router.put('/:id',
    checkAuth, 
    fileStorage, 
    postController.updatePost
 );

module.exports = router;