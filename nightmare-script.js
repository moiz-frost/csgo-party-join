// Host's status must be online and ingame

var $ = require('jquery');
var Nightmare = require('nightmare');

// User credentials and hostname
var hostName = ''; // The player's lobby to join
var username = '';
var password = '';

var nightmare = Nightmare(

    {
        show: true, // Displays electron browser windows
        electronPath: require('electron') // For backward compatibility
    });


nightmare
    .goto('https://store.steampowered.com//login/?redir=')
    .type('#input_username', username)
    .type('#input_password', password)
    .click('.btnv6_blue_hoverfade.btn_medium')
    .wait(10000)
    .inject('js', './node_modules/jquery/dist/jquery.min.js')
    .evaluate(function () {
        return document.getElementsByClassName('user_avatar playerAvatar')[0].href;
    })
    .then(function (url) {
        nightmare
            .goto(url + 'friends')
            .wait()
            .url()
            .then(function (url) {
                // console.log(url);
                nightmare
                    .evaluate(function (hostName) {
                        var elements = document.getElementsByClassName('friendBlock persona in-game');
                        for(var i = 0; i < elements.length; i++) {
                            var player = elements.item(i);
                            if((player.children[3].innerText.indexOf(hostName)) == 0){
                                return player.childNodes[3].href; // returns URI of hostname's profile
                            }
                        }
                    }, hostName)
                    .then(function (url) {
                        // console.log(url);
                        nightmare
                            .goto(url)
                            .wait()
                            .click('.btn_green_white_innerfade.btn_small_thin') // Join button
                            .end()
                            .then(function (result) {
                                if (result) console.log(result);
                                console.log('Done!');
                            })
                            .catch(function (error) {
                                if (result) console.log(error);
                                console.log('Done with Errors');
                            });
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
            .catch(function (error) {
                console.log(error);
            })
    })
    .catch(function (error) {
        console.log(error);
    });