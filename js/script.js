
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