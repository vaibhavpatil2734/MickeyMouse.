import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeviceUtilityBar.css";

function DeviceUtilityBar({ device }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const navigate = useNavigate();

    const utilities = [
        {
            id: "overview",
            label: "Overview",
            icon: "⌂",
        },
        {
            id: "logs",
            label: "Logs",
            icon: "▤",
        },
        {
            id: "command",
            label: "Command Prompt",
            icon: ">_",
        },
    ];

    const toggleUtilityBar = () => {
        setIsExpanded((previous) => !previous);
    };

    const handleUtilityClick = (utility) => {
        if (utility.id === "overview") {
            navigate("/device", {
                state: {
                    device,
                },
            });

            return;
        }

        if (utility.id === "logs") {
            navigate("/logs", {
                state: {
                    device,
                },
            });

            return;
        }

        if (utility.id === "command") {
            navigate("/command", {
                state: {
                    device,
                },
            });

            return;
        }
    };

    return (
        <>
            {isExpanded && (
                <div
                    className="utility-overlay"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            <aside
                className={`device-utility-bar ${
                    isExpanded ? "expanded" : "collapsed"
                }`}
            >
                <button
                    type="button"
                    className="utility-toggle"
                    onClick={toggleUtilityBar}
                    aria-label={
                        isExpanded
                            ? "Collapse utility bar"
                            : "Expand utility bar"
                    }
                >
                    <span>
                        {isExpanded ? "‹" : "☰"}
                    </span>
                </button>

                <div className="utility-items">
                    {utilities.map((utility) => (
                        <button
                            type="button"
                            key={utility.id}
                            className="utility-button"
                            onClick={() =>
                                handleUtilityClick(utility)
                            }
                        >
                            <span className="utility-icon">
                                {utility.icon}
                            </span>

                            {isExpanded && (
                                <span className="utility-label">
                                    {utility.label}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </aside>
        </>
    );
}

export default DeviceUtilityBar;