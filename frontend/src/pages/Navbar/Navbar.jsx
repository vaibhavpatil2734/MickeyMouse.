
import "./Navbar.css";
import {
    useLocation,
    useNavigate,
} from "react-router-dom";


function Navbar({ onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();


    const isActive = (path) => {
        return location.pathname === path;
    };


    return (
        <nav className="navbar">

            {/* =====================================================
                LEFT - BRAND
               ===================================================== */}

            <button
                type="button"
                className="navbar-brand-button"
                onClick={() => navigate("/")}
                aria-label="MickeyMouse RAT Portal"
            >

                <div className="navbar-mickey-icon">

                    <span className="mickey-ear mickey-ear-left"></span>

                    <span className="mickey-ear mickey-ear-right"></span>

                    <span className="mickey-head"></span>

                </div>


                <div className="navbar-brand">

                    <span className="navbar-brand-name">
                        MickeyMouse
                    </span>

                    <span className="navbar-brand-subtitle">
                        RAT Portal
                    </span>

                </div>

            </button>


            {/* =====================================================
                CENTER - NAVIGATION
               ===================================================== */}

            <div className="navbar-navigation">


                {/* DEVICES */}

                <button
                    type="button"
                    className={`navbar-link ${
                        isActive("/")
                            ? "navbar-link-active"
                            : ""
                    }`}
                    onClick={() => navigate("/")}
                    title="Managed Devices"
                >

                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <rect
                            x="3"
                            y="4"
                            width="18"
                            height="14"
                            rx="2"
                        />

                        <path d="M8 21h8" />

                        <path d="M12 18v3" />
                    </svg>

                    <span>
                        Devices
                    </span>

                </button>


                {/* TERMINAL */}

                <button
                    type="button"
                    className={`navbar-link ${
                        isActive("/command")
                            ? "navbar-link-active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate("/command")
                    }
                    title="Remote Terminal"
                >

                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <rect
                            x="3"
                            y="4"
                            width="18"
                            height="16"
                            rx="2"
                        />

                        <path d="m7 9 3 3-3 3" />

                        <path d="M13 15h4" />
                    </svg>

                    <span>
                        Terminal
                    </span>

                </button>


                {/* LOGS */}

                <button
                    type="button"
                    className={`navbar-link ${
                        isActive("/logs")
                            ? "navbar-link-active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate("/logs")
                    }
                    title="Activity Logs"
                >

                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M6 3h9l3 3v15H6z" />

                        <path d="M14 3v4h4" />

                        <path d="M9 11h6" />

                        <path d="M9 15h6" />
                    </svg>

                    <span>
                        Logs
                    </span>

                </button>

            </div>


            {/* =====================================================
                RIGHT - USER
               ===================================================== */}

            <div className="navbar-right">


                {/* NOTIFICATIONS */}

                <button
                    type="button"
                    className="navbar-icon-button"
                    title="Notifications"
                    aria-label="Notifications"
                >

                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

                        <path d="M10 21h4" />
                    </svg>

                    <span className="notification-dot"></span>

                </button>


                <div className="navbar-divider"></div>


                {/* USER */}

                <div className="navbar-user">

                    <div className="navbar-avatar">
                        A
                    </div>

                    <div className="navbar-user-details">

                        <span className="navbar-user-name">
                            Admin
                        </span>

                        <span className="navbar-user-role">
                            Administrator
                        </span>

                    </div>

                </div>


                {/* LOGOUT */}

                <button
                    type="button"
                    className="navbar-logout"
                    onClick={onLogout}
                    title="Logout"
                >

                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />

                        <path d="m14 8 4 4-4 4" />

                        <path d="M9 12h9" />
                    </svg>

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </nav>
    );
}


export default Navbar;

