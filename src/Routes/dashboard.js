const express = require('express');
const querystring = require('querystring');
const router = express.Router();
const jwt = require('../Helpers/jwt');
const axios = require('axios');

const User = require('../Models/User');

const redirect_uri =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/dashboard/callback'
    : 'https://mpm-node-backend.herokuapp.com/dashboard/callback';

router.get('/', (req, res) => {
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

router.get('/callback', async (req, res) => {
  const formData = {
    code: req.query.code,
    redirect_uri,
    grant_type: 'authorization_code'
  };

  const tokenUrl = 'https://accounts.spotify.com/api/token';

  try {
    const getUserToken = await axios.post(
      tokenUrl,
      querystring.stringify(formData),
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ':' +
                process.env.SPOTIFY_CLIENT_SECRET
            ).toString('base64')
        }
      }
    );

    const { access_token, refresh_token } = getUserToken.data;
    const meUrl = 'https://api.spotify.com/v1/me';

    const getUserByToken = await axios({
      method: 'GET',
      url: meUrl,
      headers: {
        Authorization: 'Bearer ' + access_token
      }
    });

    const { email, display_name, id } = getUserByToken.data;
    let user = await User.findOne({ email }).exec();

    if (!user) {
      user = await User.create({
        username: display_name,
        email: email,
        spotifyId: id
      });
    }

    const token = jwt.sign(access_token, refresh_token, user);

    const dashboard_uri =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://mpm-dashboard.herokuapp.com';

    res.redirect(dashboard_uri + '?token=' + token);
  } catch (error) {
    console.error('error', error);
  }
});

module.exports = router;
