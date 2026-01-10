import React, { useState, useEffect } from "react"
import { Outlet, Link } from "react-router-dom"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../firebaseConfig"
import ResetIcon from "../assets/icons/reset.svg?react";
import SunIcon from "../assets/icons/light_mode.svg?react";
import MoonIcon from "../assets/icons/dark_mode.svg?react";
import RingerOnIcon from "../assets/icons/ringer_on.svg?react";
import RingerOffIcon from "../assets/icons/ringer_off.svg?react";

export default function Layout() {
    const [isAuth, setIsAuth] = useState(null);
    const [isRingerOn, setIsRingerOn] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [resetTick, setResetTick] = useState(0);

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    });
    return () => unsubscribe();
    }, [auth, isAuth]);

    const handleLogout = () => {
        signOut(auth).then(() => {
            setIsAuth(false);
            alert("Sign-out successful.");
        }).catch((error) => {
            alert("An error happened.");
            console.error("Error signing out: ", error);
        });
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    return (
        <>
            <header>
                <Link to="/">Pomodoro Timer</Link>
                <div className="header-right">
                    <Link to="./heatmap">Heat Map</Link>
                    <button className="icon-btn" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Toggle dark mode">
                        {isDarkMode ? (
                            <SunIcon className="header-icon" />
                        ) : (
                            <MoonIcon className="header-icon" />
                        )}
                    </button>
                    <button className="icon-btn" onClick={() => setIsRingerOn(!isRingerOn)} aria-label="Toggle ringer">
                        {isRingerOn ? (
                            <RingerOffIcon className="header-icon" />
                        ) : (
                            <RingerOnIcon className="header-icon" />
                        )}
                    </button>
                    {isAuth ? (
                        <Link onClick={handleLogout}>Log out</Link>
                    ) : (
                        <Link to="/login">Log in</Link>
                    )}
                </div>
            </header>
            <main>
                <Outlet context={{ isAuth, isRingerOn, resetTick, isDarkMode }}/>
            </main>
        </>
    )
}