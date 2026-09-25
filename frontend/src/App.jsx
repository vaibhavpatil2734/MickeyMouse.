import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";

import { useState } from "react";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import DeviceDetails from "./pages/DeviceDetails/DeviceDetails";
import CommandPrompt from "./pages/CommandPrompt/CommandPrompt";
import Logs from "./pages/Logs/Logs";

import Navbar from "./pages/Navbar/Navbar";


/* =====================================================
   PROTECTED APPLICATION LAYOUT
   ===================================================== */

function ProtectedLayout({ onLogout }) {
    return (
        <>
            {/* Navbar appears on every protected page */}
            <Navbar onLogout={onLogout} />

            {/* Current page */}
            <Outlet />
        </>
    );
}


/* =====================================================
   PROTECTED ROUTE
   ===================================================== */

function ProtectedRoute({ isLoggedIn }) {
    if (!isLoggedIn) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}


/* =====================================================
   APP
   ===================================================== */

function App() {

    /*
     * Keep login state after page refresh.
     */

    const [isLoggedIn, setIsLoggedIn] = useState(
        () => {
            return (
                localStorage.getItem(
                    "isLoggedIn"
                ) === "true"
            );
        }
    );


    /* =====================================================
       LOGIN
       ===================================================== */

    const handleLogin = () => {

        localStorage.setItem(
            "isLoggedIn",
            "true"
        );

        setIsLoggedIn(true);
    };


    /* =====================================================
       LOGOUT
       ===================================================== */

    const handleLogout = () => {

        localStorage.removeItem(
            "isLoggedIn"
        );

        setIsLoggedIn(false);
    };


    return (
        <BrowserRouter>

            <Routes>

                {/* =================================================
                    LOGIN
                    No Navbar
                   ================================================= */}

                <Route
                    path="/login"
                    element={
                        isLoggedIn ? (
                            <Navigate
                                to="/"
                                replace
                            />
                        ) : (
                            <Login
                                onLogin={
                                    handleLogin
                                }
                            />
                        )
                    }
                />


                {/* =================================================
                    PROTECTED ROUTES
                   ================================================= */}

                <Route
                    element={
                        <ProtectedRoute
                            isLoggedIn={
                                isLoggedIn
                            }
                        />
                    }
                >

                    {/* =================================================
                        NAVBAR LAYOUT
                        Navbar appears on all pages below
                       ================================================= */}

                    <Route
                        element={
                            <ProtectedLayout
                                onLogout={
                                    handleLogout
                                }
                            />
                        }
                    >

                        {/* Managed Devices */}

                        <Route
                            path="/"
                            element={
                                <Home
                                    onLogout={
                                        handleLogout
                                    }
                                />
                            }
                        />


                        {/* Device Details */}

                        <Route
                            path="/device"
                            element={
                                <DeviceDetails />
                            }
                        />


                        {/* Command Prompt */}

                        <Route
                            path="/command"
                            element={
                                <CommandPrompt />
                            }
                        />


                        {/* Logs */}

                        <Route
                            path="/logs"
                            element={
                                <Logs />
                            }
                        />

                    </Route>

                </Route>


                {/* =================================================
                    UNKNOWN ROUTES
                   ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={
                                isLoggedIn
                                    ? "/"
                                    : "/login"
                            }
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;
