function OpenForm(){
    console.log(123)
    firstModal.show()
}

// accodrion
var itemLinkTemp = `
<div class="item-link {{collapsed}}">
    <div class="item-inner">
        <div class="item-link-content">
            <div class="icon-wrap">
                <i class="_img_pack_{{pach_num}}" style="background-position: {{icon_pos}};"></i>
            </div>
            <div class="text-block">
                <{{text_tag}}>{{text}}</{{text_tag}}>
            </div>
        </div>
        <div class="arrow-block" style="display: {{arrow_display}}">
            <i class="_img_pack_5 w-24" style="background-position: 0 -1476px;"></i>
        </div>
    </div>
</div>
`

var accordionData = [
    {
        'ID':'a-1','collapsed':'collapsed','pach_num':2,'icon_pos': '0px -294px', 'text': 'Using Facebook','arrow_display':'flex','child': [
            {'pach_num':4,'icon_pos': '0px -426px', 'text': 'Creating an Account','arrow_display':'none'},
            {'pach_num':5,'icon_pos': '0px -5975px', 'text': 'Your Profile','arrow_display':'flex'},
            {'pach_num':6,'icon_pos': '0px -385px', 'text': 'Friending','arrow_display':'flex'},
            {'pach_num':5,'icon_pos': '0px -5177px', 'text': 'Facebook Dating','arrow_display':'none'},
            {'pach_num':5,'icon_pos': '0px -5807px', 'text': 'Your Home Page','arrow_display':'flex'},
            {'pach_num':6,'icon_pos': '0px -532px', 'text': 'Messaging','arrow_display':'flex'},
            {'pach_num':2,'icon_pos': '0px -42px', 'text': 'Reels','arrow_display':'flex'},
            {'pach_num':2,'icon_pos': '0px -714px', 'text': 'Stories','arrow_display':'flex'},
            {'pach_num':2,'icon_pos': '0px -252px', 'text': 'Photos','arrow_display':'flex'},
            {'pach_num':6,'icon_pos': '0px -700px', 'text': 'Videos','arrow_display':'flex'},
            {'pach_num':2,'icon_pos': '0px -63px', 'text': 'Gaming','arrow_display':'flex'},
            {'pach_num':2,'icon_pos': '0px -84px', 'text': 'Pages','arrow_display':'flex'},
            {'pach_num':6,'icon_pos': '0px -427px', 'text': 'Groups','arrow_display':'flex'},
            {'pach_num':3,'icon_pos': '0px -292px', 'text': 'Events','arrow_display':'flex'},
            {'pach_num':2,'icon_pos': '0px -483px', 'text': 'Fundraisers and Donations','arrow_display':'flex'},
            {'pach_num':5,'icon_pos': '0px -5219px', 'text': 'Meta Pay','arrow_display':'flex'},
            {'pach_num':3,'icon_pos': '0px -712px', 'text': 'Marketplace','arrow_display':'flex'},
            {'pach_num':2,'icon_pos': '0px -105px', 'text': 'Apps','arrow_display':'flex'},
            {'pach_num':2,'icon_pos': '0px -378px', 'text': 'Facebook Mobile Apps','arrow_display':'flex'},
            {'pach_num':5,'icon_pos': '0px -5051px', 'text': 'Accessibility','arrow_display':'none'},
            
        ]
    },
    {
        'ID':'a-2','collapsed':'collapsed','pach_num':5,'icon_pos': '0 -6017px', 'text': 'Managing Your Account','arrow_display':'flex','child': [
            {'pach_num':2,'icon_pos': '0px -546px', 'text': 'Login and Password','arrow_display':'flex'},
            {'pach_num':2,'icon_pos': '0px -609px', 'text': 'Account Settings','arrow_display':'flex'},
            {'pach_num':2,'icon_pos': '0px -399px', 'text': 'Names on Facebook','arrow_display':'none'},
            {'pach_num':6,'icon_pos': '0px -238px', 'text': 'Notifications','arrow_display':'flex'},
            {'pach_num':2,'icon_pos': '0px 0px', 'text': 'Ad Preferences','arrow_display':'flex'},
            {'pach_num':4,'icon_pos': '0px -342px', 'text': 'Accessing & Downloading Your Information','arrow_display':'none'},
            {'pach_num':6,'icon_pos': '0px -301px', 'text': 'Deactivating or Deleting Your Account','arrow_display':'none'},
            {'pach_num':5,'icon_pos': '0px -5534px', 'text': "Managing a Deceased Person's Account",'arrow_display':'flex'},
            
        ]
    },
    {
        'ID':'a-3','collapsed':'collapsed','pach_num':3,'icon_pos': '0px -733px', 'text': 'Privacy, Safety and Security','arrow_display':'flex','child': [
        {'pach_num':3,'icon_pos': '0px -733px', 'text': 'Your Privacy','arrow_display':'flex'},
        {'pach_num':6,'icon_pos': '0px -469px', 'text': 'Staying Safe','arrow_display':'flex'},
        {'pach_num':6,'icon_pos': '0px -679px', 'text': 'Keeping Your Account Secure','arrow_display':'flex'},
        {'pach_num':2,'icon_pos': '0px -693px', 'text': 'Shopping Safety','arrow_display':'flex'},
        
        ]
    },
    {
        'ID':'a-4','collapsed':'collapsed','pach_num':4,'icon_pos': '0px -468px', 'text': 'Policies and Reporting','arrow_display':'flex','child': [
        {'pach_num':4,'icon_pos': '0px -468px', 'text': 'Contact Form','arrow_display':'none', 'active': true},
        {'pach_num':4,'icon_pos': '0px -279px', 'text': 'Reporting a Problem with Facebook','arrow_display':'none'},
        {'pach_num':4,'icon_pos': '0px -342px', 'text': 'Australia Online Safety Act on Facebook','arrow_display':'none'},
        {'pach_num':2,'icon_pos': '0px -399px', 'text': 'Being Your Authentic Self on Facebook','arrow_display':'none'},
        {'pach_num':5,'icon_pos': '0px -5933px', 'text': 'Reporting a Privacy Violation','arrow_display':'none'},
        {'pach_num':5,'icon_pos': '0px -5933px', 'text': 'Hacked and Fake Accounts','arrow_display':'none'},
        {'pach_num':2,'icon_pos': '0px -357px', 'text': 'Intellectual Property','arrow_display':'flex'},
        {'pach_num':2,'icon_pos': '0px -420px', 'text': 'About Our Policies','arrow_display':'none'},
        
        ]
    },
]

