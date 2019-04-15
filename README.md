# Backend

This route is used by the extension to sign in and paste the tokens in Visual Studio Code.

## /auth

    GET: “/”

#### Description:

Does not use any model, it’s for signing in with Spotify. It sets the scope and redirects to another route.

#### Uses Spotify:

```
'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope:
          'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state',
        redirect_uri
      }`
  )
```

#### Response:

No response, redirects

---

    GET: “/callback”

#### Description:

Verifies the application towards Spotify and returns an access token and a refreshtoken.

#### Uses Spotify:

```
{
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
  }
```

#### Response:

No response, redirects to and url with access token and refresh token as params in the url.

---

    GET: “/refresh_token”

#### Description:

Sends the refresh token to get a new access token because the access token expires after one hour.

#### Uses Spotify:

```
{
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
  }
```

#### Response:

    {
      access_token: access_token
    }

---

---

This route is used from the dashboard to verify the JWT token.

## /user

    GET: “/me”

#### Description:

Verifies JWT token when user is trying to sign in.

#### Required header parameter:

Bearer Token

```
Authorization
```

#### Response:

    {
        "id": 1,
        "username": "John Doe",
        "email": "john@doe.com",
        "spotifyId": "johnDoe",
        "settings": {
            "keypress": 3,
            "hardcore": false
        },
        "createdAt": "2019-04-08T12:10:48.259Z",
        "updatedAt": "2019-04-09T12:33:04.525Z"
    }

---

---

This route is used from the dashboard.

## /dashboard

    GET: “/”

#### Description:

Does not use any model, it’s for signing in with Spotify. It sets the scope and redirects to another route.

#### Response:

No response, redirects

---

    GET: “/callback”

#### Model: User

#### Description:

Verifies the application towards Spotify and returns an access token and a refresh token. Then it will check if the user exists in the database, if it does not it will create the user with the user information that is received from Spotify. If the user already exists it returns the user. After that the route uses jwt tokens to sign in the user.

#### Response:

No response, redirects to and url with access token and refresh token as params in the url.

---

    GET: “/:id”

#### Model: Session

#### Description:

Gets all the sessions based on the user id and orders it by date in descending order.

#### Required parameter:

User id.

#### Response:

    [
        {
            "id": 3,
            "totalTime": 642,
            "pausedTimes": 9,
            "musicTime": 199,
            "userId": 1,
            "createdAt": "2019-04-09T13:17:49.124Z",
            "updatedAt": "2019-04-09T13:17:49.124Z"
        },
        {
            "id": 2,
            "totalTime": 148,
            "pausedTimes": 4,
            "musicTime": 36,
            "userId": 1,
            "createdAt": "2019-04-09T13:17:20.158Z",
            "updatedAt": "2019-04-09T13:17:20.158Z"
        },
        {
            "id": 1,
            "totalTime": 2000,
            "pausedTimes": 1,
            "musicTime": 1,
            "userId": 1,
            "createdAt": "2019-04-09T13:16:59.770Z",
            "updatedAt": "2019-04-09T13:16:59.770Z"
        }
    ]

---

    GET: “/total/:id

#### Model: Session

#### Description:

Gets the sum of all sessions added together based on the user id.

#### Required parameter:

User id.

#### Response:

    {
        "pausedTimesSum": "14",
        "musicTimeSum": "236",
        "totalTimeSum": "2790"
    }

---

    POST: “/settings/:id”

#### Model: User

#### Description:

Sets the settings on the user based on the user id.

#### Required parameter:

User id.

#### Response:

    {
        "id": 1,
        "username": "John Doe",
        "email": "john@doe.com",
        "spotifyId": "johnDoe",
        "settings": {
            "keypress": 3,
            "hardcore": false
        },
        "createdAt": "2019-04-08T12:10:48.259Z",
        "updatedAt": "2019-04-09T12:33:04.525Z"
    }

---

---

This route is used from the extension.

## /extension

    POST: “/”

### Model: User & Session

#### Description:

Checks if the user exists in the database, if it does not it creates the user. Then it checks if there is a session with the session id, if there is a session with the received id it will update the session. If there is not a session it creates a session.

#### Required body parameters:

```
{
    "sessionId": 4
	"totalTime": 120,
	"pausedTimes": 6,
    "musicTime": 86
	"user": {
		"display_name": "John Doe",
		"email": "john@doe.com",
		"id": "johnDoe"
	}
}
```

#### Response:

    {
        "user": {
            "id": 7,
            "username": "John Doe",
            "email": "john@doe.com",
            "spotifyId": "johnDoe",
            "createdAt": "2019-04-09T13:22:13.653Z",
            "updatedAt": "2019-04-09T13:22:13.658Z",
            "settings": null
        },
        "session": [
            {
                "id": 4,
                "totalTime": 20,
                "pausedTimes": 2,
                "musicTime": null,
                "userId": 7,
                "createdAt": "2019-04-09T13:22:13.937Z",
                "updatedAt": "2019-04-09T13:22:13.937Z"
            },
            true
        ]
    }

---

    GET: “/settings/:id”

#### Model: User

#### Description:

Gets the users settings based on the user id

#### Required parameter:

User id.

#### Response:

    {
        "id": 1,
        "username": "John Doe",
        "email": "john@doe.com",
        "spotifyId": "johnDoe",
        "settings": {
            "keypress": 3,
            "hardcore": false
        },
        "createdAt": "2019-04-08T12:10:48.259Z",
        "updatedAt": "2019-04-09T12:33:04.525Z"
    }

---

    GET: "/settings"

#### Model: User

#### Description:

Gets the users settings based on the users email

#### Required header parameter:

    email: "john@doe.com"

#### Response:

    {
        "id": 1,
        "username": "John Doe",
        "email": "john@doe.com",
        "spotifyId": "johnDoe",
        "settings": {
            "keypress": 3,
            "hardcore": false
        },
        "createdAt": "2019-04-08T12:10:48.259Z",
        "updatedAt": "2019-04-09T12:33:04.525Z"
    }

---

# Spotify

This documentation is mostly copied from Spotiy.

Example
A typical request is the GET request of the /authorize endpoint, followed by the query:

    GET https://accounts.spotify.com/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email&state=34fFs29kd09

This query performs a couple of things:

The user is asked to authorize access within the scopes.

The Spotify Accounts service presents details of the scopes for which access is being sought.

If the user is not logged in, they are prompted to do so using their Spotify credentials. When the user is logged in, they are asked to authorize access to the data sets defined in the scopes.
The user is redirected back to your specified redirect_uri.

After the user accepts, or denies your request, the Spotify Accounts service redirects the user back to your redirect_uri. In this example, the redirect address is: https://example.com/callback

If the user accepts your request, the response query string, for example https://example.com/callback?code=NApCCg..BkWtQ&state=profile%2Factivity, contains the following parameters:

#### Response:

    code	An authorization code that can be exchanged for an access token.

    state	The value of the state parameter supplied in the request.

---

Used in the /callback

    POST https://accounts.spotify.com/api/token

#### Required body parameters:

```
grant_type:	Required.
```

As defined in the OAuth 2.0 specification, this field must contain the value "authorization_code".

```
code	Required.
```

The authorization code returned from the initial request to the Account /authorize endpoint.

```
redirect_uri	Required.
```

This parameter is used for validation only (there is no actual redirection). The value of this parameter must exactly match the value of redirect_uri supplied when requesting the authorization code.

#### Required header parameter:

```
Authorization
```

Base 64 encoded string that contains the client ID and client secret key. The field must have the format:

```
Authorization: Basic *<base64 encoded client_id:client_secret>*
```

#### Response:

    {
      "access_token": "NgCXRK...MzYjw",
      "token_type": "Bearer",
      "scope": "user-read-private user-read-email",
      "expires_in": 3600,
      "refresh_token": "NgAagA...Um_SHo"
    }

---

    GET https://api.spotify.com/v1/me

#### Required header paramter:

```
Authorization
```

A valid access token from the Spotify Accounts service: see the Web API Authorization Guide for details. The access token must have been issued on behalf of the current user.
Reading the user’s email address requires the user-read-email scope; reading country and product subscription level requires the user-read-private scope. Reading the user’s birthdate requires the user-read-birthdate scope. See Using Scopes.

#### Response:

```
    {
        "country": "SE",
        "display_name": "John Doe",
        "email": "john@doe.com",
        "external_urls": {
            "spotify": "https://open.spotify.com/user/johnDoe"
        },
        "followers": {
            "href": null,
            "total": 18
        },
        "href": "https://api.spotify.com/v1/users/johnDoe",
        "id": "johnDoe",
        "images": [
            {
                "height": null,
                "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/10373815_10154849497490644_4092203171453819374_n.jpg?_nc_cat=106&_nc_ht=scontent.xx&oh=81b458b452ba8bb17c4fba2d4a6d7c6d&oe=5D4D9873",
                "width": null
            }
        ],
        "product": "premium",
        "type": "user",
        "uri": "spotify:user:johnDoe"
    }
