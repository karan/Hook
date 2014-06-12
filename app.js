require('newrelic');
var express = require('express');
var jsdom = require("jsdom");
var request = require('request');
var db = require('./config/db');
var Posts = require('./models/posts');

var app = express();

var BASE_URL = 'http://www.producthunt.com/';


app.configure(function(){
  app.set('port', process.env.PORT || 8888);
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(app.router);
});


app.get('/', function(req, res) {
  res.redirect('https://github.com/karan/Hook');
});


app.get('/today', function(req, res) {

  var today = new Date().toJSON().slice(0,10);

  Posts.findOne({date: today}, function(err, obj) {
    
    if (obj && obj.expires < Date.now()) {
      // post expired, scrape again, and save
      console.log("posts expired - " + today);
      scrapeSaveSend(function(posts) {
        Posts.findOneAndUpdate({date: today}, {posts: posts, expires: new Date(Date.now() + 60*60*1000)}, {new: true}, function(err, newObj) {
          res.send(200, {
            status: 'success',
            hunts: posts
          }); 
        });
      });
    } else if (obj) {
      console.log("posts not expired - " + today);
      // not expired, just return this
      res.send(200, {
        status: 'success',
        hunts: obj.posts
      }); 
    } else {
      // not in the db, scrape and send
      console.log("posts not found in db - " + today);

      scrapeSaveSend(function(posts) {
        new Posts({
          date: today,
          posts: posts
        }).save(function(err) {
          res.send(200, {
            status: 'success',
            hunts: posts
          }); 
        });
      });
      
    }

  });

});

function scrapeSaveSend(callback) {
  var posts = [];

  jsdom.env(
    BASE_URL,
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      var $ = window.$;
      var $ph_posts = $(".todays-posts tr");
      $ph_posts.each(function(rank) {

        var votes = +$(this).find(".upvote").text();
        var name = $(this).find("h3.user-name").clone().children().remove().end().text().trim().replace(/"/g, "");
        var username = $(this).find("span.user-handle").text().trim().replace(/"/g, "").match(/\(\@(.*)\)/)[1];
        var title = $(this).find(".post-url").text();
        var tagline = $(this).find(".post-tagline").text();
        var comments = $(this).find(".view-discussion").text().trim().match(/(\d+)/g);
        if (!comments) comments = 0; 
        else comments = +comments[0];

        var permalink = $(this).find(".view-discussion").attr("data-url");
        
        request({url: BASE_URL+$(this).find(".post-url").attr("href"), followRedirect: false}, function (error, response, body) {
          url = response.headers.location;

          posts.push({
            'title': title,
            'votes': votes,
            'user': {
              'username': username,
              'name': name
            },
            'rank': rank + 1,
            'tagline': tagline,
            'comments': comments,
            'permalink': permalink,
            'url': url
          });

          if (posts.length === $ph_posts.length) {
            callback(posts);
          }

        });

      });
    }
  );
}

app.listen(app.get('port'));
