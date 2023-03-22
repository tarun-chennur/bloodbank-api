const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt')
const JWT_SECRET=process.env.JWT_SECRET

exports.userAccessTokenGeneration=async (req,res)=>{

        const accToken=generateAccessToken(req.user.id)
        res.json({status:'ok',accesstoken:accToken})

    }

exports.userSignIn=async (req, res) => {
    const{username,password}=req.body
    const user=await User.findOne({username}).lean()
  
    if(!user){

        return res.json({status:'error',error:'Username/Password Invalid'})
    }
    if(await bcrypt.compare(password,user.password)){

        const accessToken=generateAccessToken(user._id)   //create access token
        const refreshToken=jwt.sign({id:user._id},  //create refresh token
          JWT_SECRET)
        let oldTokens=user.refreshtoken || []
        if(oldTokens.length){
            oldTokens=oldTokens.filter(t =>{

                const timeDiff=(Date.now()-parseInt(t.signedAt))/1000
                if(timeDiff<86400){
                    return t     //Remove tokens that are >24 hours old.
                }
            })
        }
        await User.findByIdAndUpdate(user._id
            , {  refreshtoken: [...oldTokens,{refreshToken,signedAt:Date.now().toString()}]  })

        return res.json({status:'ok',message:'Login Successful'
        ,accesstoken:accessToken,refreshtoken:refreshToken}) //add refresh token to db 

    }
    return res.json({status:'error',error:'Username/Password Invalid'})
  }


function generateAccessToken(userID){

    return jwt.sign({id:userID,type:"accesstoken"}
        ,JWT_SECRET,{expiresIn:'60m'}) //Use this to create tokens that expire.
        // return jwt.sign({id:userID,type:"accesstoken"}
        // ,JWT_SECRET)
}
exports.createUser=async (req, res) => {
    
    const{username,password:plainTextPassword,role}=req.body
    const password=await bcrypt.hash(plainTextPassword,10)
    const hospitalname=req.body.hospitalname

    try{
        if(role=='hospital'){await User.create(
            {
                username,password,role,hospitalname
            }
        )}else{
            const {receivername}=req.body
            if(receivername){
            await User.create(
                {
                    username,password,role,receivername
                }
            )
            }else{
                return res.json({error:'Must Include "receivername"'})
            }

        }
    }
    catch(error){
        console.log(JSON.stringify(error))
        if(error.code===11000){
            return res.json({status:'error',error:'Username already in use'})
        }
        if (error.name === "ValidationError") {
            
            const message = Object.values(error.errors).map(value => value.message)
            return res.status(400).json({status:'error',
                error: message
            })
        }
        res.status(400).json(error.message)
        throw error 
    }
    res.status(200).json({status:'ok',message:"User created successfully"})
  }

  exports.signOut=async(req,res)=>{
    if(req.headers && req.headers.authorization){
        const token=req.headers.authorization
        if(!token){
            return res.status(401).json({message:'error',error:'No token provided, Auth failed'})

        }
        const tokens=req.user.refreshtoken
        const newTokens=tokens.filter(t =>t.refreshToken!==token)
        await User.findByIdAndUpdate(req.user.id,{refreshtoken:newTokens})
        res.json({message:'Success, signout successful'})
    }

  }