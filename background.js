
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


const copyNotesDocTemplate = async (notesTemplateDocId, meetingTitle, targetFolderId) => {
  console.log(`copyNotesDocTemplate: ${notesTemplateDocId} ${meetingTitle} ${targetFolderId}`);
  
  try {
    
    const res = await gapi.client.drive.files.copy(
      {
        fileId: notesTemplateDocId,
        resource: {
          name: meetingTitle + " Meeting Notes",
          parents:[targetFolderId]
        } 
      }
    );

    console.log(`Done!: ${JSON.stringify(res)}`)
    return res;
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

  return await copyNotesDocTemplate("1WX8GXmSmq1lWJ992jZ4Wwsg8oiZL9-YwxOc_2iQ8eOI",meetingTitle,"1gl7XMIbtTolHBdOfMcfMjZwnQFgoElbK");
}


/**
 * Listen for messages from content script
 */
chrome.extension.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log(`Message received: ${JSON.stringify(request)}`);
     // setGapiToken();
  
    console.log("Message received 2");
    //listFiles2();
    console.log("Message received 3");

    //sendResponse({meetingNotesDocUrl: await handleAddNotesButtonClicked(request.meetingTitle)});
    //return true;
   
    
    handleAddNotesButtonClicked(request.meetingTitle).
      then( (result)=>{
      sendResponse({meetingNotesDocUrl: getGoogleDocUrlForId(result.result.id)});
    });
    
    return true;
    /*
    switch(request.message) {
      case ADD_NOTES_BUTTON_CLICKED_MSG: 
        const result = await handleAddNotesButtonClicked(request.meetingTitle);

        console.log(`File id: ${getGoogleDocUrlForId(result.result.id)}`)
        sendResponse({meetingNotesDocUrl:getGoogleDocUrlForId(result.result.id)})
    }
    sendResponse({meetingNotesDocUrl:"foo"});
    */

  }
);

const getGoogleDocUrlForId = (googleFileId) => {
  return `https://docs.google.com/document/d/${googleFileId}/edit?usp=sharing`
}

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