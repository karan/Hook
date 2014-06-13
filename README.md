<p align="center"><img src="https://raw.githubusercontent.com/karan/Hook/master/logo.png"></p>

Hook
====

ProductHunt API for retrieving today's hunts. Posts are cached for 60 minutes.

*If you are using Hook, please let me know and I'll showcase your app here.*

Usage
=====

**Base URL:** [http://hook-api.herokuapp.com/](http://hook-api.herokuapp.com/)

**Output:** JSON

### Get today's products

#### `GET /today`

Example Query:

```
http://hook-api.herokuapp.com/today
```

Response:

```json
{
  "status": "success",
  "hunts": [
    {
      "url": "http://bit.ly/1oShrzl",
      "permalink": "/posts/the-news-ios",
      "comments": 20,
      "tagline": "Designer News + Hacker News, now on iOS",
      "rank": 2,
      "user": {
        "name": "Tosin Afolabi",
        "username": "TosinAF"
      },
      "votes": 48,
      "title": "The News (iOS)"
    },
    ...
    ...
```

Start
=====

```bash
$ npm install            # install dependencies
$ node app               # start the server
```

Deploy to Heroku
=====

```bash
$ npm install            # install dependencies
$ heroku create
$ heroku addons:add mongolab
$ (git add, git commit)
$ git push heroku master
```

