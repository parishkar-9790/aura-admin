import mongoose from "mongoose";

const getAllTeams = async (req, res) => {
    try {
        // const teams = await mongoose.connection.db.collection("teams").find();
        // res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await mongoose.connection.db.collection("teams").findOne({ _id: mongoose.Types.ObjectId(id) });
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllTeams, getTeam };
