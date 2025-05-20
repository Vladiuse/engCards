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
