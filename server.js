const express=require('express')
const bodyparser=require('body-parser')
const mongoose=require('mongoose')
const ejs=require('ejs')
const dbConfig=require('./config/db.config')
const serverConfig=require('./config/server.config')
const app=express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));
//database setup
mongoose.connect(dbConfig.DB_URL).then(()=>{
    console.log("database connected successfully")
}).catch((error)=>{
    console.log(error.message)
})
//use body parser


//setup view engine
app.set('view engine','ejs')

//showing dashboard page
// app.get('/',(req,res)=>{
//     res.render('calendar')
// })
//showing login page
app.get("/login", function (req, res) {
    res.render("pages-login");
});


//showing register page
app.get('/',(req,res)=>{
    res.render('pages-register')
})

//showing recover password
app.get('/forgetpassword',(req,res)=>{
    res.render('pages-recoverpw')
})

//display error page
app.get('/*',(req,res)=>{
    res.render('pages-404')
})
app.get('/dashboard',(req,res)=>{
    res.render('calendar')
})
require('./routes/auth.routes')(app)

app.listen(serverConfig.PORT,()=>{
    console.log("Server is listen on port",serverConfig.PORT)
})