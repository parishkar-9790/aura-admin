import mongoose from "mongoose";

const CoordinatorSchema=new mongoose.Schema({
    name:{type:String,required:true},
    auraID:{type:String,unique: true,required: true},
    usn:{type:String,unique:true,required: true},
    eventID:{type:String,required: true},
})
const  coordinatorModel=mongoose.model("Coordinator",CoordinatorSchema)
export default coordinatorModel