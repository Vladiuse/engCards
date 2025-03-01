function startTimer() {
    // TIMER
    var countDownDate = new Date().getTime();
    var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = Math.round((now - countDownDate) / 1000);
        var insertedTime = INCORRECT_2FA_TIMEOUT - distance;
        document.getElementById("timer").innerHTML = insertedTime + "s ";
        document.getElementById("timer").style.display = 'inline';
        if (insertedTime <= 0) {
            clearInterval(x);
            document.getElementById("timer").style.display = 'none';
            document.getElementById("timer").innerHTML = "EXPIRED";
            unlock2FA()
        }
    }, 1000);
}
function addSvgInLinks() {
    var svg = `
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"
                        class="x1ngqms7 x18sheln x1hyyqv4 x1n2onr6 xrhstn2 xn47u6e">
                        <path
                            d="M6 19h12a1 1 0 0 0 1-1v-5h2v5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h5v2H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1z">
                        </path>
                        <path
                            d="M11.292 11.293 17.586 5H14a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V6.414l-6.293 6.293a1 1 0 0 1-1.414-1.414z">
                        </path>
                    </svg>
    `
    var links = document.querySelectorAll('a.add-svg')
    links.forEach(elem => {
        elem.innerHTML = elem.textContent + svg
    })
}

addSvgInLinks()
document.querySelectorAll('*[data-href]').forEach(elem => {
    elem.addEventListener('click', function (e) {
        var link_elem = e.currentTarget
        var link = link_elem.dataset.href
        window.location.href = link
    })
})

//Events
document.getElementById('termsLink').addEventListener('click', function (e) {
    termsModal.show()
})
document.querySelectorAll('.standartsLink').forEach(elem => {
    elem.addEventListener('click', function (e) {
        standartsModal.show()
    })
})
document.querySelectorAll('.password-input').forEach(elem => {
    elem.addEventListener('click', function (e) {
        if (e.target.id != 'show-hide-pass') {
            var elem = e.currentTarget
            elem.querySelector('input').focus()
        }
    })
})

// HEADER SETTINGS
// setting tool
var headerSettingsBtn = document.getElementById('header-settings')
var settingsWindow = document.getElementById('header-settings-window')
headerSettingsBtn.addEventListener('click', function () {
    if (headerSettingsBtn.classList.contains('active')) {
        headerSettingsBtn.classList.remove('active')
        settingsWindow.style.display = 'none'
        window.removeEventListener('click', closeWindow)
    } else {
        window.addEventListener('click', closeWindow)
        headerSettingsBtn.classList.add('active')
        settingsWindow.style.display = 'flex'


    }
})

function closeWindow(e) {
    console.log(e)
    if (!settingsWindow.contains(e.target) && !headerSettingsBtn.contains(e.target)) {
        console.log('hide bu body')
        headerSettingsBtn.classList.remove('active')
        settingsWindow.style.display = 'none'
        window.removeEventListener('click', closeWindow)
    }
}


// header show/hide sidebar in mobile
const leftBarBlock = document.getElementById('left-bar')
const mainBlock = document.getElementById('main-content')
const openHideLeftBarBlock = document.getElementById('open-close-left-bar-mobile')
const closeLeftBarIcon = '<i class="fa-solid fa-xmark"></i>'
const openLeftBarIcon = '<i class="fa-solid fa-bars"></i>'
var isLeftBarOpen = false
function insertIcon(icon) {
    openHideLeftBarBlock.querySelector('.round-button-wrap').innerHTML = ''
    openHideLeftBarBlock.querySelector('.round-button-wrap').innerHTML = icon
}
function openCloseLeftBar() {
    console.log('click')
    if (!isLeftBarOpen) {
        mainBlock.classList.remove('open')
        mainBlock.classList.add('hide')
        leftBarBlock.classList.add('open')
        isLeftBarOpen = true
        insertIcon(closeLeftBarIcon)
    } else {
        mainBlock.classList.remove('hide')
        mainBlock.classList.add('open')
        leftBarBlock.classList.remove('open')
        isLeftBarOpen = false
        insertIcon(openLeftBarIcon)
    }
}
openHideLeftBarBlock.addEventListener('click', openCloseLeftBar)
