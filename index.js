require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const morgan = require('morgan')
const mongoose = require('mongoose');
const userRoutes = require('./routes/usersRoutes')
const cropsRouts = require('./routes/cropsRouter')
const farmRouts = require('./routes/farmRouter')
const authRoutes = require('./routes/auth')
const fertlizersRoutes = require('./routes/fertilizerRouter')
const equipmentRoutes = require('./routes/equipmentRouter')
const medicinesRoutes = require('./routes/medicinesRoutes')
const cors = require('cors')
require('./db')

app.use(cors())
// Middleware to check API key
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  console.log("🚀 ~ apiKeyMiddleware ~ apiKey:", apiKey)
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

app.use(apiKeyMiddleware);


app.use(express.json());
app.use(express.urlencoded())
app.use(morgan('tiny'))


app.use('/api/users', userRoutes);
app.use('/api/crops', cropsRouts);
app.use('/api/farm', farmRouts);
app.use('/api/fertlizers', fertlizersRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/medicines', medicinesRoutes);

app.use('/api/auth', authRoutes)

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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});