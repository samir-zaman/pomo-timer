import React, { useState, useEffect } from "react"
import { Outlet, Link } from "react-router-dom"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../firebaseConfig"

export default function Layout() {
    const [isAuth, setIsAuth] = useState(null);

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
                <nav>
                    {isAuth ? (
                        <Link onClick={handleLogout}>Log out</Link>
                    ) : (
                        <Link to="/login">Log in</Link>
                    )}
                    {/* put nav links here, e.g. <Link to="/about">About</Link> */}
                </nav>
            </header>
            <Outlet context={{isAuth}}/>
        </>
    )
}