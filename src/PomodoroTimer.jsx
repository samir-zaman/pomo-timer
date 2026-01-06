import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { db, auth } from './firebaseConfig';  
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { formattedDate } from './utils';

const PomodoroTimer = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [breakCounter, setBreakCounter] = useState(1);
  const [workCounter, setWorkCounter] = useState(1);
  const [timeLeft, setTimeLeft] = useState(workTime * 60); // converting to seconds

  const { isRingerOn, resetTick } = useOutletContext();
  const alarm = useMemo(() => new Audio('/sounds/alarm.mp3'), []);

  //Helper function for Firestore logic
  const saveStudySession = (minutesCompleted) => {
    if (auth.currentUser && minutesCompleted > 0) {
      const userId = auth.currentUser.uid;
      const date = formattedDate();
      const studySessionRef = doc(db, 'users', userId, 'studySessions', date);

      // Check if the document exists (for the very first session of the day)
      getDoc(studySessionRef).then((docSnap) => {
        if (docSnap.exists()) {
          // If the document exists, atomically update it
          updateDoc(studySessionRef, { minutesStudied: increment(minutesCompleted) }).catch((error) => {
            console.error("Error updating study time in Firestore: ", error);
          });
        } else {
          // If the document doesn't exist, create it with the initial value
          setDoc(studySessionRef, { minutesStudied: minutesCompleted }).catch((error) => {
            console.error("Error creating study time document in Firestore: ", error);
          });
        }
      }).catch((error) => {
        console.error("Error checking document existence for study session: ", error);
      });
    }
  };


  // Start/stop the countdown
  useEffect(() => {
    let timer;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // watches for user input changes
  useEffect(() => {
    if (!isActive && !isPaused) {
      setTimeLeft((isWorkTime ? workTime : breakTime) * 60);
    }
  }, [workTime, breakTime, isWorkTime, isActive, isPaused]);


// When time hits 0, switch modes and save the session time
  useEffect(() => {
    if (timeLeft !== 0) return;

    setIsWorkTime(prev => !prev); // Switch from work to break, or break to work
    setIsActive(false); // auto-pause on mode switch

    if (isRingerOn) {
      alarm.currentTime = 0; // Reset to start in case it's clicked rapidly
      alarm.play().catch(error => console.error("Audio playback failed:", error));
    }

    if (isWorkTime) {
      // Save the completed session to firestore
      saveStudySession(workTime); 

      // Update local state counters and set the next timer.
      setWorkCounter(prev => prev + 1);
      setTimeLeft(breakTime * 60);
    } else {
      setBreakCounter(prev => prev + 1);
      setTimeLeft(workTime * 60);
    }
    
  }, [timeLeft, isRingerOn, alarm]);

  useEffect(() => {
    if (resetTick > 0) {
      handleFullReset();
    }
  }, [resetTick]);


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = () => {
    alarm.play().then(() => {
      alarm.pause();
      alarm.currentTime = 0;
    }).catch(() => { /* Ignore initial block */ });
    setIsActive(true);
    setIsPaused(false); // Starting means it's definitely not paused
  };

  const handlePause = () => {
    setIsActive(false); // Stops the countdown
    setIsPaused(true);  // Marks the state as paused
  };
  
  // Resets the CURRENT session (work or break) back to its full time.
  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false); // Reset means the paused state is cleared
    setTimeLeft((isWorkTime ? workTime : breakTime) * 60);
  };

  // Resets the entire timer back to Work Session 1
  const handleFullReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsWorkTime(true);
    setTimeLeft(workTime * 60);
    setWorkCounter(1);
    setBreakCounter(1);
  };


  const renderButtons = () => {
    // If active (running), show Pause and Reset
    if (isActive) {
      return (
        <>
          <button className="timer-button" onClick={handlePause}>Pause</button>
          <button className="timer-button" onClick={handleReset}>Reset</button>
        </>
      );
    // If paused OR idle, show Start (clicking start handles both cases)
    } else {
      return (
        <button className='timer-button' onClick={handleStart}>Start</button>
      );
    }
  }


  return (
    <div className={darkMode ? 'dark-mode' : ''} style={{ textAlign: 'center', marginTop: '50px' }}>
      <input type="checkbox" name="darkMode" onChange={() => setDarkMode(prev => !prev)} /> 
        Dark Mode
      <input type="number" name="workTime" value={workTime} onChange={(e) => setWorkTime(Number(e.target.value))} />
        Work Time
      <input type="number" name="breakTime" value={breakTime} onChange={(e) => setBreakTime(Number(e.target.value))} /> 
        Break Time
      <h1>{isWorkTime ? `Work Time ${workCounter}` : `Break Time ${breakCounter}`}</h1>
      <h2>{formatTime(timeLeft)}</h2>
      <div>
        {renderButtons()}
      </div>
    </div>
  );
};

export default PomodoroTimer;