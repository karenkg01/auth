const jwt = require('jsonwebtoken')
const tokenSecret = "my-token-secret"

//express-middleware
const jwtAuthorization = () => {
    return (req, res, next) => {
        const token = req.headers.authorization

        //tokens are used to fetch request and make sure users are authorize to fetch those
        if (!token) res.status(403).json({ error: "please provide a token" })
        else {//Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l
            jwt.verify(token.split(" ")[1], tokenSecret, (err, value) => {
                if (err) {
                    res.status(500).json({ error: 'failed to authenticate token' })
                } else {
                    //req.user is being set to value.data, the user from the token
                    req.user = value.data
                    next()//lets the route/request continue , means go to the next middleware
                }
            })
        }

    }
}
module.exports = jwtAuthorization
