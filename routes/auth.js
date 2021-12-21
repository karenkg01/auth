const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const tokenSecret = 'my-token-secret';

const { UserModel } = require("../model/user")
const router = Router();

// look for the user in the database, 
//then we compare if the password in the database matches the one provided in the request body. 
//If they all match, we can generate new JSON web tokens to be used. 
router.post("/login", (req, res) => {
    UserModel.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {

                res.status(404).json({ error: 'log in failed' })
            }
            else {
                bcrypt.compare(req.body.password, user.password, (error, match) => {
                    if (error) {
                        res.status(500).json(error)   //status code 500 is a generic error response. It means that the server encountered an unexpected condition that prevented it from fulfilling the request.
                    } else if (match) {
                        res.status(200).json({  //status 200: everything ok
                            token: jwt.sign({
                                username: user.username
                            }, tokenSecret)
                        })
                    } else {
                        res.status(404).json({
                            error: "log in failed"
                        })
                    }
                })
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
    //res.json() :  parameter converted to a JSON string using the JSON.stringify() method.
});

router.post("/register", async (req, res) => {
    const { body } = req;   // JavaScript object containing the parse JSON
    const { username, password } = body; //username and password come from body

    //if username&password are true and not equal to empty then the following happens
    if (username && password && username !== "" && password !== "") {   //we define a variable , thats has a value defined by the awaiting of the result bcrypt.hash.
        const encryptedPassword = await bcrypt.hash(password, 10) //10 iterations through bcrypt

        // create new user
        const newUser = new UserModel({
            username,
            password: encryptedPassword
        })

        await newUser.save()
        //The json() middleware adds a body property to the Express request req. 
        //To access the parsed request body, use req.body as shown below.
        res.json({ message: "New User Created." });
    } else {
        res.status(400).json()  //A 400 Bad Request Error indicates that the server (remote computer) is unable (or refuses) to process the request sent by the client (web browser), due to an issue that is perceived by the server to be a client problem
    }
})



module.exports = router;