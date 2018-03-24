// Default parameters for the Pomodoro timer
const INITIAL_SESSION_LENGTH = 25;
const INITIAL_BREAK_LENGTH = 5;

// Main 
$(document).ready(function() {
	// Document Variables
	const alarm = new Audio("./sounds/alarm.flac");

	const clockState = {
		"stopped": 0,
		"playing": 1, 
		"paused": 2
	}

	const controlButtons = document.getElementsByClassName("controlButton");

	// Stores the session and break length set by user
	let sessionLength = INITIAL_SESSION_LENGTH;
	let breakLength = INITIAL_BREAK_LENGTH; 

	// Save clock status information 
	let currentState = clockState.stopped;

	// Used by different methods to access the timer
	let timer = null;

	// Display initial session length 
	$('#clockText').text(getElapsedTime(sessionLength * 60));

	// Enable buttons after page loads
	enableControlButtons();
	enableDurationButtons();

	// Add functionality to: play, pause, stop, restart buttons
	function enableDurationButtons() {
		$('#sessionDown').on("click", function() {
			decreaseSession();
			$('#sessionLength').text(sessionLength);
		});

		$('#sessionUp').on("click", function() {
			increaseSession();
			$('#sessionLength').text(sessionLength);
		});

		$('#breakDown').on("click", function() { 
			decreaseBreak();
			$('#breakLength').text(breakLength);
		});

		$('#breakUp').on("click", function() { 
			increaseBreak()
			$('#breakLength').text(breakLength);
		});

		function decreaseSession() {
			if (sessionLength > 1) {
				sessionLength--;
			}
		}

		function increaseSession() {
			if (sessionLength < 60) {
				sessionLength++;
			}
		}

		function decreaseBreak() {
			if (breakLength > 1) {
				breakLength--;
			}
			$('#breakLength').text(breakLength);
		}

		function increaseBreak() {
			if (breakLength < 60) {
				breakLength++;
			}
			$('#breakLength').text(breakLength);
		}
	}

	// Add functionality to: play, pause, stop, restart buttons 
	function enableControlButtons() {
		for (let i = 0; i < controlButtons.length; ++i) {
			controlButtons[i].addEventListener("click", function() {
				stateHandler(controlButtons[i].id);
			});
		}
	}

	// Selects the appropriate action based on countdown timer's current state
	function stateHandler(id) {
		switch(currentState) {
			case 0: 
				stoppedAction(id);
				break;
			case 1:
				playingAction(id);
				break;
			case 2:
				pausedAction(id);
				break;
		}
	}

	// Options during stopped state
	function stoppedAction(id) {
		console.log("State: " + currentState + ", Id: " + id);
		if (id === "play") {
			currentState = clockState.playing;
			startTimer(false);
		} else if (id === "pause" || id === "stop") {
			// Nothing
		} else if (id === "restart") {
			// Reset session length and break length
			restart();
			currentState = clockState.stopped;
		} else {
			// Error
		}
	}

	// Options during playing state
	function playingAction(id) {
		console.log("State: " + currentState + ", Id: " + id);
		if (id === "play") {
			// Nothing
		} else if (id === "pause") {
			// Pause the timer
			pauseTimer();
		} else if (id === "stop") {
			// Stop the timer
			stopTimer();
		} else if (id === "restart") {
			// Reset session length and break length
			restart();
		} else {
			// Error
		}
	}

	// Options during paused state
	function pausedAction(id) {
		console.log("State: " + currentState + ", Id: " + id);
		if (id === "play") {
			// Resume the timer
			currentState = clockState.playing;
		} else if (id === "pause") {
			// Nothing
		} else if (id === "stop") {
			// Stop the timer
			stopTimer();
		} else if (id === "restart") {
			// Reset session length and break length
			restart(); 
		} else {
			// Error
		}
	}

	// Begin counting down from user selected session length
	function startTimer(breakFlag) {
		let duration = breakFlag ? breakLength * 60 : sessionLength * 60;
		timer = setInterval(countdown, 1000);

		function countdown() {
			if (currentState === clockState.playing) {
				duration--;

				// At the end of a session or break cycle 
				// play the alarm and switch to the other cycle
				if (duration < 0 ) {
					alarm.play();
					clearInterval(timer);
					breakFlag = breakFlag ? false : true;
					startTimer(breakFlag);
					return;
				}

				$('#clockText').text(getElapsedTime(duration));
			}
		}
	}

	// Formats the number of seconds left into "min:sec" format
	function getElapsedTime(seconds) {
		function formatDigits(num) {
			return (num < 10 ? "0" : "") + num;
		}

		displayMinute = formatDigits(Math.floor(seconds / 60));
		displaySecond = formatDigits(Math.floor(seconds % 60));

		return displayMinute + ":" + displaySecond;
	}

	// Change the clock's state to halt the countdown timer
	function pauseTimer() {
		currentState = clockState.paused;
	}

	function stopTimer() {
		clearInterval(timer);
		$('#clockText').text(getElapsedTime(sessionLength * 60));
		currentState = clockState.stopped;
	}

	function restart() {
		// Reset variables
		sessionLength = INITIAL_SESSION_LENGTH;
		breakLength = INITIAL_BREAK_LENGTH;
		$('#sessionLength').text(sessionLength);
		$('#breakLength').text(breakLength);

		stopTimer();
	}
});