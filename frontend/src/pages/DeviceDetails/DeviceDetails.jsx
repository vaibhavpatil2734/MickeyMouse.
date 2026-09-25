import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import DeviceUtilityBar from "../DeviceUtilityBar/DeviceUtilityBar";
import "./DeviceDetails.css";

function DeviceDetails() {
    const location = useLocation();
    const navigate = useNavigate();

    const device = location.state?.device;

    if (!device) {
        return (
            <>

                <main className="device-details-page device-not-found">
                    <div className="device-not-found-content">
                        <h2>Device not found</h2>

                        <p>
                            Please select a managed device first.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                        >
                            ← Managed Devices
                        </button>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>


            <main className="device-details-page">
                <div className="device-details-content">

                    <header className="device-page-header">

                        <div className="device-header-left">
                            <div>
                                <span className="device-page-label">
                                    DEVICE OVERVIEW
                                </span>

                                <h1>{device.name}</h1>

                                <p>{device.macAddress}</p>
                            </div>
                        </div>

                        <div className="device-header-actions">

                            <div
                                className={`device-status device-status-${device.status}`}
                            >
                                <span className="device-status-dot"></span>

                                {device.status}
                            </div>

                            <button
                                type="button"
                                className="device-managed-devices-button"
                                onClick={() => navigate("/")}
                            >
                                ← Managed Devices
                            </button>

                        </div>
                    </header>


                    <section className="device-information-grid">

                        {/* Device Information */}

                        <div className="device-info-card">

                            <div className="device-info-card-header">

                                <div className="device-info-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect
                                            x="3"
                                            y="4"
                                            width="18"
                                            height="13"
                                            rx="2"
                                        />
                                        <path d="M8 21h8" />
                                        <path d="M12 17v4" />
                                    </svg>
                                </div>

                                <div>
                                    <h2>Device Information</h2>
                                    <p>Basic device details</p>
                                </div>

                            </div>

                            <div className="device-info-row">
                                <span>Name</span>
                                <strong>{device.name}</strong>
                            </div>

                            <div className="device-info-row">
                                <span>MAC Address</span>
                                <strong className="monospace">
                                    {device.macAddress}
                                </strong>
                            </div>

                            <div className="device-info-row">
                                <span>IP Address</span>
                                <strong className="monospace">
                                    {device.ipAddress}
                                </strong>
                            </div>

                            <div className="device-info-row">
                                <span>Device Type</span>
                                <strong>{device.deviceType}</strong>
                            </div>

                            <div className="device-info-row">
                                <span>Status</span>

                                <strong
                                    className={`inline-status inline-status-${device.status}`}
                                >
                                    {device.status}
                                </strong>
                            </div>

                        </div>


                        {/* Operating System */}

                        <div className="device-info-card">

                            <div className="device-info-card-header">

                                <div className="device-info-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect
                                            x="3"
                                            y="3"
                                            width="18"
                                            height="18"
                                            rx="2"
                                        />
                                        <path d="M12 3v18" />
                                        <path d="M3 12h18" />
                                    </svg>
                                </div>

                                <div>
                                    <h2>Operating System</h2>
                                    <p>Platform and software details</p>
                                </div>

                            </div>

                            <div className="device-info-row">
                                <span>Operating System</span>
                                <strong>{device.operatingSystem}</strong>
                            </div>

                            <div className="device-info-row">
                                <span>OS Version</span>
                                <strong>{device.osVersion}</strong>
                            </div>

                            <div className="device-info-row">
                                <span>Agent Version</span>
                                <strong>{device.agentVersion}</strong>
                            </div>

                            <div className="device-info-row">
                                <span>Managed Since</span>
                                <strong>{device.managedSince}</strong>
                            </div>

                            <div className="device-info-row">
                                <span>Last Seen</span>
                                <strong>{device.lastSeen}</strong>
                            </div>

                        </div>


                        {/* Hardware */}

                        <div className="device-info-card">

                            <div className="device-info-card-header">

                                <div className="device-info-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect
                                            x="4"
                                            y="4"
                                            width="16"
                                            height="16"
                                            rx="2"
                                        />
                                        <rect
                                            x="8"
                                            y="8"
                                            width="8"
                                            height="8"
                                            rx="1"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <h2>Hardware</h2>
                                    <p>Hardware configuration</p>
                                </div>

                            </div>

                            <div className="device-info-row">
                                <span>Processor</span>
                                <strong>{device.processor}</strong>
                            </div>

                            <div className="device-info-row">
                                <span>Memory</span>
                                <strong>{device.memory}</strong>
                            </div>

                            <div className="device-info-row">
                                <span>Storage</span>
                                <strong>{device.storage}</strong>
                            </div>

                        </div>

                    </section>

                </div>
            </main>
        </>
    );
}

export default DeviceDetails;