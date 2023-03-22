const express = require('express');

const router = express.Router();
const {isAuth}=require('../middleware/isAuth')
const {addBloodTypes,updateBloodTypes,
    bloodRequested,bloodUploaded,removeBloodType}=require('../controllers/hospital')
const{getAllData,requestBlood}=require('../controllers/receiver')


router.post('/addblood',isAuth,addBloodTypes)
router.put('/updateblood',isAuth,updateBloodTypes)
router.get('/bloodrequested',isAuth,bloodRequested)
router.get('/blooduploaded',isAuth,bloodUploaded)
router.delete('/blood/:bloodtype',isAuth,removeBloodType)

router.get('/getalldata',getAllData)
router.post('/requestblood',isAuth,requestBlood)
module.exports = router;