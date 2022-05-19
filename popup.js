
  window.addEventListener('load', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    console.log("MESSAGE");
    // inject script
    // SHEEEEESH 💉
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: sendMessage,
    });
  });

  // listen for message from content script
  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      console.log("RECIEVED", request);
      buildUI(request.url);
    })

  function buildUI(response) {
    let column = document.querySelector('.columns')
    // let len = response.data.length;
    column.innerHTML = '';
        // let url = response.data.images.original.url;
        let img = document.createElement('img')
        img.setAttribute('src', response);
        column.appendChild(img)

  }

  function sendMessage() {
    var textInput = '';
    var html = document.createElement("DIV");
    
    //code snippet to get all highlighted text, no matter what type of html tag it is in -- that is why this looks so complicated
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html.innerHTML = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html.innerHTML = document.selection.createRange().htmlText;
        }
    }

    textInput = html.textContent;
    
    console.log(textInput);
    if (textInput != '') {
      const api_key = 'wKTVuOaUTS48IVDju08FuEzZI1p6QIad' // enter your api key
      fetch(`https://api.giphy.com/v1/gifs/translate?s=${textInput}&weirdness=9&api_key=${api_key}`)
        .then(res => res.json())
        .then(jsonData => {
            let url = jsonData.data.images.original.url;
            // send message to background
            chrome.runtime.sendMessage({ url: url});
        })
    }
  }