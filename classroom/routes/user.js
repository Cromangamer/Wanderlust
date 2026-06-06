const express = require('express');
const router = express.Router();


// user routes
// get 
router.get('', (req, res) => {
  res.send('User list will be here.');
});

// show 
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User details for user with ID: ${userId}`);
});

// post 
router.post('', (req, res) => {
    res.send('User created successfully.');
});

// delete 
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User with ID: ${userId} deleted successfully.`);
});

// put 
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User with ID: ${userId} updated successfully.`);
});



module.exports = router;