const API_KEY = 'AIzaSyBHH78gDxV2O5N_F7ZKxz-E1SNOP82citw';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const MEETING_NOTES_ANCHOR_ID = "meetingNotesAnchor"

const ADD_NOTES_BUTTON_CLICKED_MSG = "ADD_NOTES_BUTTON_CLICKED_MSG";

const getMeetingNotesTitle = () => {
   return document.getElementById("xTiIn").getAttribute("data-initial-value")
}

const getEventDetailsTabPanel = () => {
    return document.getElementById("tabEventDetails");
}

const getAddMeetingNotesButton = () => {
    return document.getElementById("add_meeting_notes_button_container");
}

const getMeetingDescriptionEl = () => {
    return document.getElementById("T2Ybvb0");
}

const getMeetingNotesAnchor = () => {
    return document.getElementById(MEETING_NOTES_ANCHOR_ID);
}
const getAddMeetingNotesHtml = () => {
    return `
        <div id="add_meeting_notes_button_container" class="FrSOzf zoom-video-sec">	
            <div aria-hidden="true" class="tzcF6">		
                <span class="DPvwYc zmlogo" aria-hidden="true"></span>	
            </div>	
            <div class="j3nyw PxPKzc zoom-btn zoom-button-container">
                <div id="add_meeting_notes_button_wrapper">
                    <button id="add_meeting_notes_button" class="btn-meeting">Add Meeting Notes</button>
                </div>
            </div>
        </div>
    `;
}

const removeAddDescriptionDiv = () => {
    addDescriptionDiv = getAddDescriptionDiv();
    console.log(`addDescriptionDiv: ${addDescriptionDiv}`);
    if(addDescriptionDiv) {
        addDescriptionDiv.remove();
    }
}

/*<div jsname="V67aGc" class="iSSROb snByac" aria-hidden="false">Add description</div>*/
const getAddDescriptionDiv = () => {
    const nodeList = document.querySelectorAll("div[jsname='V67aGc']");
    if(nodeList && nodeList[0]) {
        return nodeList[0];
    }
    
}

const addNotesDocToMeetingDescription = (meetingNotesDocUrl) => {

    removeAddDescriptionDiv();

    getMeetingDescriptionEl().insertAdjacentHTML('afterbegin', 
    `<div>Meeting Notes: <a id='${MEETING_NOTES_ANCHOR_ID}' href='${meetingNotesDocUrl}'>${meetingNotesDocUrl}</a><div>` 
    );
}
const removeAddMeetingNotesButton = () => {
    addMeetingNoteButton = getAddMeetingNotesButton();
    if(addMeetingNoteButton) {
        addMeetingNoteButton.remove();
    }
}

const insertAddMeetingNotesButton = (eventDetailsTabPanel) => {
    console.log(`insertAddMeetingNotesButton`);
    eventDetailsTabPanel.insertAdjacentHTML('afterbegin', getAddMeetingNotesHtml() );

    addMeetingNotesButton = document.getElementById("add_meeting_notes_button")
    
    // Add event handler
    getAddMeetingNotesButton().addEventListener (
        "click", () => {
            console.log("addMeetingNotesButton clicked")
            chrome.runtime.sendMessage(
                {
                    message:ADD_NOTES_BUTTON_CLICKED_MSG,
                    meetingTitle: getMeetingNotesTitle()
                }, 
                (response) => {
                    console.log('addMeetingNotesButton clicked response', response);
                    if(response.meetingNotesDocUrl) {
                        console.log(`getMeetingNotesTitle: ${getMeetingNotesTitle()}`);
                        addNotesDocToMeetingDescription(response.meetingNotesDocUrl)
                    } else {

                    }
                }
            );
        }
    )
}
/**
 * Document mutation obeserver
 */
var observer = new MutationObserver(
    (mutations) => {  
        mutations.forEach(
            () => {
                console.log("mutation");
                const eventDetailsTabPanel = getEventDetailsTabPanel();
                if( getEventDetailsTabPanel() ) {
                    if( getMeetingNotesAnchor() ) {
                        if(getAddMeetingNotesButton()) {
                            removeAddMeetingNotesButton();
                        }
                    } else {
                        if( !getAddMeetingNotesButton() ) {
                            insertAddMeetingNotesButton(eventDetailsTabPanel);
                        }
                    }
                }
            }
        )
    }    
  );

const target = document.querySelector("body");
const config = { childList:true, subtree:true};

// Initialize the DOM mutation observer
observer.observe(target, config);
