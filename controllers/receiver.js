const User = require('../model/user');
const Receiver=require('../model/requestedBlood')
const Hospital=require('../model/hospitalBlood')
const JWT_SECRET=process.env.JWT_SECRET
const rec=new Receiver();

exports.getAllData=async(req,res)=>{
    let allBloodSampleData = await Hospital.aggregate([
        {
          $project: {
            "_id" : 0,
            name_of_hospital: "$hospitalname",
            blood_samples_available: "$bloodavailable",
          },
        },
      ]);
      if(allBloodSampleData){
    return res.status(200).json({allBloodSampleData})
      }
      return res.status(200).json({status:'error',error:'No data present'})
}
exports.requestBlood=async(req,res)=>{
    const{bloodrequired}=req.body
    var{hospitalname}=req.body
    if(!bloodrequired){
        return res.json({status:'error',error:'must include blood required as an array under "bloodrequired" key'})
    }
    let receiver=await User.findById(req.user.id,'receivername')
    let receivername=receiver.receivername
    let hospname=await User.findOne({'hospitalname':hospitalname})
    hospitalname=hospname.hospitalname
    if(!hospname){
        return res.json({status:'error',error:'Hospital either is incorrect or doesnt exist.'})
    }
    if(!receivername){
        return res.json({status:'error',error:'Receiver name not mentioned or incorrect.'})

    }
    try{
            rec.bloodrequired=bloodrequired
            await rec.validate()
            }
        
        catch(error){
            if (error.name === "ValidationError") {
                const message = Object.values(error.errors).map(value => value.message)
                return res.status(400).json({status:'error',
                    error: message
                })
            }
        }
        for(element of bloodrequired){
            if(await Receiver.findOne({'receivername':receivername,'hospitalname':hospitalname,'bloodrequired.bloodtype':element.bloodtype})){
            await Receiver.findOneAndUpdate({'receivername':receivername,
            'hospitalname':hospitalname,'bloodrequired.bloodtype':element.bloodtype},
             {$set:{'bloodrequired.$':element}}
            , {upsert:true})
            }
            else{
                await Receiver.findOneAndUpdate({'receivername':receivername,'hospitalname':hospitalname},
                 {$push:{'bloodrequired':element}}
                , {upsert:true})
            }
        }
        return res.status(200).json({message:'Successfully modified data'})

    }