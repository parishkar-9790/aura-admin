import express from "express";

import {getAllTeams,getTeam} from "../controllers/participants.controllers.js";

const router=express.Router();
router.route('/').get(getAllTeams)
router.route('/getTeam/:id').get(getTeam)

export default router