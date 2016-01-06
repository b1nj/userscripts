// ==UserScript==
// @name    TweetDeck Clear
// @namespace   http://b1nj.fr
// @version 0.4
// @icon https://ton.twimg.com/tweetdeck-web/web/assets/logos/favicon.3d5d8f1cbe.ico
// @description Add buttons to tweetdeck for clear all tweets or column tweets
// @match   https://tweetdeck.twitter.com/*
// @match   http://tweetdeck.twitter.com/*
// @match   https://www.tweetdeck.twitter.com/*
// @match   http://www.tweetdeck.twitter.com/*
// @grant       none
// @copyright   Benjamin Simon
// @license GPL version 3 or any later version; www.gnu.org/copyleft/gpl.htm
// ==/UserScript==

$(function() {

    window.setTimeout(addButtons, 5000);

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

});