document.addEventListener('dblclick', () => {
  const selection = document.getSelection();
  const string = selection.toString().trim();

  console.log(string);
  chrome.runtime.sendMessage({selection: string}).catch(console.error)
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);

    if(request.start) {
      const selection = document.getSelection();
      const string = selection.toString().trim();
      chrome.runtime.sendMessage({selection: string}).catch(console.error);
    }
  }
);