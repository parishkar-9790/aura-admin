import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import teamRouter from './routes/participants.routes.js'
import connectDB from './mongodb/connect.js'
dotenv.config()

// middlewares
const app=express()
app.use(cors())
app.use(express.json())
app.use('/api/teams',teamRouter)
// highly responsive dashboard
app.get('/',(req,res)=>{
    res.send({message:'hey there'})
})
// init backend
const startServer=async ()=>{
    try{
        connectDB(process.env.MONGO)
        app.listen(8080,()=>console.log("Server up and running @8080"))
    }catch(error){
        console.log(error)
    }

}
startServer()