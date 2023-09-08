(async () => {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  const response = await chrome.tabs.sendMessage(tab.id, {start: true});
})();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    const selection = request.selection;
    const string = selection.toString().trim();
    const app = document.querySelector('#app');
    
    if(app) {
      app.innerHTML = '';
      const url = 'https://www.oxfordlearnersdictionaries.com/definition/american_english/' + string;
      
      fetchData(url);
      
      console.log(url);
    } else {
      console.error('App element is missing');
    }
  }
);

function fetchData(url) {
  fetch(url, {
    credentials: 'include',
  }).then(res => res.text()).then(text => {
    const div = document.createElement('div');
    div.innerHTML = text;

    const styles = div.querySelectorAll('[rel="stylesheet"]');

    app.innerHTML = div.querySelector('.responsive_row').innerHTML;
    app.append(...styles);
    
    const buttons = app.querySelectorAll('.audio_play_button ');

    for (const button of buttons) {
      button.addEventListener('click', playSound);
    }

    app.querySelector('.unbox')?.classList?.add('is-active');

    const anchors = app.querySelectorAll('a');

    for (const anchor of anchors) {
      anchor.addEventListener('click', event => {
        const url = new URL(anchor.href, 'https://www.oxfordlearnersdictionaries.com');
        fetchData(url);
      });
    }
  }).catch(console.log);
}

function playSound(event) {
  const button = event.currentTarget;
  const mp3 = button.dataset.srcMp3;
  const ogg = button.dataset.srcOgg;

  playHtml5(mp3, ogg);
}

function playHtml5(mp3, ogg) {
  let audio = new Audio();

  if (audio.canPlayType("audio/mpeg") != "no" && audio.canPlayType("audio/mpeg") != "")
        audio = new Audio(mp3);
  else if (audio.canPlayType("audio/ogg") != "no" && audio.canPlayType("audio/ogg") != "")
      audio = new Audio(ogg);

  audio.addEventListener('error', console.log);

  audio.play().then(console.log).catch(console.log);
}