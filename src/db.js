const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true });

let connect = mongoose.connection;
connect.on('error', console.error.bind(console, 'Connection error:'));

connect.once('open', () => {
  console.log('Connected to database!');
});
