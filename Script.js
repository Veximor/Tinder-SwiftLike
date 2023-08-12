// ==UserScript==
// @name         Tinder SwiftLike
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automates liking on Tinder. Mutes audio, clears distractions, and continually clicks the like button. Features a draggable menu to control auto-like.
// @author       @Veximor
// @match        *://tinder.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //--------------- IMPROVED UI -------------------
    var removeSelfieVerificationMenu = function() {
        var menu1 = document.querySelector('#catalog-page > section:nth-child(1) > section > div > div > span > section > div > div');
        var menu2 = document.querySelector('#catalog-page > section:nth-child(1) > section > div > div > span > section > div');
        if (menu1) {
            menu1.remove();
            console.log("Removed Selfie Verification Menu 1");
        }
        if (menu2) {
            menu2.remove();
            console.log("Removed Selfie Verification Menu 2");
        }
    };

    setInterval(removeSelfieVerificationMenu, 0);

    var removeAnnoyingMenu = function() {
        var annoyingMenu = document.querySelector('div[class="Pos(f) H(30%) D(f) Fxd(c) W(100%) B(0) Wc($transform) M(a) Z(1) Trstf(eo) Trsdu($normal) TranslateY(0)"]');
        if (annoyingMenu) {
            annoyingMenu.remove();
            console.log("Removed annoying menu");
        }
    };

    setInterval(removeAnnoyingMenu, 0);

    //--------------- END UI -------------------

    var muteAudio = function() {
        var audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.volume = 0;
        });
    };

    var closeSuperLike = function() {
        var noThanksButton = document.querySelector('button[class="c1p6lbu0 D(b) My(20px) Mx(a)"]');
        if (noThanksButton) {
            noThanksButton.click();
            console.log("Closed Super Like dialog");
        }
    };
    
    var clickMaybeLater = function() {
        var maybeLaterButton = document.querySelector('button[class="button Lts($ls-s) Z(0) CenterAlign Mx(a) Cur(p) Tt(u) Ell Bdrs(100px) Px(24px) Px(20px)--s Py(0) Mih(40px) C($c-light-gray) C($c-gray):h Fw($semibold) focus-button-style D(b) My(20px) Mx(a)"]');
        if (maybeLaterButton) {
           maybeLaterButton.click();
           console.log("Closed Mabye Later dialog");
        }
    };
    
    var like = function() {
        closeSuperLike();
        clickMaybeLater();
        muteAudio();
        var likeButton = [...document.querySelectorAll('button[type="button"]')].find(
            button => button.innerHTML.includes('M21.994 10.225c0-3.598-2.395-6.212-5.72-6.212-1.78 0-2.737')
        );
        if (likeButton) {
            likeButton.click();
        } else {
            console.log("Like button not found");
        }
    };

    var autoLikeInterval;

    var menuHTML = `
        <div id="autoLikeMenu" style="position: fixed; top: 10px; left: 10px; background-color: #333; padding: 10px; border-radius: 5px; z-index: 9999999; box-shadow: 0 0 10px rgba(0,0,0,0.5); color: #FFF;">
            <h4 style="margin: 0; font-size: 16px;">Auto Like Menu</h4>
            <div style="display: flex; align-items: center; margin-top: 8px;">
                <label for="autoLikeSwitch" style="margin-right: 10px; font-size: 14px;">Auto Like:</label>
                <div id="autoLikeSwitch" style="width: 40px; height: 20px; background-color: red; border-radius: 10px; position: relative; cursor: pointer;">
                    <div id="autoLikeToggle" style="width: 18px; height: 18px; background-color: #FFF; border-radius: 50%; position: absolute; left: 1px; top: 1px;"></div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', menuHTML);

    var menu = document.getElementById('autoLikeMenu');
    var menuLeft = localStorage.getItem('menuLeft');
    var menuTop = localStorage.getItem('menuTop');
    if (menuLeft && menuTop) {
        menu.style.left = menuLeft;
        menu.style.top = menuTop;
    }

    menu.addEventListener('mousedown', function(e) {
        var offsetX = e.clientX - menu.offsetLeft;
        var offsetY = e.clientY - menu.offsetTop;
        function mouseMoveHandler(e) {
            menu.style.left = e.clientX - offsetX + 'px';
            menu.style.top = e.clientY - offsetY + 'px';
            localStorage.setItem('menuLeft', menu.style.left);
            localStorage.setItem('menuTop', menu.style.top);
        }
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', mouseMoveHandler);
        }, {once: true});
    });

    var autoLikeSwitch = document.getElementById('autoLikeSwitch');
    var autoLikeToggle = document.getElementById('autoLikeToggle');
    autoLikeSwitch.addEventListener('click', function() {
        if (autoLikeToggle.style.left === '1px') {
            autoLikeInterval = setInterval(like, 100);
            autoLikeToggle.style.left = '21px';
            autoLikeSwitch.style.backgroundColor = 'green';
        } else {
            clearInterval(autoLikeInterval);
            autoLikeToggle.style.left = '1px';
            autoLikeSwitch.style.backgroundColor = 'red';
            autoLikeInterval = null;
        }
    });
})();
