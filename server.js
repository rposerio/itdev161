import express from 'express';
import connectDatabase from './config/db';

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
app.post('/api/users', (req,res) => {
    console.log(req.body);
    res.send(req.body);
});

//Connection listner
app.listen(3000, () => console.log('Express server running on port 3000'));
