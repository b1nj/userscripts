// ==UserScript==
// @name    TweetDeck Clear
// @namespace   http://b1nj.fr
// @version 0.6
// @icon https://ton.twimg.com/tweetdeck-web/web/assets/logos/favicon.3d5d8f1cbe.ico
// @description Add buttons and keyboard shortcuts to tweetdeck for clear all tweets or column tweets
// @match   https://tweetdeck.twitter.com/*
// @match   http://tweetdeck.twitter.com/*
// @match   https://www.tweetdeck.twitter.com/*
// @match   http://www.tweetdeck.twitter.com/*
// @grant       none
// @copyright   B1nj
// @license License:X11 (MIT)
// ==/UserScript==

$(function() {

    // Wait for the complete loading of the ajax page
    // I have tried unsuccessfully other solutions with ajaxStop() for example.
    window.setTimeout(load, 5000);

    function load() {
        addButtons();
        addKeyboardShortcuts();
        addTextKeyboardShortcuts();
    }


    var button = '<button style="position: absolute; right: 10px; top: -10px; padding-bottom: 0px;" type="button" class="js-user-button btn btn-alt btn-neutral btn-options-tray padding-hn "> <i class="icon icon-clear-timeline"></i> <span class="label">Clear</span> </button>';
    var buttonAll = '<a type="button" class="js-user-buttonAll padding-hl app-nav-link cf"><div class="obj-left"> <i class="icon icon-clear-timeline"></i> </div> <div class="nbfc padding-ts hide-condensed">Clear all</div> </a>';

    function addButtons() {

        // Buttons clear
        $('.js-column-header').parent().each(function() {
            $(this).append(button);
        });
        $('.js-user-button').click(function () {
            var $col = $(this).parent();
            $col.find('a[data-action="options"]').trigger('click');
            window.setTimeout(function () {
                clearTweets($col);
            }, 1000);
        });

        // Button clear All
        $('.app-navigator').append(buttonAll);
        $('.js-user-buttonAll').click(function () {
            $('.js-user-button').each(function() {
                $(this).trigger('click');
            });
        });
    }


    function clearTweets($col) {
        $('button[data-action="clear"]').each(function (index) {
            $(this).trigger('click');
        });
        $('a[data-action="options"]', $col).trigger('click');
    }


    // Add Keyboard shortcuts
    var key = [];
    function addKeyboardShortcuts() {
        $(document).on("keydown keyup", function(e){
            key[e.keyCode] = e.type == 'keydown';

            if (test_key('del')) {
                $jsColumnFocused = $('.js-column.is-focused');
                if ($jsColumnFocused.length) {
                    $jsColumnFocused.find('.js-user-button').trigger('click');
                    key = [];
                }

                $isSelectedTweet = $('.is-selected-tweet');
                if ($isSelectedTweet.length) {
                    $isSelectedTweet.parents('.js-column').find('.js-user-button').trigger('click');
                    key = [];
                }
            }

            if (test_keys('alt', 'del')) {
                $('.js-user-buttonAll').trigger('click');
                key = [];
            }
        });
    }

    /* http://stackoverflow.com/questions/5203407/javascript-multiple-keys-pressed-at-once */
    function test_key(selkey){
        var alias = {
            "alt":   18,
            "ctrl":  17,
            "shift": 16,
            "C":     67,
            "del":   46,
        };
        return key[selkey] || key[alias[selkey]];
    }
    function test_keys(){
        var i,
            keylist = arguments,
            status = true;

        for(i = 0; i < keylist.length; i++){
            if(!test_key(keylist[i])){
                status = false;
            }
        }
        return status;
    }


    // Add text Keyboard shortcuts in modal
    var txt  = '<dd class="keyboard-shortcut-definition"><span class="text-like-keyboard-key">Del</span> Clear active column</dd>'
             + '<dd id="js-keyboard-clear" class="keyboard-shortcut-definition"><span class="text-like-keyboard-key">1</span>…<span class="text-like-keyboard-key">9</span> + <span class="text-like-keyboard-key">Del</span>  Clear column 1－9</dd>'
             + '<dd class="keyboard-shortcut-definition"><span class="text-like-keyboard-key">Alt</span> + <span class="text-like-keyboard-key">Del</span> Clear all</dd>';

    function addTextKeyboardShortcuts() {
       $('#open-modal').on("DOMSubtreeModified", function(){
           if (!$('#js-keyboard-clear').length) {
               $('.keyboard-shortcut-list').first().append(txt);
           }
       });
    }

});