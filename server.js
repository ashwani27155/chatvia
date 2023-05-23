const express=require('express')
const bodyparser=require('body-parser')
const mongoose=require('mongoose')
const ejs=require('ejs')
const User=require('./models/auth.model')
const app=express()
const http = require('http');
const server = http.createServer(app);
const io=require('socket.io')(server)
const dbConfig=require('./config/db.config')
const serverConfig=require('./config/server.config')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));
// var socketConfig=io.of('/user-namespace')
io.on('connection',async (socket)=>{
    console.log("User Connected")
    const loginuserId=socket.handshake.auth.token
    await User.findByIdAndUpdate({_id:loginuserId},{$set:{isOnline:true}})
    // console.log(socket.handshake.auth.token)
    // socket.on('login', function(data){
    //     console.log('a user ' + data.userId + ' connected');
    // });
    socket.on('disconnect',async()=>{
        console.log("User disconnected")
        await User.findByIdAndUpdate({_id:loginuserId},{$set:{isOnline:false}})
    })
    //chatting implementation
    socket.on('newChat',function(data){
        socket.broadcast.emit('loadnewchat',data)
    })
})
//database setup
mongoose.connect(dbConfig.DB_URL).then(()=>{
    console.log("database connected successfully")
}).catch((error)=>{
    console.log(error.message)
})

//setup view engine
app.set('view engine','ejs')

//showing login page
app.get("/login", function (req, res) {
    res.render("pages-login");
});

//showing register page
app.get('/',(req,res)=>{
    res.render('pages-register')
})

//display error page
app.get('/*',(req,res)=>{
    res.render('pages-404')
})

require('./routes/auth.routes')(app)

server.listen(serverConfig.PORT,()=>{
    console.log("Server is listen on port",serverConfig.PORT)
})