import Coordinator from "../mongodb/models/Coordinator.js";

const createCoordinator=async (req,res)=>{
    try{
        const {
            name,auraID,usn,eventID
        }=req.body;
        const newCoordinator=await Coordinator.create({
            name,auraID,usn,eventID
        })
        res.status(200).json(newCoordinator);
    }catch(error){
        res.status(500).json({message:error.message})
    }
}