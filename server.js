import express from 'express';
import connectDatabase from './config/db';
import {check, validationResult } from 'express-validator';

//initialize express application
const app = express();

// conmnect to database
connectDatabase();

//configure Middleware
app.use(express.json({ extended: false}));

//API endpoints
/**
 * @route GET/
 * @desc Test endpoint
 */

//API endpoints
app.get('/', (req, res) => 
    res.send('http get request sent to root api endpoint')
    );

/**
 * @route POST api/users
 * @desc Register User
 */
app.post(
    '/api/users',
    [
        check('name', 'Please enter your name')
        .not()
        .isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check(
            'password', 
            'please enter a password with 6 or more character'
            ).isLength({ min: 6 })
    ],
     (req,res) => {
         const errors = validationResult(req);
         if (!errors.isEmpty()){
             return res.status(422).json({ errors: errors.array() });
         }else {
             return res.send(req.body);
         }
        }
    );

//Connection listner
app.listen(3000, () => console.log('Express server running on port 3000'));