var accordion = document.getElementById('accordion')
function createAccordion(){
    accordionData.forEach(item => {
        var ID = item['ID']
        var accordionItemBlock = document.createElement('div')
        accordionItemBlock.classList.add('accordion-item')
        var accordionItem = itemLinkTemp;
        for (const [key, value] of Object.entries(item)){
            accordionItem = accordionItem.replace(`{{${key}}}`, value)
        }
        accordionItem = accordionItem.replace(`{{text_tag}}`, 'h4')
        accordionItemBlock.innerHTML = accordionItem.trim()
        var accaccordionItem = accordionItemBlock.querySelector('.item-link')
        accaccordionItem.setAttribute('data-bs-toggle', 'collapse')
        accaccordionItem.setAttribute('data-bs-target', '#' + ID)
        accaccordionItem.setAttribute('aria-expanded', 'true')
        accaccordionItem.setAttribute('aria-controls', ID)

        var accordionChildBlock = document.createElement('div')
        accordionChildBlock.id = ID
        accordionChildBlock.classList.add('accordion-collapse')
        accordionChildBlock.classList.add('collapse')
        if (!item['collapsed']){
            accordionChildBlock.classList.add('show')  //SHOW
        }
        
        accordionChildBlock.setAttribute('aria-labelledby', 'headingTwo')
        accordionChildBlock.setAttribute('data-bs-parent', '#accordion')
        accordionChildBlockBody = document.createElement('div')
        accordionChildBlockBody.classList.add('accordion-body')
        accordionChildBlockBody.classList.add('123123123')
        accordionChildBlockBody.addEventListener('click', OpenForm)

        addChildToAccordion(accordionChildBlockBody, item['child'])
        accordionChildBlock.appendChild(accordionChildBlockBody)
        accordionItemBlock.appendChild(accordionChildBlock)
        accordionItem = accordion.appendChild(accordionItemBlock)
    })
}

function addChildToAccordion(parentElem, childsData){
    for (let i = 0; i < childsData.length; i++){
        var childData  = childsData[i]
        var child = itemLinkTemp
        for (const [key, value] of Object.entries(childData)){
            child = child.replace(`{{${key}}}`, value)
        }
        console.log(childData['active'])
        if (childData['active']){
            child = child.replace(`{{collapsed}}`, 'active')
        }
        child = child.replace(`{{text_tag}}`, 'p')
        parentElem.insertAdjacentHTML('beforeend', child)
     }
}
createAccordion()

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
