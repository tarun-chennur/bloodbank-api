const mongoose=require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const bloodSchema=new mongoose.Schema({
    bloodtype:{type:String,requiured:true,enum:{values:['A','B','AB','O'],message:"Incorrect blood type. Possible types are: A, B, AB and O"}},
    amount:{type: Number,
        required : true,
        min: [1, 'BLood must be atleast 1 '],
        max: [10000,'Blood cannot be greater than 10000'],
        validate : {
          validator : Number.isInteger,
          message   : '{VALUE} is not an integer value'
        }}
    })
const requestedBloodSchema =new mongoose.Schema({
    receivername:{type:String},
    bloodrequired:[bloodSchema],
    hospitalname:{type:String}
},{collection:'requestedbloodinventory'})
requestedBloodSchema.plugin(uniqueValidator)
const model=mongoose.model('RequestedBloodSchema',requestedBloodSchema)
module.exports=model