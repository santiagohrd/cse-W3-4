const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const mongodb = require('./data/database');
const routes = require('./routes/index');
const dotenv = require('dotenv').config();
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-Width, Content-Type, Accept, z-key'
//   );
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//   next();
// }) 

app
    .use(bodyParser.json())
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    }))

    //Basic express session initilization
    .use(passport.initialize())

    //Init passport on every route call
    .use(passport.session())

    //allow passport to use session
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-Width, Content-Type, Accept, z-key'
        );
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS. PATCH');
        next();
    })

    .use(cors({ methods: ["GET", "POST", "PUT", "DELETE", "UPDATE", "PATCH"]}))
    .use(cors({ origin: "*"}))
    .use("/", require("./routes/index"));


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
    return done(null, profile)
}
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user)
});

app.get("/", (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")});

app.get("/github/callback", passport.authenticate("github", {
  failureRedirect: "/api-docs", session: false
}),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use('/', routes);


process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

mongodb.initDb((err) => {
  if (err) {
      console.log(err)
  }
  else {
    app.listen(PORT, () => console.log(`Database is listening and Node is running on port ${PORT}`));
  }
});