```

The response is based on the scope that is set.

---

```
GET https://api.spotify.com/v1/me/player/devices
```

#### Required header parameter:

```
Authorization
```

A valid access token from the Spotify Accounts service: see the Web API Authorization Guide for details. The access token must have been issued on behalf of a user. The access token must have the user-read-playback-state scope authorized in order to read information.

#### Response:

```
{
  "devices" : [ {
    "id" : "5fbb3ba6aa454b5534c4ba43a8c7e8e45a63ad0e",
    "is_active" : false,
    "is_private_session": true,
    "is_restricted" : false,
    "name" : "My fridge",
    "type" : "Computer",
    "volume_percent" : 100
  } ]
}
```

---

Endpoints to play and pause Spotify.

```
PUT https://api.spotify.com/v1/me/player/play
PUT https://api.spotify.com/v1/me/player/pause
```

#### Required header parameter:

```
Authorization
```

A valid access token from the Spotify Accounts service: see the Web API Authorization Guide for details.
The access token must have been issued on behalf of a user.
The access token must have the user-modify-playback-state scope authorized in order to control playback.

---

---

# Models

### User:

    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    username: {
    type: DataTypes.STRING,
    allowNull: false
    },
    email: {
    type: DataTypes.STRING,
    allowNull: false
    },
    spotifyId: {
    type: DataTypes.STRING,
    allowNull: false
    },
    settings: {
    type: DataTypes.JSON,
    allowNull: true
    }

### Session:

    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    totalTime: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    pausedTimes: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    musicTime: {
    type: DataTypes.INTEGER,
    allowNull: true
    },
    userId: DataTypes.INTEGER
