const API_KEY = 'AIzaSyBHH78gDxV2O5N_F7ZKxz-E1SNOP82citw';
//const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

const ADD_NOTES_BUTTON_CLICKED_MSG = "ADD_NOTES_BUTTON_CLICKED_MSG"

var observer = new MutationObserver(
    (mutations) => {  
        mutations.forEach(
            () => {
                tabEventDetailsPanel = document.getElementById("tabEventDetails")
                if( tabEventDetailsPanel && !document.getElementById("add_meeting_notes_button") ) {
                    
                    var addMeetingNotesHtml = `
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
                    tabEventDetailsPanel.insertAdjacentHTML('afterbegin', addMeetingNotesHtml);

                    addMeetingNotesButton = document.getElementById("add_meeting_notes_button")
                    
                    // Add event handler
                    addMeetingNotesButton.addEventListener (
                        "click", () => {
                            console.log("addMeetingNotesButton clicked")
                            chrome.runtime.sendMessage(
                                {message:ADD_NOTES_BUTTON_CLICKED_MSG}, (response) => {
                                console.log('addMeetingNotesButton clicked response', response);
                              }
                            );
                        }
                    )
    
                }
            }
        )
    }    
  );

const target = document.querySelector("body");
const config = { childList:true, subtree:true};

// pass in the target node, as well as the observer options
observer.observe(target, config);
/*
<div id="zoom-video-sec" class="FrSOzf zoom-video-sec">	
    <div aria-hidden="true" class="tzcF6">		
        <span class="DPvwYc zmlogo" aria-hidden="true"></span>	
    </div>	
    <div class="j3nyw PxPKzc zoom-btn zoom-button-container">
        <div id="zoom_schedule_button_wrapper">
            <button id="zoom_schedule_button" class="btn-meeting">Make it a Zoom Meeting 1</button>
        </div>
    </div>
</div>
*/