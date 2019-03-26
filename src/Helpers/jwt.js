const jsonwebtoken = require('jsonwebtoken');

const bearerToken = token => token.replace('Bearer ', '');

const jwt = {
  sign: (accesstoken, refreshtoken, user) => {
    const { spotifyId, email, username } = user;

    const time = process.env.NODE_ENV === 'development' ? 31556926 : 86400;

    return jsonwebtoken.sign(
      {
        user: {
          username,
          email,
          spotifyId
        },
        access_token: accesstoken,
        refresh_token: refreshtoken
      },
      process.env.SECRET,
      {
        expiresIn: time,
        algorithm: 'HS256'
      }
    );
  },
  verify: token => {
    const tokenString = bearerToken(token);

    try {
      const verifiedToken = jsonwebtoken.verify(
        tokenString,
        process.env.SECRET,
        {
          algorithms: ['HS256']
        }
      );

      return verifiedToken;
    } catch (error) {
      console.error('Token could not be verified! ', error);
      throw new jsonwebtoken.JsonWebTokenError('Token could not be verified!');
    }
  }
};

module.exports = jwt;
