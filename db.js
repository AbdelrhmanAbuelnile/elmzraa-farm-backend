const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_CONNECT_URI;
mongoose.connect(dbUrl)
.then(()=> console.log("DB connected successfuly"))
.catch(err => console.log('err', err))