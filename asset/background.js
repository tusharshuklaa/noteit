
/* Setting badge to default, i.e.empty in beginning */
chrome.browserAction.setBadgeText({ text: "" });

/* Checks if current URL is authorized for usage of extension */
function isUnauthorizedUrl(url, notify) {
    if ((url.indexOf('http://') != 0 && url.indexOf('https://') != 0) || url.indexOf('https://chrome.google.com/') == 0) {
        if (notify)
            alert('You are not allowed to save notes on this page!');
        return true;
    }
    else
        return false;
}


/* Litsener to check click on extsn, checks if this URL has to be skipped, displays note */
chrome.browserAction.onClicked.addListener(function (tab) {
    if (!isUnauthorizedUrl(tab.url, true))
        initNotes();
});

var storage = chrome.storage.local;

function notesPresent() {
    return false;
}

function getCurrentTabUrl() {  
  chrome.tabs.query({'active': true, 'currentWindow': true}, function(tabs) {
    return tabs[0].url;
  });
}

function newNote() {
    var note = document.createElement('div');
    note.classname = 'noteIt_' + new Date().getTime();

    var noteHead = document.createElement('div');
    noteHead.classname = 'noteHead';
    var addNote = document.createElement('span');
    addNote.classname = 'addNote';

    var noteAction = document.createElement('span');
    noteAction.classname = 'noteAction';
    var noteInfoBtn = document.createElement('span');
    noteInfoBtn.classname = 'noteInfoBtn';
    var closeNote = document.createElement('span');
    closeNote.classname = 'closeNote';

    var noteContent = document.createElement('div');
    noteContent.classname = 'noteContent';
    noteContent.setAttribute('contenteditable', true);
    noteContent.addEventListener('keyup', saveNote(this), false);

    var noteInfo = document.createElement('div');
    noteInfo.classname = 'noteInfo';

    noteHead.appendChild(addNote);
    noteAction.appendChild(noteInfoBtn);
    noteAction.appendChild(closeNote);
    noteHead.appendChild(noteAction);
    
    note.appendChild(noteHead);
    note.appendChild(noteContent);
    note.appendChild(noteInfo);

    document.body.appendChild(note);
}

function initNotes() {
    var notesPresent = notesPresent();
    if(notesPresent) {
        showNotes();
    } else {
        newNote();
    }
}

function saveNote(elem) {
    var noteText = elem.textContent;
    storage.set({ 'css': cssCode }, function() {
        // Notify that we saved.
        message('Settings saved');
    });
}