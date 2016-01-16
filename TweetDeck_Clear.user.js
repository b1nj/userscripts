// ==UserScript==
// @name    TweetDeck Clear
// @namespace   http://b1nj.fr
// @version 0.6.2
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


function addButtons() {
    var button = '<button style="position: absolute; right: 10px; top: -10px; padding-bottom: 0px;" type="button" class="js-user-button btn btn-alt btn-neutral btn-options-tray padding-hn "> <i class="icon icon-clear-timeline"></i> <span class="label">Clear</span> </button>';
    window.TD_mustaches["column/column_header.mustache"] = window.TD_mustaches["column/column_header.mustache"].replace(' </header>', button + ' </header>');

    $(document).on('click', '.js-user-button', function () {
        clearTweets($(this).parents('.js-column'));
    });
}

function addButtonAll() {
    var buttonAll = '<a type="button" class="js-user-buttonAll padding-hl app-nav-link cf"><div class="obj-left"> <i class="icon icon-clear-timeline"></i> </div> <div class="nbfc padding-ts hide-condensed">Clear all</div> </a>';
    window.TD_mustaches["topbar/app_header.mustache"] = window.TD_mustaches["topbar/app_header.mustache"].replace('</a>   </nav>','</a> ' + buttonAll + ' </nav>');

    $(document).on('click', '.js-user-buttonAll', function () {
        $('.js-user-button').each(function() {
            $(this).trigger('click');
        });
    });
}

function clearTweets($col) {
    $buttonOptions = $('a[data-action="options"]', $col);
    $buttonOptions.trigger('click');
    window.setTimeout(function ($col, $buttonOptions) {
        $('button[data-action="clear"]', $col).trigger('click');
        $buttonOptions.trigger('click');
    }, 1000, $col, $buttonOptions);    
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

function addInfosShortcuts(){
    // Add text Keyboard shortcuts in modal
    var txt  = '<dd class="keyboard-shortcut-definition"><span class="text-like-keyboard-key">Del</span> Clear active column</dd>'
             + '<dd id="js-keyboard-clear" class="keyboard-shortcut-definition"><span class="text-like-keyboard-key">1</span>…<span class="text-like-keyboard-key">9</span> + <span class="text-like-keyboard-key">Del</span>  Clear column 1－9</dd>'
             + '<dd class="keyboard-shortcut-definition"><span class="text-like-keyboard-key">Alt</span> + <span class="text-like-keyboard-key">Del</span> Clear all</dd>';

    window.TD_mustaches["keyboard_shortcut_list.mustache"] = window.TD_mustaches["keyboard_shortcut_list.mustache"].replace('</dl>  <dl', ' ' + txt + ' </dl>  <dl');
}

addButtons();
addButtonAll();
addKeyboardShortcuts();
addInfosShortcuts();
