const  router=require('express').Router();
const cloudinary=require('../utils/cloudinary');
const upload=require('../utils/multer');
 const User=require('../Model/user');

 // To upload image to cloudinary
router.post('/', upload.single('image'),async(req,res)=>{
    try{
   const result=await cloudinary.uploader.upload(req.file.path);
   
   // create instanc of the user
   let user=new User({
       name:req.body.name,
       avatar:result.secure_url,
       cloudinary_id:result.public_id,
   });
   // save user
   await user.save();
   
   res.json(user);
    }catch(err){
        console.log(err);
    }
})

// get user
router.get('/',async(req,res)=>{
    try{
    let user=await User.find();
    res.json(user);

    }catch(err){
        console.log(err);
    }
})

// delete user and  image cloudinary
router.delete('/:id',async(req,res)=>{
    try{
        // find user by id
        let user=await User.findById(req.params.id);
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(user.cloudinary_id);
        //Delete user from db
        await user.remove();
        res.json(user);
    }catch(err){
        console.log(err.message);
    }
})

// update image and user 
router.put('/:id',upload.single('image'),async(req,res)=>{
    try{
        let user=await User.findById(req.params.id);
        await cloudinary.uploader.destroy(user.cloudinary_id);

        const result=await cloudinary.uploader.upload(req.file.path);

        const data={
            name:req.body.name || user.name,
            avatar:result.secure_url || user.avatar,
            cloudinary_id:result.public_id||user.cloudinary_id
        };
        user=await User.findByIdAndUpdate(req.params.id,data,{new:true});
        res.json(user);
    }catch(err){
        console.log(err);
    }
})

// b64 image upload
router.post(`/img`, function (req, res) {
 
    var dataURI = req.body.dataURI;
    var type=req.body.type;
    // Should check the image type
    var uploadStr = `data:image/${type};base64,` + dataURI;

    cloudinary.v2.uploader.upload(uploadStr, {
        overwrite: true,
        invalidate: true,
        width: 810, height: 456, crop: "fill"
    },
        function (error, result) {
            res.json(result);
        });
});
/**
 * router.paost('/uploadBae64', (req,res)=>{
 * let filtPath=`/files/${Date.now()}_${req.body.name}})`;
 * let buffer =Buffer.from (req.body.base64.split(',)[1],"base64");
 * // Buffer contains the image 
 * fs.writeFileSync(path.join(_dirname,filepath),buffer);
 * 
 * res.json(filepath);
 */

module.exports=router