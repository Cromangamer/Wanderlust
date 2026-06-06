const express = require('express');
const router = express.Router();




// posts routes
// get 
router.get('', (req, res) => {
  res.send('User list will be here.');
});

// show 
router.get('/:id', (req, res) => {
    const postId = req.params.id;
    res.send(`post details for user with ID: ${postId}`);
});

// post 
router.post('', (req, res) => {
    res.send('post created successfully.');
});

// delete 
router.delete('/:id', (req, res) => {
    const postId = req.params.id;
    res.send(`post with ID: ${postId} deleted successfully.`);
});

// put 
router.put('/:id', (req, res) => {
    const postId = req.params.id;
    res.send(`post with ID: ${postId} updated successfully.`);
});



module.exports = router;