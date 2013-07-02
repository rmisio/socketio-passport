var socket = io.connect('http://localhost');

socket.on('login', onLogin);

function onLogin(user) {
    alert('we gotta login, yo! ' + user);
};

$(function() {
    var sessionUser = new app.models.SessionUser(),
        loggedOutView = new app.views.LoggedOut(),
        $container = $('.container');

    sessionUser.on('logut', function() {
        alert('session user log out');
        $container.html(loggedOutView.render().el);
    }).on('login', function() {
        alert('session user log inny in inners');
        // $container.html(loggedOutView.render().el);
    });

    $container.html(loggedOutView.render().el);
    sessionUser.fetch();
    
    var $loginForm = $('#loginForm'),
        $username = $('input[type=text]', $loginForm),
        $submit = $('input[type=submit]', $loginForm);

    $username.keyup(function() {
        if ($username.val()) {
            $submit.removeAttr('disabled');
        } else {
            $submit.attr('disabled', 'disabled');
        }
    });

    $loginForm.submit(function(e) {
        e.preventDefault();

        $.post('/login', {
            username: $username.val(),
            password: 'blah-blah-blah'
        }).done(onLogin);
    });
})        