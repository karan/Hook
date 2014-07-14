require('newrelic');
var express = require('express');
var request = require('request');
var db = require('./config/db');
var Posts = require('./models/posts');
var Comments = require('./models/comments');
var cheerio = require('cheerio');

var app = express();

var BASE_URL = 'http://www.producthunt.com';


app.configure(function (){
  app.set('port', process.env.PORT || 8888);
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(app.router);
});


app.get('/', function (req, res) {
  res.redirect('https://github.com/karan/Hook');
});


app.get('/today', function (req, res) {

  var today = new Date().toJSON().slice(0,10);

  Posts.findOne({date: today}, function (err, obj) {
    
    if (true) {
      // post expired, scrape again, and save
      console.log("posts expired - " + today);
      getHomePosts(null, function (posts) {
        Posts.findOneAndUpdate({date: today}, {posts: posts, expires: new Date(Date.now() + 60*60*1000)}, {new: true}, function (err, newObj) {
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

      getHomePosts(null, function (posts) {
        console.log("got details");
        new Posts({
          date: today,
          posts: posts
        }).save(function (err) {
          res.send(200, {
            status: 'success',
            hunts: posts
          }); 
        });
      });
      
    }

  });

});


app.get("/posts/:slug", function (req, res) {

  var post_url = '/posts/'+req.params.slug;

  Comments.findOne({'permalink': post_url}, function(err, commentobj) {

    if (commentobj && commentobj.expires < Date.now()) {
      // expired. Scrape again, save and send
      console.log("expired");
      getPostDetails(post_url, function (post) {
        console.log(post);
        getComments(post_url, function (err, comments, related) {
          Comments.findOneAndUpdate({permalink: post_url}, {post: post, comments: comments, expires: new Date(Date.now() + 2*60*60*1000)}, function (err, newObj) {
            res.send(200, {
              status: 'success',
              post: post,
              comments: comments
            }); 
          });
        });
      });
    } else if (commentobj) {
      console.log("in db - fine");
      // not expired, just send response
      res.send(200, {
        status: 'success',
        post: commentobj.post,
        comments: commentobj.comments
      });
    } else {
      console.log("not in db");
      // not in db, scrape, save and send
      getPostDetails(post_url, function (post) {
        console.log(post);
        getComments(post_url, function (err, comments, related) {
          new Comments({
            post: post,
            permalink: post.permalink,
            comments: comments
          }).save(function(err) {
            res.send(200, {
              status: 'success',
              post: post,
              comments: comments
            });
          });
        });
      });

    }

  });

});


// Gets the details of a single post
function getPostDetails(post_url, callback) {
  var url = post_url ? BASE_URL + post_url : BASE_URL;
  console.log(url);

  request(url, function (error, response, body) {

    if (!error && response.statusCode == 200) {
      $ = cheerio.load(body);

      var header_dom = $(".comments-header");

      var votes = +header_dom.find(".vote-count").text();
      var name = /Posted by (.*) \d+ .*/g.exec(header_dom.find(".posted-by").text().trim().replace(/"/g, ""))[1];
      var username = header_dom.find(".user-with-tooltip").attr("href").slice(1).trim().replace(/"/g, "");
      var title = header_dom.find(".post-url").text();
      var tagline = header_dom.find(".post-tagline").text();

      var comment_count = $($(".modal-container").find(".subhead")[2]).text().trim().match(/(\d+)/g);
      comment_count = comment_count ? comment_count[0] : 0;

      var permalink = post_url;
      
      request({url: BASE_URL+header_dom.find(".post-url").attr("href"), followRedirect: false}, function (error, response, body) {
        url = response.headers.location;

        callback({
          'title': title,
          'votes': votes,
          'user': {
            'username': username,
            'name': name
          },
          'rank': 1,
          'tagline': tagline,
          'comment_count': comment_count,
          'permalink': permalink,
          'url': url
        });

      });
    }

  });
}

// Returns comments for a single post
function getComments(url, callback) {

  var comments = [];

  request(BASE_URL+url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    
    $ = cheerio.load(body);
    var comments_dom = $(".modal-container").find(".comment");

    if (comments_dom.length === 0) {
      return callback(null, comments);
    }

    comments_dom.each(function (index) {

      var name = $(this).find(".comment-user-name a").text();
      var username = $(this).find(".comment-user-handle").text().replace(/[{()} ]/g, '');
      var timestamp = $(this).find(".comment-time-ago").text().replace(/\s+/g, '');
      var comment = $(this).find(".actual-comment").find(".comment-user-name").remove().end().text().replace(/^\s+|\s+$/g,'');
      var comment_html = $(this).find(".actual-comment").html().replace(/^\s+|\s+$/g,'');

      comments.push({
        index: index+1,
        user: {
          username: username,
          name: name
        },
        timestamp: timestamp,
        comment: comment,
        comment_html: comment_html
      });


      if (comments.length === comments_dom.length) {
        callback(null, comments);
      }
    });
  }
});

}


function compare(a,b) {
  return a.rank - b.rank;
}


// Returns all homepage posts posted today
function getHomePosts(post_url, callback) {
  var url = post_url ? BASE_URL + post_url : BASE_URL;
  var posts = [];

  request(BASE_URL, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    
    $ = cheerio.load(body);
    var x = $('.today .posts-group tr');

    var container = null;

    x.each(function (rank) {

      var votes = $(this).find(".upvote").text().replace(/\s+/g, '');
      var name = $(this).find("h3.user-name").clone().children().remove().end().text().trim().replace(/"/g, "");
      var username = $(this).find("span.user-handle").text().replace(/[() ]/g, '');
      console.log(username);
      var title = $(this).find(".post-url").text();
      var tagline = $(this).find(".post-tagline").text();

      if (container) {
          var comment_count = $(container.find(".subhead")[2]).text().trim().match(/(\d+)/g);;
        } else {
          var comment_count = $(this).find(".view-discussion").text().trim().match(/(\d+)/g);
        }
        comment_count = comment_count ? comment_count[0] : 0; 

        var permalink = post_url ? post_url : $(this).find(".view-discussion").attr("data-url");

        var url = BASE_URL+$(this).find(".post-url").attr("href");

        
        request({url: BASE_URL+$(this).find(".post-url").attr("href"), followRedirect: false}, function (error, response, body) {
          if (error) console.log("ERROR  " + error);
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
            'comment_count': comment_count,
            'permalink': permalink,
            'url': url
          });

          posts.sort(compare);

          if (posts.length === x.length) {
            callback(posts);
          }
        });
    });
  }
});
}


app.listen(app.get('port'));
