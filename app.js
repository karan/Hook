var express = require('express');
var jsdom = require("jsdom");
var request = require('request');

var app = express();


var BASE_URL = 'http://www.producthunt.com/';

app.configure(function(){
  app.set('port', process.env.PORT || 8888);
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(app.router);
});


app.get('/', function(req, res) {
  res.send('Works');
});


app.get('/today', function(req, res) {

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
            'rank': rank,
            'tagline': tagline,
            'comments': comments,
            'permalink': permalink,
            'url': url
          });

          if (posts.length === $ph_posts.length) {
            res.send(200, {
              status: 'success',
              hunts: posts
            });
          }

        });

      });
    }
  );

});

app.listen(app.get('port'));
