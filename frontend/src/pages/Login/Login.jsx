import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        setError("");

        if (!username.trim() || !password) {
            setError("Please enter username and password.");
            return;
        }

        // Temporary frontend-only login.
        // This will be replaced with backend authentication later.
        if (
            username.trim() === "MickeyMouse" &&
            password === "MickeyMouse"
        ) {
            onLogin();
            return;
        }

        setError("Invalid username or password.");
    };

    return (
        <div className="login-page">

            {/* Background */}
            <div className="login-background">
                <div className="background-grid"></div>
                <div className="background-shape background-shape-one"></div>
                <div className="background-shape background-shape-two"></div>
            </div>

            {/* Login Card */}
            <main className="login-container">

                <section className="login-card">

                    {/* Logo */}
                    <div className="login-header">

                        <div className="login-logo">
                            R
                        </div>

                        <div className="login-brand">
                            <h1>RAT</h1>
                            <p>Management Portal</p>
                        </div>

                    </div>

                    {/* Title */}
                    <div className="login-title">
                        <h2>Welcome back</h2>

                        <p>
                            Sign in to continue to your dashboard.
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >

                        {/* Username */}
                        <div className="form-group">

                            <label htmlFor="username">
                                Username
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            cx="12"
                                            cy="7"
                                            r="4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />

                                        <path
                                            d="M20 21a8 8 0 0 0-16 0"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>

                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(event) => {
                                        setUsername(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                />

                            </div>

                        </div>

                        {/* Password */}
                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="5"
                                            y="10"
                                            width="14"
                                            height="10"
                                            rx="2"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />

                                        <path
                                            d="M8 10V7a4 4 0 0 1 8 0v3"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="login-error">
                                <span className="error-icon">
                                    !
                                </span>

                                <span>
                                    {error}
                                </span>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="login-button"
                        >
                            Sign In
                        </button>

                    </form>

                    {/* Footer */}
                    <div className="login-footer">
                        RAT Management Portal
                    </div>

                </section>

            </main>

        </div>
    );
}

export default Login;
