var jsdom = require("jsdom");

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
