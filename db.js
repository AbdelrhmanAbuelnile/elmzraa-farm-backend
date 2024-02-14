const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_CONNECT_URI;
mongoose.connect(dbUrl)
// mongoose.connect('mongodb://127.0.0.1:27017/mazra')
.then(()=> console.log("DB connected successfuly"))
.catch(err => console.log('err', err))