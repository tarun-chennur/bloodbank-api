const User = require('../model/user');
const Hospital=require('../model/hospitalBlood')
const Receiver=require('../model/requestedBlood')
const hosp=new Hospital();
const JWT_SECRET=process.env.JWT_SECRET

exports.addBloodTypes=async(req,res)=>{
    const{bloodavailable}=req.body
    let hospitalnametemp=await User.findOne({'_id':req.user.id},'hospitalname')
    let hospitalname=hospitalnametemp.hospitalname
    if(!bloodavailable){
        return res.json({message:'error',error:'Send bloodtype / amount in an array'})
    }
    if(hospitalname){
        try{
        hosp.bloodavailable=bloodavailable
        await hosp.validate()   //Validate the payload
            }
            catch(error){
                if (error.name === "ValidationError") {
                    const message = Object.values(error.errors)
                    .map(value => value.message)
                    return res.status(400).json({status:'error',
                        error: message
                    })
                }
            }
        for(var element of bloodavailable){
                if(!await Hospital.findOne({'hospitalname':hospitalname,'bloodavailable.bloodtype':element.bloodtype})){
                    await Hospital.findOneAndUpdate({'hospitalname':hospitalname}, 
                    {$push:{'bloodavailable':element}}
                    , {upsert:true})
                }
                else{
                  await Hospital.findOneAndUpdate({'hospitalname':hospitalname,
                  'bloodavailable.bloodtype':element.bloodtype},
                    {$inc : {'bloodavailable.$.amount' : element.amount}})
        }
    }
return res.status(200).json({message:'Successfully modified data'})
}
    else{
        return res.json({message:'unauthorized access'})
    }
}
exports.updateBloodTypes=async(req,res)=>{
    const{updateblood}=req.body
    let hospitalnametemp=await User.findOne({'_id':req.user.id},'hospitalname')
    let hospitalname=hospitalnametemp.hospitalname
    if(!updateblood){
        return res.json({message:'error',error:'Send bloodtype / amount to be updated in an array'})
    }
    if(hospitalname){
        try{
            hosp.bloodavailable=updateblood
            await hosp.validate()
                }
                catch(error){
                    if (error.name === "ValidationError") {
                        const message = Object.values(error.errors)
                        .map(value => value.message)
                        return res.status(400).json({status:'error',
                            error: message
                        })
                    }
                }
                for(element of updateblood){
                    if(await Hospital.findOne({'hospitalname':hospitalname,'bloodavailable.bloodtype':element.bloodtype})){
                    await Hospital.findOneAndUpdate({'hospitalname':hospitalname,
                    'bloodavailable.bloodtype':element.bloodtype},
                     {$set:{'bloodavailable.$':element}}
                    , {upsert:true})
                    }
                    else{
                        await Hospital.findOneAndUpdate({'hospitalname':hospitalname},
                         {$push:{'bloodavailable':element}}
                        , {upsert:true})
                    }
                }
                return res.status(200).json({message:'Successfully modified data'})
    }else{
        return res.json({message:'unauthorized access'})
    }
}

exports.bloodRequested=async(req,res)=>{
    var hospname=await User.findById(req.user.id)
    var hospitalname=hospname.hospitalname
    
    let allReceiverRequests = await Receiver.aggregate([
        {
          '$match': {
            'hospitalname': hospitalname
          }
        }, {
          '$project': {
            'receivername': '$receivername', 
            'bloodrequired': '$bloodrequired'
          }
        }, {
          '$project': {
            '_id': 0, 
            'name_of_receiver': '$receivername', 
            'bloodrequired': '$bloodrequired'
          }
        }
      ]);

      if(!allReceiverRequests){
        return res.json({status:'error',error:'There are no blood samples requested currently.'})
      }
      return res.json({status:'success',allReceiverRequests})
}

exports.bloodUploaded=async(req,res)=>{
    var hospname=await User.findById(req.user.id)
    var hospitalname=hospname.hospitalname
    let allBloodSamplesUploaded = await Hospital.aggregate([
        {
          '$match': {
            'hospitalname': hospitalname
          }
        }, {
          '$project': {
            '_id': 0, 
            'blood_samples_uploaded': '$bloodavailable'
          }
        }
      ]);
if(!allBloodSamplesUploaded){
    return res.json({status:'error',error:'There are no blood samples uploaded currently.'})
}
else{
    return res.json({status:'success',allBloodSamplesUploaded})

}
}

exports.removeBloodType=async(req,res)=>{
const bloodTypeToBeRemoved=req.params.bloodtype
var hospname=await User.findById(req.user.id)
var hospitalname=hospname.hospitalname
if(!await Hospital.findOne({'hospitalname':hospitalname,'bloodavailable.bloodtype':bloodTypeToBeRemoved})){
    return res.json({status:'error',error:'This blood type/hospital is currently not present in DB.'})

}else{
    await Hospital.findOneAndUpdate({'hospitalname':hospitalname},{$pull:{'bloodavailable':{'bloodtype':bloodTypeToBeRemoved}}})
    return res.json({status:'success',message:'Bloodtype successfully removed'})

}

}