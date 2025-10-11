import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';  
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { formattedDate } from './utils';

const PomodoroTimer = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [breakCounter, setBreakCounter] = useState(1);
  const [workCounter, setWorkCounter] = useState(1);
  const [totalTime, setTotalTime] = useState(0)
  const [timeLeft, setTimeLeft] = useState(workTime * 60); // converting to seconds


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
    if (!isActive) {
      setTimeLeft((isWorkTime ? workTime : breakTime) * 60);
    }
  }, [workTime, breakTime, isWorkTime, isActive]);


  // When time hits 0, switch modes
  useEffect(() => {
    if (timeLeft !== 0) return;

    setIsWorkTime(prev => !prev);
    setIsActive(false); // auto-pause on mode switch

    if (isWorkTime) {
      setTotalTime(prevTime => +prevTime + Number(workTime));
      setWorkCounter(prev => prev + 1);
      setTimeLeft(breakTime * 60);
    } else {
      setBreakCounter(prev => prev + 1);
      setTimeLeft(workTime * 60);
    }
  }, [timeLeft]);


  useEffect(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const date = formattedDate();  // Get today's date formatted as a string (e.g., "2024-12-13")
      const studySessionRef = doc(db, 'users', userId, 'studySessions', date);
  
      // Check if the document exists
      getDoc(studySessionRef).then((docSnap) => {
        if (docSnap.exists()) {
          // If the document exists, update it
          updateDoc(studySessionRef, { minutesStudied: increment(workTime) }).catch((error) => {
            console.error("Error updating totalTime in Firestore: ", error);
          });
        } else {
          // If the document doesn't exist, create it with an initial value
          setDoc(studySessionRef, { minutesStudied: workTime }).catch((error) => {
            console.error("Error creating totalTime document in Firestore: ", error);
          });
        }
      }).catch((error) => {
        console.error("Error checking document existence: ", error);
      });
    }
  }, [totalTime]);
  /*
  // Update Firestore whenever totalTime changes
  useEffect(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid; // Get the logged-in user's uid
      const date = formattedDate()
      const studySessionRef = doc(db, 'users', userId, 'studySessions', date);

      updateDoc(studySessionRef, { minutesStudied: totalTime }).catch((error) => {
        console.error("Error updating totalTime in Firestore: ", error);
      });
    }
  }, [totalTime]); // Only re-run this effect when totalTime changes
*/

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsActive(prev => !prev);
  };

  // **This still needs to be updated. Maybe replaced with a next button.
  const handleReset = () => {
    setIsActive(false);
    setIsWorkTime(true);
    setTimeLeft(workTime * 60);
    setWorkCounter(1);
    setBreakCounter(1);
    setTotalTime(0);
  };


  return (
    <div className={darkMode ? 'dark-mode' : ''} style={{ textAlign: 'center', marginTop: '50px' }}>
      <input type="checkbox" name="darkMode" onChange={() => setDarkMode(prev => !prev)} /> 
        Dark Mode
      <input type="number" name="workTime" defaultValue="25" onChange={(e) => setWorkTime(Number(e.target.value))} />
        Work Time
      <input type="number" name="breakTime" defaultValue="5" onChange={(e) => setBreakTime(Number(e.target.value))} /> 
        Break Time
      <h1>{isWorkTime ? `Work Time ${workCounter}` : `Break Time ${breakCounter}`}</h1>
      <h2>{formatTime(timeLeft)}</h2>
      <button onClick={handleStartPause}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default PomodoroTimer;
