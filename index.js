const express=require('express')
const { get } = require('express/lib/request')
const fs=require('fs')
const multer=require('multer')
const app=express()
const files=require('./getrecentfile')



var videoPath=""
const PORT=process.env.PORT||5000
var object=files.getMostRecentFile('./publicfiles')


app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html")
})


//code to upload vide0
var storage = multer.diskStorage({
    destination: 'publicfiles',
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload=multer({
  dest:'publicfiles',
  storage:storage,
  fileFilter(req,file,cb){

    if(!file.originalname.match('mp4')){
      return cb(new Error('Please upload an image'))
    }
    
    cb(undefined,true)
  }
})

const errorMiddleware =(req,res,next) =>{
    throw new Error('From my middleware')
} 


// route to uplaod video

app.post('/upload',upload.single('upload'), async(req,res)=>{
  object =files.getMostRecentFile('./publicfiles')
  res.send()
},(error,req,res,next)=>{
   res.status(400).send({error:error.message})
})




//route to download file
app.get('/download-file',(req,res)=>{
 res.download(videoPath)
})



//Route to play the video
app.get('/playvideo',(req,res)=>{
    
    object=files.getMostRecentFile('./publicfiles')

    const range=req.headers.range
    
    if(!range){
        res.status(400).send("Requires Range header")
    }
    console.log(range)
    //video path

    const pathof="./publicfiles/"
    videoPath=pathof+object.file
    //video size

    const videoSize=fs.statSync(videoPath).size

    const chunksize=10**6

    const start=Number(range.replace(/\D/g, " "))

    // console.log(req.headers)

    const end=Math.min(start+chunksize,videoSize-1)

    const contentLength=end-start+1

    //set headers for playing video

    const headers={
        "Content-Range":`bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges":"bytes",
        "Content-Length":contentLength,
        "Content-Type":"video/mp4"
    }

    res.writeHead(206,headers)

    const stream=fs.createReadStream(videoPath,{start,end})

    stream.pipe(res)
    
})


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})