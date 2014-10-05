<p align="center"><img src="https://raw.githubusercontent.com/karan/Hook/master/logo.png"></p>

Hook
====

ProductHunt API for retrieving today's hunts and comments for any post. 

Discussion on [Product Hunt](http://www.producthunt.com/posts/hook-producthunt-api).

**Since official @ProductHunt API is in private beta, I'm discontinuing support for Hook. I highly recommend switching to the official API.**

*Note: This is an unofficial API and __not__ supported or controlled by ProductHunt itself. Any questions, comments, feedback or feature requests should be directed to [karan](http://github.com/karan) or via an [issue](https://github.com/karan/Hook/issues) in this repo.*

Usage
=====

**Base URL:** [http://hook-api.herokuapp.com/](http://hook-api.herokuapp.com/)

**Output:** JSON

### Get today's products

Posts are cached for 60 minutes.

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

### Get comments for any post

Comments are cached for 120 minutes.

#### `GET /:permalink`

Example Query:

```
http://hook-api.herokuapp.com/posts/hook-producthunt-api
```

Response:

```json

{
  "status": "success",
  "post": {
    "url": "https://github.com/karan/Hook",
    "permalink": "/posts/hook-producthunt-api",
    "comment_count": "10",
    "tagline": "ProductHunt API for retrieving today's hunts",
    "rank": 1,
    "user": {
      "name": "Karan Goel",
      "username": "karangoel"
    },
    "votes": 46,
    "title": "Hook - ProductHunt API"
  },
  "comments": [
    {
      "comment_html": "\n          \n          Yo guys. I have been toying with a scraper for PH for some time now, and was really motivated after seeing <a href=\"https://twitter.com/TosinAF\">@TosinAF</a> 's <a href=\"http://www.producthunt.com/posts/the-news-ios\">thread</a> and packaged all I had in a neat API.<br><br><a href=\"http://hook-api.herokuapp.com/today\">Try it here</a><br><br>Currently it gets today's posts, and has a cache of 1 hour. I hope to see people make a ton of good stuff with it. :)<br><br>PS: I make a lot of cool stuff, and people love it. <a href=\"http://www.goel.im/#subscribe\">Leave your e-mail here</a> and stay tuned about my projects.\n        ",
      "comment": "\n          \n          Yo guys. I have been toying with a scraper for PH for some time now, and was really motivated after seeing @TosinAF 's thread and packaged all I had in a neat API.Try it hereCurrently it gets today's posts, and has a cache of 1 hour. I hope to see people make a ton of good stuff with it. :)PS: I make a lot of cool stuff, and people love it. Leave your e-mail here and stay tuned about my projects.\n        ",
      "timestamp": "7h ago",
      "user": {
        "name": "Karan Goel",
        "username": "karangoel"
      },
      "index": 1
    },
    ...
    ...
```

Expo
=======

Some apps built using this API:

| Name | Description | URL |
| ---- | ---- | ---- |
| alfred-producthunt-workflow | Product Hunt Workflow for Alfred 2.0 | https://github.com/loris/alfred-producthunt-workflow |
| PH | Product Hunt Android App | https://github.com/yelinaung/PH |
| TheNews (iOS) | PH, DN, Hn, now on iOS | https://appsto.re/us/PpnV0.i |
| ProductHuntExtn | Today View Extension for Product Hunt (Yosemite) | https://github.com/zameericle/ProductHuntExtn |
| ProductHunt (iOS) | iOS App for producthunt.co | https://github.com/sapanbhuta/ProductHunt |
| Spear | Product Hunt for Hackers - a CLI to Product Hunt. | https://github.com/karan/Spear |

*If you are using Hook, please let me know and I'll showcase your app here.*

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

Donation
=======

Donations to my open source work is greatly appreciated and helps me dedicate more time and energy into making cool things. If you want to help me produce this work as well as more like it, please take a moment to contribute.

- Bitcoin: 1GZqi6qUGSKGQvjd4CvVBJ9FYpsQvU2P7h
- Gratipay: https://www.gratipay.com/karan/

