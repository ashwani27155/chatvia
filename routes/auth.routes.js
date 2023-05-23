const userController=require('../controllers/auth.controller')
const multer=require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/user_img')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
module.exports=(app)=>{
    app.post('/api/v1/signup',upload.single('image'),userController.signup)
    app.post('/api/v1/signin',userController.signin)
    app.post('/api/v1/savechat',userController.savechat)
}