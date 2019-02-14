const express = require('express');
const request = require('request');
const querystring = require('querystring');
const port = process.env.PORT || 8080;
const app = express();

const redirect_uri = 'https://mpm-node-backend.herokuapp.com/callback';

app.get('/', (req, res) => {
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope:
          'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state',
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
    const refresh_token = body.refresh_token;
    const uri = 'https://mpm-template.herokuapp.com/index.html';
    res.redirect(
      uri + '?access_token=' + access_token + '?refresh_token=' + refresh_token
    );
  });
});

app.get('/refresh_token', (req, res) => {
  let refresh_token = req.query.refresh_token;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
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
    if (!error && response.statusCode === 200) {
      let access_token = body.access_token;
      res.send({
        access_token: access_token
      });
    }
  });
});

console.log(`Express listening to port: ${port}`);
app.listen(port);
