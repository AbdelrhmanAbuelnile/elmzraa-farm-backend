const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const morgan = require('morgan')
const mongoose = require('mongoose');
const userRoutes = require('./routes/usersRoutes')
const cropsRouts = require('./routes/cropsRouter')
const authRoutes = require('./routes/auth')
const cors = require('cors')
require('./db')


app.use(cors())

app.use(express.json());
app.use(express.urlencoded())
app.use(morgan('tiny'))


app.use('/users', userRoutes);
app.use('/crops', cropsRouts);

app.use('/auth', authRoutes)

app.get('/', (req, res) => {
  res.send(path.join(__dirname, 'index.html'));
});


app.use((err,req,res,next)=>{
	const statusCode = err.statusCode || 500;
	res.status(statusCode).send({
		status:statusCode,
		message: err?.message || 'internal server error',
		errors: err?.errors || []
	})
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});