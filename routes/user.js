const express = require('express');

const router = express.Router();
const {
    createUser,
    userAccessTokenGeneration,
    userSignIn,
    signOut,
} = require('../controllers/user');
const { roleCheck } = require('../middleware/roleCheck');
const{isAuth} =require('../middleware/isAuth')
const {
    validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require('../middleware/validation/user');


router.post('/register',validateUserSignUp,userValidation, createUser);
router.post('/login', roleCheck,validateUserSignIn, userValidation, userSignIn);
router.get('/token',isAuth,userAccessTokenGeneration);
router.delete('/logout',isAuth,signOut)

module.exports = router;