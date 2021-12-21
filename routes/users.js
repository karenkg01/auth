const { Router } = require("express");
const jwt = require('../middleware/jwtMiddleware.js');
const router = new Router();

router.post('/', jwt());
router.post("/", (req, res) =>{
    res.send("Your Authenticated")
});

router.get("/", (req, res) =>{
    res.send("Authentication not required")
});