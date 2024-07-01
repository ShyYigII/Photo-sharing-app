const jwt = require('jsonwebtoken');



const auth = async(req, res, next) => {
    const authorizationClient  = req.headers['authorization'];
            const  token = authorizationClient && authorizationClient.split(' ')[1];

            if (!token) return res.sendStatus(401)
                    
    try {
        jwt.verify(token, process.env.JWT_KEY);
        next()

    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
module.exports = auth