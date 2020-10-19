import express from 'express';
import { check, validationResult } from 'express-validator';
import connectDatabase from './config/db';
import cors from 'cors';

//initialize express application
const app = express();

// conmnect to database
connectDatabase();

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
        .empty(),
        check('email', 'Please enter a valid email').isEmail(),
        check(
            'password', 'please enter a password with 6 or more characters'
        ).isLength({ min: 6})
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        }else {
            return res.send(req.body);
        }
    }
);

//Connection listener
const port = 5000;
app.listen(port, () => console.log(`Express server running on port ${port}`));
