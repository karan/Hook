var express = require('express');
var jsdom = require("jsdom");

var app = express();

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
  jsdom.env(
    "http://www.producthunt.com/",
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      var $ = window.$;
      $(".todays-posts tr").each(function() {
        console.log($(this).find(".url").text());
      });
    }
  );
});

app.listen(app.get('port'));
