// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const { isValidDate, parseDate, isValidUrl } = require('./validators');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function(req, res) {
  res.json({ greeting: 'hello API' });
});

function dateMiddleware(req, res, done) {
  const { date } = req.params;

  if (!date) {
    const currentDate = new Date();

    return res.json({
      unix: currentDate.getTime(),
      utc: currentDate.toUTCString()
    });
  }

  if (isValidDate(date)) {
    return done();
  }

  return res.json({ error: "Invalid date" });
}

const urls = new Map();

function urlMiddleware(req, res, done) {
  const { url } = req.body;

  if (isValidUrl(url)) {
    return done();
  }

  return res.json({ error: "invalid url" });
}

app.post("/api/shorturl", urlMiddleware, (req, res) => {
  const { url } = req.body;
  const response = {
    original_url: url,
    short_url: urls.size + 1
  };

  urls.set(response.short_url, response);

  return res.json(response);
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const { short_url } = req.params;
  const url = urls.get(Number(short_url));
  if (!url) {
    return res.json({ error: "Invalid short URL" });
  }

  return res.redirect(url.original_url);
});

app.get("/api/whoami", (req, res) => {
  const { headers } = req;
  return res.json({
    ipaddress: headers['x-forwarded-for'],
    language: headers['accept-language'],
    software: headers['user-agent']
  });
});

app.get("/api/:date?", dateMiddleware, (req, res) => {
  const dateObject = parseDate(req.params.date);

  return res.json({
    unix: dateObject.getTime(),
    utc: dateObject.toUTCString()
  });
})

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
