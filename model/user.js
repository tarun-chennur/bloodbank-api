const mongoose=require('mongoose')
const userSchema =new mongoose.Schema({

    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    receivername:{type:String},
    role:{type:String,required:true,enum: {values:['receiver', 'hospital'],message:"Role must be hospital or receiver"}},
    refreshtoken:[{type:Object}],
    hospitalname:{type:String}

},{collection:'users'})

const model=mongoose.model('UserSchema',userSchema)
module.exports=model