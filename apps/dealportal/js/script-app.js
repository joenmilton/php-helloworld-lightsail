'use strict';

document.addEventListener("DOMContentLoaded", () => {
    initMetisMenu();
    initCounterNumber();
    initLeftMenuCollapse();
    initActiveMenu();
    initMenuItemScroll();
    initHoriMenuActive();
    initFullScreen();
    initComponents();
    initPreloader();
    layoutSetting();
});

function initMetisMenu() {
    const sideMenu = document.getElementById("side-menu");
    if (sideMenu) new MetisMenu(sideMenu);
}

function initCounterNumber() {
    const counters = document.querySelectorAll('.counter-value');
    const speed = 250;

    counters.forEach(counter => {
        const target = +counter.dataset.target;
        const updateCount = () => {
            let count = +counter.innerText;
            const increment = Math.max(target / speed, 1);
            if (count < target) {
                counter.innerText = (count + increment).toFixed(0);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

function initLeftMenuCollapse() {
    const toggleSidebarSize = () => {
        const currentSize = document.body.dataset.sidebarSize || "lg";
        const newSize = currentSize === "sm" ? "lg" : "sm";
        document.body.dataset.sidebarSize = newSize;
    };

    document.querySelectorAll(".vertical-menu-btn").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            document.body.classList.toggle("sidebar-enable");
            if (window.innerWidth >= 992) toggleSidebarSize();
            else initMenuItemScroll();
        });
    });
}

function initActiveMenu() {
    const pageUrl = window.location.href.split(/[?#]/)[0];
    document.querySelectorAll("#sidebar-menu a").forEach(link => {
        if (link.href === pageUrl) {
            link.classList.add("active");
            let parent = link.parentElement;
            while (parent && parent.id !== "side-menu") {
                parent.classList.add(parent.tagName === "LI" ? "mm-active" : "mm-show");
                parent = parent.parentElement;
            }
        }
    });
}

function initMenuItemScroll() {
    const activeMenu = document.querySelector("#side-menu .mm-active .active");
    if (activeMenu) {
        const offset = Math.max(activeMenu.offsetTop - 100, 0);
        const scrollWrapper = document.querySelector(".vertical-menu .simplebar-content-wrapper");
        if (scrollWrapper) scrollWrapper.scrollTop = offset;
    }
}

function initHoriMenuActive() {
    const pageUrl = window.location.href.split(/[?#]/)[0];
    document.querySelectorAll(".navbar-nav a").forEach(link => {
        if (link.href === pageUrl) {
            link.classList.add("active");
            let parent = link.parentElement;
            while (parent) {
                parent.classList.add("active");
                parent = parent.closest("li");
            }
        }
    });
}

function initFullScreen() {
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
        document.body.classList.toggle('fullscreen-enable');
    };

    document.querySelector('[data-toggle="fullscreen"]')?.addEventListener("click", event => {
        event.preventDefault();
        toggleFullScreen();
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            document.body.classList.remove('fullscreen-enable');
        }
    });
}

function initComponents() {
    // Tooltip
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));

    // Popover
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));

    // Toast
    document.querySelectorAll('.toast').forEach(el => new bootstrap.Toast(el));
}

function initPreloader() {
    const fadeOutEffect = (id, delay) => {
        const element = document.getElementById(id);
        if (element) {
            element.style.opacity = 1;
            const fade = setInterval(() => {
                if ((element.style.opacity -= 0.2) <= 0) {
                    clearInterval(fade);
                    element.style.display = "none";
                }
            }, 200);
        }
    };

    fadeOutEffect('pre-status', 300);
    fadeOutEffect('preloader', 400);
}



function layoutSetting() {
    const rightBarToggle = document.getElementById("right-bar-toggle");
    rightBarToggle?.addEventListener("click", () => {
        document.body.classList.toggle("right-bar-enabled");
    });

    document.addEventListener("click", event => {
        if (!event.target.closest('.right-bar-toggle, .right-bar')) {
            document.body.classList.remove("right-bar-enabled");
        }
    });
}


window.initPasswordAddon = function () {

    // const addon = document.getElementById("password-addon");
    // const passwordInput = document.getElementById("password-input");

    // if (addon && passwordInput) {
    //     addon.addEventListener("click", function () {
    //         if (passwordInput.type === "password") {
    //             passwordInput.type = "text";
    //         } else {
    //             passwordInput.type = "password";
    //         }
    //     });
    // } else {
    //     console.error("Password addon or input element not found.");
    // }



    const addons = document.querySelectorAll('.password-addon');
    const passwordInputs = document.querySelectorAll('.password-input');
    
    addons.forEach((addon, index) => {
        const passwordInput = passwordInputs[index];
        if (addon && passwordInput) {
            addon.addEventListener('click', function () {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                } else {
                    passwordInput.type = 'password';
                }
            });
        }
    });
};

window.initDropdownMenu = function () {
    const menuContent = document.getElementById("topnav-menu-content");
    if (!menuContent) {
        console.error("Menu content not found!");
        return;
    }

    menuContent.addEventListener("click", (event) => {
        const target = event.target;
        if (target.tagName === "A" && target.getAttribute("href") === "#") {
            console.log("Toggle active and show class");
            target.parentElement.classList.toggle("active");
            target.nextElementSibling?.classList.toggle("show");
        }
    });

    window.addEventListener("resize", () => {
        menuContent.querySelectorAll(".nav-item.dropdown.active").forEach((item) => {
            item.classList.remove("active");
            item.querySelector(".show")?.classList.remove("show");
        });
    });
};