const express = require('express');
const request = require('request');
const querystring = require('querystring');
const port = 8080;
const app = express();

const redirect_uri = 'http://localhost:8080/callback';

app.get('/login', (req, res) => {
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: 'user-read-private user-read-email',
        redirect_uri
      })
  );
});

app.get('/callback', (req, res) => {
  let code = req.query.code || null;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ':' +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64')
    },
    json: true
  };
  request.post(authOptions, (error, response, body) => {
    const access_token = body.access_token;
    const uri = 'http://localhost:8080/token';
    res.redirect(uri + '?access_token=' + access_token);
  });
});

app.get('/token', (req, res) => {
  console.log(res);
});

console.log(`Express listening to port: ${port}`);
app.listen(port);
