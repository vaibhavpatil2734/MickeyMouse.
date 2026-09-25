import Navbar from "../Navbar/Navbar";
import ManagedDevice from "../ManagedDevice/ManagedDevice";

import "./Home.css";

function Home({ onLogout }) {

    /*
     * Temporary frontend data.
     *
     * Later this will come from the backend.
     */
    const managedDevices = [
        {
            macAddress: "00:1A:2B:3C:4D:5E",
            name: "MacBook Pro",
            status: "online",
            ipAddress: "192.168.1.101",
            operatingSystem: "macOS",
            osVersion: "15.6",
            deviceType: "Laptop",
            lastSeen: "Just now",
            agentVersion: "1.0.0",
            managedSince: "September 1, 2026",
            processor: "Apple M3 Pro",
            memory: "18 GB",
            storage: "512 GB",
        },
        {
            macAddress: "00:1A:2B:3C:4D:6F",
            name: "MacBook Air",
            status: "online",
            ipAddress: "192.168.1.102",
            operatingSystem: "macOS",
            osVersion: "15.6",
            deviceType: "Laptop",
            lastSeen: "2 minutes ago",
            agentVersion: "1.0.0",
            managedSince: "September 2, 2026",
            processor: "Apple M2",
            memory: "16 GB",
            storage: "256 GB",
        },
        {
            macAddress: "00:1A:2B:3C:4D:7A",
            name: "Office Mac",
            status: "offline",
            ipAddress: "192.168.1.103",
            operatingSystem: "macOS",
            osVersion: "14.7",
            deviceType: "Desktop",
            lastSeen: "2 hours ago",
            agentVersion: "0.9.8",
            managedSince: "August 28, 2026",
            processor: "Apple M1",
            memory: "16 GB",
            storage: "512 GB",
        },
    ];

    return (
        <div className="home-page">


            <main className="home-content">

                <section className="home-heading">

                    <div>
                        <span className="home-label">
                            RAT
                        </span>

                        <h1>
                            Managed Devices
                        </h1>

                        <p>
                            View and manage all registered devices.
                        </p>
                    </div>

                    <div className="device-count">

                        <span className="device-count-number">
                            {managedDevices.length}
                        </span>

                        <span className="device-count-label">
                            Devices
                        </span>

                    </div>

                </section>

                <section className="managed-devices-section">

                    <div className="managed-devices-list">

                        {managedDevices.map((device) => (
                            <ManagedDevice
                                key={device.macAddress}
                                device={device}
                            />
                        ))}

                    </div>

                    {managedDevices.length === 0 && (
                        <div className="no-devices">

                            <div className="no-devices-icon">
                                +
                            </div>

                            <h2>
                                No managed devices
                            </h2>

                            <p>
                                There are currently no devices
                                registered in the system.
                            </p>

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}

export default Home;