
const API_KEY = 'AIzaSyBHH78gDxV2O5N_F7ZKxz-E1SNOP82citw';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const CLIENT_ID="370393194814-avjjeu46inmjr38cku9312crolphgftt.apps.googleusercontent.com";

const SCOPE=chrome.runtime.getManifest().oauth2.scopes.join(' ');
const ADD_NOTES_BUTTON_CLICKED_MSG = "ADD_NOTES_BUTTON_CLICKED_MSG";

/**
 * Initialize google api client
 */

onGAPILoad = async () => {
  console.log("Initializing gapi");
  
  await gapi.client.init(
    {
      apiKey: API_KEY,
      discoveryDocs: DISCOVERY_DOCS
    }
  );
  console.log("gapi initialized");

  await setGapiToken();
  
  listFiles();
  
}

/**
 * Gets the token for the current chrome user
 * NOTE: Not guaranteed to google user logged into calendar
 */
const getChromeUserToken = () => 
  new Promise(
    (resolve) => {
      chrome.identity.getAuthToken(
        {interactive: true},
        (token) => {
          console.log(`Chrome user token is: ${token}`)
          resolve(token)
        }
      )
    }
  );



/**
 * Gets the user oauth token
 */
const getUserToken = async () => {
  const token = await getChromeUserToken();
  console.log(`User token: ${token}`)
  return token;
}

/**
 * Sets the google api client token
 */
const setGapiToken = async () => {
  const token = await getUserToken();
  console.log(`Setting gapi token to: ${token}`);

  // Set the gapi token
  gapi.auth.setToken({
    'access_token': token,
  });
}


const copyNotesDocTemplate = async (notesTemplateDocId, meetingTitle, targetFolder) => {
  console.log(`copyNotesDocTemplate: ${notesTemplateDocId} ${meetingTitle} ${targetFolder}`);
  
  try {
    
    const res = await gapi.client.drive.files.copy(
      {
        fileId:"1WX8GXmSmq1lWJ992jZ4Wwsg8oiZL9-YwxOc_2iQ8eOI",
        resource: {name:"foo" }
      }
    );

    console.log(`Done!`)
  }catch(e) {
    console.log(`Exception: ${e}`)
  }

  // console.log(`result: ${JSON.stringify(result)}`);
}

/**
 * Handle the add notes button clicked
 */
const handleAddNotesButtonClicked = async (meetingTitle) => {
  console.log(`handleAddNotesButtonClicked: ${meetingTitle}`);

  setGapiToken();

  copyNotesDocTemplate("","","");
}


/**
 * Listen for messages from content script
 */
chrome.extension.onMessage.addListener(
  async (request, sender, sendResponse) => {
    console.log(`Message received: ${JSON.stringify(request)}`);
     // setGapiToken();
  
    console.log("Message received 2");
    //listFiles2();
    console.log("Message received 3");

    
    switch(request.message) {
      case ADD_NOTES_BUTTON_CLICKED_MSG: 
        handleAddNotesButtonClicked(request.meetingTitle);
    }

    sendResponse({meetingNotesDocUrl:"https://docs.google.com/document/d/1maJ77iB7zUAF_7oXbLh5oEWNzqpDXLB72b7jPNVHTOA/edit?usp=sharing"})
    
    
  }
);

const listFiles = async () => {
  console.log("Listing files")
  response = await gapi.client.drive.files.list(
    {
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)"
    }
  );

  response.result.files.forEach(
    (file)  => {
      console.log(`${file.name} (${file.id})`)
    }
  ); 
}