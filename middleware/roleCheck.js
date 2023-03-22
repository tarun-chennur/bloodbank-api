exports.roleCheck = async (req, res, next) => {
    const role=req.body.role
    if(role=='hospital'&& !req.body.hospitalname){
        return res.json({status:'error',error:'Hospital name must be specified'})
    }
    next();
};
