var sys = require('sys'),
    express = require('express'),
    app = express(),
    sessionStore = new express.session.MemoryStore(),    
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    cookie = require('cookie'),
    users;

users = {
    'rob': {
        id: 1,
        displayName: 'Rob Misio'
    },
    'bob': {
        id: 2,
        displayName: 'Bob Bobbers'
    },
    'rick': {
        id: 3,
        displayName: 'Rick Rona'
    }        
}

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());    
    app.use(express.session({
        secret: 'keyboard cat',
        store: sessionStore
    }));
    app.use(express.favicon());
    app.use(passport.initialize());
    app.use(passport.session());
});

// passport config
passport.use(new LocalStrategy(
    function(username, password, done) {
        if (users[username]) {
            done(null, users[username]);
        } else {
            done(null, false, { message: 'No soup for you!' });
        }        
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(username, done) {
    if (users[username]) {
        done(null, users[username]);
    }
});

// routes
app.get('/is-authenticated', function(req, res) {
    sys.puts(req.user ? sys.inspect(req.user) : 'BUM BADDA BUMER!');
    res.send(req.user || 401);
});

app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        // res.redirect('/users/' + req.user.username);
        res.send(req.user);
    });

// sockets
io.sockets.on('connection', function (socket) {
    var sessionId = socket.handshake.headers.cookie &&
            (sessionId = cookie.parse(socket.handshake.headers.cookie)['connect.sid']) &&
            (sessionId = sessionId.match(/:.*?\./)) &&
            sessionId[0].slice(1, sessionId[0].length - 1);

    sys.puts(sys.inspect(sessionStore));
    sys.puts('===========================')
    sys.puts(sys.inspect(sessionId));
    // sys.puts(sys.inspect(cookie.parse(socket.handshake.headers.cookie)['connect.sid']));
    if (sessionId) {
        sessionStore.get(sessionId, function (err, data) {
            if (err) console.log(err);

            if (data && data.passport && data.passport.user) {
                socket.emit('login', data.passport.user);
            }
        });
    }

    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        // console.log(data);
    });
});

server.listen(8080);
