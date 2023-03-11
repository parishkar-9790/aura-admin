// Imports
const { Router } = require("express");
const { complete } = require("../controllers/controllers");
const {
	eventGetAllController,
	eventGetByClubController,
	eventGetByClubAndTitleController,
	eventGetByIdController,
} = require("../controllers/eventController");
const { checkUser } = require("../middleware/authMiddleware");

// Constants
const router = Router();

// Body
router.get("/", checkUser, eventGetAllController, complete);

router.get("/resolve/:id", checkUser, eventGetByIdController, complete);

router.get("/:club", checkUser, eventGetByClubController, complete);
router.get("/:club/:title", checkUser, eventGetByClubAndTitleController, complete);

module.exports = router;
