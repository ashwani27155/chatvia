const userController=require('../controllers/auth.controller')
module.exports=(app)=>{
    app.post('/api/v1/auth/signup',userController.signup)
    app.post('/api/v1/auth/signin',userController.signin)
}