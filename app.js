const express = require("express");
const app = express()

app.use(express.static(__dirname))

app.get("/", (req, res)=>{
    res.sendFile(__dirname+"\\index.html")
})

app.listen(3000,function (){
    console.log("listening at 3000")
})

app.get("/about", (req, res)=>{
   res.send('<h1>created by Ganesh Mundkar</h1>')
})