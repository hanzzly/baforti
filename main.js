// ==UserScript==
// @name         TikTok Back & Forward Button
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Tombol back & forward mengambang di TikTok Web, gaya seperti tombol scroll bawaan
// @author       hanzz.
// @match        https://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const BUTTONS = [
        { id: 'tm-back-btn', icon: '←', action: () => history.back() },
        { id: 'tm-forward-btn', icon: '→', action: () => history.forward() },
    ];
    const GAP = 8;
    const OFFSET_TOP = 12;

    function createButton(cfg) {
        if (document.getElementById(cfg.id)) return;

        const btn = document.createElement('button');
        btn.id = cfg.id;
        btn.innerHTML = cfg.icon;

        Object.assign(btn.style, {
            position: 'fixed',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(22, 24, 35, 0.34)',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            lineHeight: '36px',
            textAlign: 'center',
            padding: '0',
            cursor: 'pointer',
            zIndex: '999999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
        });

        btn.onmouseenter = () => btn.style.background = 'rgba(22, 24, 35, 0.6)';
        btn.onmouseleave = () => btn.style.background = 'rgba(22, 24, 35, 0.34)';

        btn.onclick = () => {
            if (cfg.id === 'tm-back-btn' && history.length <= 1) {
                location.href = 'https://www.tiktok.com/';
            } else {
                cfg.action();
            }
        };

        document.body.appendChild(btn);
    }

    function createAllButtons() {
        BUTTONS.forEach(createButton);
    }

    function positionButtons() {
        const backBtn = document.getElementById('tm-back-btn');
        const fwdBtn = document.getElementById('tm-forward-btn');
        if (!backBtn || !fwdBtn) return;

        const navContainer = document.querySelector('[class*="DivFeedNavigationContainer"]');
        const upButton = navContainer ? navContainer.querySelector('button') : null;

        if (upButton) {
            const rect = upButton.getBoundingClientRect();
            const fwdTop = (rect.top - rect.height - OFFSET_TOP) + 'px';
            const backTop = (rect.top - rect.height - OFFSET_TOP - rect.height - GAP) + 'px';

            backBtn.style.top = backTop;
            backBtn.style.left = rect.left + 'px';
            backBtn.style.right = 'auto';

            fwdBtn.style.top = fwdTop;
            fwdBtn.style.left = rect.left + 'px';
            fwdBtn.style.right = 'auto';
        } else {
            // fallback kalau selector TikTok berubah / belum ketemu
            backBtn.style.right = '24px';
            backBtn.style.top = 'calc(40% - 44px)';
            backBtn.style.left = 'auto';

            fwdBtn.style.right = '24px';
            fwdBtn.style.top = '40%';
            fwdBtn.style.left = 'auto';
        }
    }

    function init() {
        createAllButtons();
        positionButtons();
    }

    init();

    const observer = new MutationObserver(() => {
        let missing = BUTTONS.some(cfg => !document.getElementById(cfg.id));
        if (missing) {
            createAllButtons();
        }
        positionButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    window.addEventListener('resize', positionButtons);
})();
