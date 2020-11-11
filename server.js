import express from 'express';
import { check, validationResult } from 'express-validator';
import connectDatabase from './config/db';
import cors from 'cors';
import bcrypt from 'bcrypt.js';
import User from './model/User';
import jwt from 'jsonwebtoken';
import config from 'config';


//initialize express application
const app = express();

// conmnect to database
connectDatabase();

//middleware
app.use(express.json({ extend: false}));
app.use(
    cors({
        origin: 'http:localhost:3000'
    })
);

//API endpoints
app.get('/', (req, res) => 
    res.send('http get request sent to root api endpoint')
    );

app.post(
    '/api/users',
    [
        check('name', 'Please enter your name')
        .not()
        .isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check(
            'password', 
            'please enter a password with 6 or more characters'
        ).isLength({ min: 6})
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        }else {
            const { name, email, password } = req.body;
            try {
                //Check if user exists
                let user = await User.findOne({ email: email });
                if (user){
                    return res
                    .status(400)
                    .json({ errors: [{ msg: 'User already exist'}] });
                }
                //create a new user
                user = new User({
                    name: name,
                    email: email,
                    password: password 
                });

                //Encrypt the password
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);

                // Save to the db and return
                await user.save();

             




            } catch (error) {
                res.status(500).send('Server error');
            }
        }
    }
);

//Connection listener
const port = 5000;
app.listen(port, () => console.log(`Express server running on port ${port}`));
