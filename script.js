// Game Logic

// Global Constants
const CLUE_HOLD_TIME = 1000; // how long the btn will be held when clues start
const CLUE_PAUSE_TIME = 333; // how long to pause b/w clues
const NEXT_CLUE_WAIT_TIME = 1000; // how long to wait before playing sequence

const CHANCES = 3; // max number of wrong attempts
const NUM_BTN = 5; // the number of colored buttons

// Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4]; // the order that the btns will light up
var progress = 0; // tracker for the player's progress in game
var gamePlaying = false; // tracker if game is active
var tonePlaying = false;
var volume = 0.5; // must be b/w 0.0 and 1.0

var guessCounter = 0; // tracks player's guess progress
var incorrectCounter = 0; // tracks Player's wrong guesses

function startGame() 
{
  //initialize game variables
  progress = 0;
  incorrectCounter = 0;
  gamePlaying = true;
  
  getRandomPattern()
  console.log("Pattern: "+ pattern);

  // swap the visibility of Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  // Actually start the game
  playClueSequence();
}

function stopGame() 
{
  gamePlaying = false;

  // swap the visibility of Start and Stop buttons
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
}

// Win/Lose Messages/Events
function loseGame()
{
  stopGame();
  alert( "Game Over. You Lost." );
}

function winGame()
{
  stopGame();
  alert( "Game Over. YOU WON!" );
}

// Btn lighting functions
// Makes Btn change color defined in the css btn#.lit
function lightBtn(num) 
{
  document.getElementById("btn" + num).classList.add("lit");
}

// Makes Btn change color defined in the css btn# defaults
function clearButton(num) 
{
  document.getElementById("btn" + num).classList.remove("lit");
}

// Clue functions
// Plays the tone and lights up a single btn
function playSingleClue(btn) 
{
  if (gamePlaying) 
  {
    lightBtn(btn);
    playTone(btn, CLUE_HOLD_TIME);
    setTimeout(clearButton, CLUE_HOLD_TIME, btn);
  }
}

// Plays multiple clues depending on progess
function playClueSequence() 
{
  guessCounter = 0; // Reset before every guess sequence
  let delay = NEXT_CLUE_WAIT_TIME; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) 
  {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += CLUE_HOLD_TIME;
    delay += CLUE_PAUSE_TIME;
  }
}

function guess(btn)
{
  console.log("User guessed: "+ btn);
  if (!gamePlaying) // if the game isn't active, get out of here
  {
      return;
  }
  
  // Do Game Logic
  // if the guess is correct
  if(btn == pattern[guessCounter])
  {
      guessCounter++;
      
      // if player guessed entire sequence
      if ( guessCounter > progress )
      {
          // increment progress in game
          progress++;
        
          // if player guessed entire sequence
          if ( progress >= pattern.length )
          {
              // The player won the game
              winGame();
          }
          else // else the game isn't over so play clues
          {
            playClueSequence();
          }
      }
      
  }
  else // the guess was wrong
  {
      // increment the number of wrong guesses by Player
      incorrectCounter++;
      
      // if the number of wrong guesses are greater than number of chances
      if ( incorrectCounter >= CHANCES )
      {
          //End the game. Player Lost
          loseGame();
      }
      else // the game isn't over so replay sequence
      {
          playClueSequence();    
      }
  }
}

// helper function to create a random pattern
function getRandomPattern()
{
  var n = pattern.length; // the size of the array
  
  // LOOP thru each entry of the array
  for( let i = 0; i < n; i++ )
  {
      var element = Math.floor(Math.random() * ((NUM_BTN+1) - 1) + 1);
      pattern[i] = element;
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 526.4
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
