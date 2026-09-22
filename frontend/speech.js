// Speech to text input and read aloud, both through the browser's own Web Speech API (FR13, FR14)
// Ref: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API


// speech to text
const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

function toggleSpeechToText() {
  const micBtn = document.getElementById('mic-btn');
  if (!SpeechRecognitionImpl) {
    showError("Speech input isn't supported in this browser. Try typing instead.");
    return;
  }
  if (isListening && recognition) {
    recognition.stop();
    return;
  }

  recognition = new SpeechRecognitionImpl();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add('listening');
  };
  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = 0; i < event.results.length; i += 1) transcript += event.results[i][0].transcript;
    chatInput.value = transcript;
  };
  recognition.onerror = () => {
    isListening = false;
    micBtn.classList.remove('listening');
  };
  recognition.onend = () => {
    isListening = false;
    micBtn.classList.remove('listening');
  };
  recognition.start();
}


// read plan aloud
function makeReadAloudButton() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'icon-btn';
  btn.setAttribute('aria-label', 'Read plan aloud');
  btn.title = 'Read plan aloud';
  btn.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
  btn.addEventListener('click', () => toggleReadAloud(btn));
  return btn;
}

function toggleReadAloud(btn) {
  if (!window.speechSynthesis) {
    showError("Read-aloud isn't supported in this browser.");
    return;
  }
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    btn.classList.remove('active');
    return;
  }

  // Only reads the milestone on screen, not the whole plan
  const milestone = getCurrentMilestone();
  const parts = [appState.hierarchy.goal.title, milestone.title];
  milestone.tasks.forEach((task) => {
    parts.push(task.title);
    task.subtasks.forEach((subtask) => parts.push(subtask.title));
  });

  const utterance = new SpeechSynthesisUtterance(parts.join('. '));
  utterance.onend = () => btn.classList.remove('active');
  btn.classList.add('active');
  speechSynthesis.speak(utterance);
}
