const express = require('express');
const app = express();
const cors = require('cors');
const auth = require('./Routes/auth');
const port = process.env.PORT || 8080;

app.use(cors());
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/auth', auth);

app.listen(port, () => console.log(`Express listening to port: ${port}`));

module.exports = app;
