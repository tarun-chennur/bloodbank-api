const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model/user');
const JWT_SECRET=process.env.JWT_SECRET


exports.isAuth = async (req, res, next) => {
    
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization

    try {
      const decode = jwt.verify(token,JWT_SECRET);
     
      const user = await User.findById(decode.id);

      if(!decode.type=='accesstoken'){
      const tokenCheck=await User.findOne({'refreshtoken.refreshToken':token})
      if(!tokenCheck){
        return res.json({message:'error',error:'Incorrect/Invalid token provided.Please login again'})
      }
    }
      if (!user) {
        return res.json({ message: 'error', error: 'unauthorized access!' });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.json({ message: 'error', message: 'unauthorized access!' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.json({
          message: 'error',
          error: 'sesson expired try sign in!',
        });
      }

     res.json({ message: 'error', error: 'Internal server error!' });
    }
  } else {
    res.json({ message: 'error', error: 'Please provide access token in headers under the authorization key' });
  }
};