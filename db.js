const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mazra')
.then(()=> console.log("bd connected successfuly"))
.catch(err => console.log('err', err))