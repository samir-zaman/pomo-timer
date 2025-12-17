import React, { useState, useEffect } from "react"
import { Outlet, Link } from "react-router-dom"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../firebaseConfig"
import ResetIcon from "../icons/reset.svg?react";
import SunIcon from "../icons/light_mode.svg?react";
import MoonIcon from "../icons/dark_mode.svg?react";
import RingerOnIcon from "../icons/ringer_on.svg?react";
import RingerOffIcon from "../icons/ringer_off.svg?react";

export default function Layout() {
    const [isAuth, setIsAuth] = useState(null);
    const [isRingerOn, setIsRingerOn] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

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
    return (
        <>
            <header>
                <Link to="/">Pomodoro Timer</Link>
                <Link to="./heatmap">Heat Map</Link>

                <button className="icon-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
                    {isDarkMode ? (
                        <SunIcon className="header-icon" />
                    ) : (
                        <MoonIcon className="header-icon" />
                    )}
                </button>

                <button className="icon-btn" onClick={() => setIsRingerOn(!isRingerOn)}>
                    {isRingerOn ? (
                        <RingerOnIcon className="header-icon" />
                    ) : (
                        <RingerOffIcon className="header-icon" />
                    )}
                </button>

                <button className="icon-btn">
                    <ResetIcon className="header-icon" />
                </button>

                <div>
                    {isAuth ? (
                        <Link onClick={handleLogout}>Log out</Link>
                    ) : (
                        <Link to="/login">Log in</Link>
                    )}
                    {/* put nav links here, e.g. <Link to="/about">About</Link> */}
                </div>
            </header>
            <Outlet context={{isAuth}}/>
        </>
    )
}