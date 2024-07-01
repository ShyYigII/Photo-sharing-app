const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const dotenv = require('dotenv');
const auth = require('../middleware/auth');




router.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ login_name: req.body.login_name });

        if (existingUser) {
            return res.status(400).send({ error: 'Tài khoản đã tồn tại' });
        }

        const user = new User(req.body);

        await user.save();

    
        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
        
    } catch (error) {
        res.status(400).send(error);
    }
});


router.post('/login', async(req, res) => {

    try {
        const { login_name, password } = req.body

        const user = await User.findByCredentials(login_name, password)
       
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }

        const token = await user.generateAuthToken()

        res.send({  user, token })
        
        
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err);
    }
})


router.post('/logout', auth, async (req, res) => {
    try {
       
        console.log(req.body)
            res.status(200).send({message: "logout successfully"})
    } catch (error) {
        res.status(500).send(error)
    }
})
  

router.post('/users/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;
