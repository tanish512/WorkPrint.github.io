const welcomeScreen = document.getElementById('welcome-screen');
const appScreen = document.getElementById('app-screen');
const choiceScreen = document.getElementById('choice-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const state = {
  location: '',
  part: '',
  plan: [],
  timerSeconds: 300,
  timerRunning: false,
  timerInterval: null
};

const workouts = {
  Home: {
    arms: ['10 minutes of push-ups', '3 sets of chair dips', '2 minutes of arm circles'],
    legs: ['3 sets of bodyweight squats', '2 sets of lunges', '3 sets of calf raises'],
    abs: ['1 minute plank', '20 bicycle crunches', '15 leg raises'],
    back: ['3 sets of supermans', '10 bird dogs each side', '2 minutes of wall slides'],
    chest: ['10 minutes of knee push-ups', '3 sets of bottle press', '30 second chest stretch']
  },
  Gym: {
    arms: ['3 sets of dumbbell curls', '3 sets of tricep pulldown', '2 sets of cable curls'],
    legs: ['3 sets of leg press', '3 sets of hamstring curl', '2 sets of seated calf raise'],
    abs: ['3 sets of cable crunch', '12 hanging knee raises', '30 Russian twists'],
    back: ['3 sets of lat pulldown', '3 sets of seated row', '3 sets of back extensions'],
    chest: ['3 sets of bench press', '3 sets of chest fly', '10 push-ups']
  }
};

const bodyParts = ['Arms', 'Legs', 'Abs', 'Back', 'Chest'];

function show(...elements) {
  [welcomeScreen, appScreen, choiceScreen, quizScreen, resultScreen].forEach(el => {
    el.style.display = 'none';
  });
  elements.forEach(el => {
    el.style.display = 'block';
  });
}

function startApp() {
  state.plan = [];
  state.location = '';
  state.part = '';
  quizScreen.innerHTML = '';
  show(appScreen, choiceScreen);
}

function updateQuiz() {
  quizScreen.innerHTML = `
    <h2>Which body part do you want to work? 💥</h2>
    ${bodyParts.map(part => `<button data-part="${part.toLowerCase()}">${part}</button>`).join('')}
  `;

  show(appScreen, quizScreen);

  quizScreen.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      state.part = button.dataset.part;
      showResult();
    });
  });
}

function showResult() {
  const workoutsForChoice = workouts[state.location][state.part];
  const partName = state.part.charAt(0).toUpperCase() + state.part.slice(1);

  const steps = [];
  workoutsForChoice.forEach((exercise, index) => {
    steps.push(exercise);
    if (index < workoutsForChoice.length - 1) {
      steps.push('Rest 30 seconds');
    }
  });
  steps.push(`Stretch your ${partName.toLowerCase()} for 1 minute`);

  state.plan.push({ part: partName, steps });

  const planItems = state.plan.map(entry => `
      <li><strong>${entry.part}:</strong> ${entry.steps.join(' → ')}</li>
    `).join('');

  const planPanel = document.getElementById('plan-panel');
  planPanel.innerHTML = `
    <h2>✅ ${state.location} plan</h2>
    <p>Your plan so far:</p>
    <ul>${planItems}</ul>
    <p><strong>Next, keep working on ${partName.toLowerCase()} with good form.</strong></p>
    <div class="action-buttons">
      <button id="more-btn">➕ Add more</button>
      <button id="reset-btn">🔄 New routine</button>
    </div>
  `;

  show(appScreen, resultScreen);
  setupTimerControls();
  updateTimerDisplay();
  document.getElementById('more-btn').addEventListener('click', updateQuiz);
  document.getElementById('reset-btn').addEventListener('click', startApp);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateTimerDisplay() {
  document.getElementById('timer-value').textContent = formatTime(state.timerSeconds);
  const mins = Math.floor(state.timerSeconds / 60);
  const timeLabel = mins === 1 ? '1 minute' : `${mins} minutes`;
  document.getElementById('time-label').textContent = timeLabel;
}

function setupTimerControls() {
  const decreaseBtn = document.getElementById('decrease-btn');
  const increaseBtn = document.getElementById('increase-btn');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-timer-btn');
  const doneBtn = document.getElementById('done-btn');

  decreaseBtn.addEventListener('click', () => {
    if (!state.timerRunning && state.timerSeconds >= 60) {
      state.timerSeconds -= 60;
      updateTimerDisplay();
    }
  });

  increaseBtn.addEventListener('click', () => {
    if (!state.timerRunning && state.timerSeconds < 3600) {
      state.timerSeconds += 60;
      updateTimerDisplay();
    }
  });

  startBtn.addEventListener('click', () => {
    if (!state.timerRunning) {
      state.timerRunning = true;
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      decreaseBtn.disabled = true;
      increaseBtn.disabled = true;

      state.timerInterval = setInterval(() => {
        state.timerSeconds--;
        updateTimerDisplay();
        if (state.timerSeconds <= 0) {
          clearInterval(state.timerInterval);
          state.timerRunning = false;
          startBtn.disabled = false;
          pauseBtn.disabled = true;
          alert('⏰ Time\'s up!');
        }
      }, 1000);
    }
  });

  pauseBtn.addEventListener('click', () => {
    if (state.timerRunning) {
      clearInterval(state.timerInterval);
      state.timerRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      decreaseBtn.disabled = false;
      increaseBtn.disabled = false;
    }
  });

  resetBtn.addEventListener('click', () => {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
    }
    state.timerRunning = false;
    state.timerSeconds = 300;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    decreaseBtn.disabled = false;
    increaseBtn.disabled = false;
    updateTimerDisplay();
  });

  doneBtn.addEventListener('click', startApp);
}

welcomeScreen.addEventListener('click', startApp);

choiceScreen.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    state.location = button.dataset.location || button.textContent;
    updateQuiz();
  });
});

