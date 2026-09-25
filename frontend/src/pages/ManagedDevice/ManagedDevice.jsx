import { useNavigate } from "react-router-dom";

import "./ManagedDevice.css";

function ManagedDevice({ device }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/device", {
            state: {
                device,
            },
        });
    };

    const status = device?.status || "offline";

    return (
        <button
            type="button"
            className="managed-device-card"
            onClick={handleClick}
        >
            <div className="managed-device-left">

                {/* Mickey Mouse style icon */}
                <div
                    className="managed-device-icon"
                    aria-hidden="true"
                >
                    <svg
                        viewBox="0 0 48 48"
                        width="28"
                        height="28"
                    >
                        <circle
                            cx="14"
                            cy="14"
                            r="9"
                            fill="currentColor"
                        />

                        <circle
                            cx="34"
                            cy="14"
                            r="9"
                            fill="currentColor"
                        />

                        <circle
                            cx="24"
                            cy="28"
                            r="14"
                            fill="currentColor"
                        />
                    </svg>
                </div>

                {/* Device information */}
                <div className="managed-device-information">

                    <div className="managed-device-name">
                        {device?.name || "Unknown Device"}
                    </div>

                    <div className="managed-device-mac">
                        {device?.macAddress || "MAC address unavailable"}
                    </div>

                </div>

            </div>

            <div className="managed-device-right">

                <span
                    className={`managed-device-status managed-device-status-${status}`}
                >
                    <span className="managed-device-status-dot"></span>

                    {status}
                </span>

                <span
                    className="managed-device-arrow"
                    aria-hidden="true"
                >
                    <svg
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="m9 18 6-6-6-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>

            </div>
        </button>
    );
}

export default ManagedDevice;