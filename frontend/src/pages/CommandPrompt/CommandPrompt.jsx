import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import "./CommandPrompt.css";



/* =====================================================
   BACKEND CONFIGURATION
   ===================================================== */

const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL;


/* =====================================================
   DEFAULT DEVICE
   ===================================================== */

const DEFAULT_DEVICE = {
    name: "Windows SYS 1",
    macAddress: "windows-sys-1",
};


function CommandPrompt() {

    const location = useLocation();
    const navigate = useNavigate();


    /* =====================================================
       DEVICE
       ===================================================== */

    const device =
        location.state?.device ||
        DEFAULT_DEVICE;


    const [command, setCommand] = useState("");
    const [terminalLines, setTerminalLines] = useState([]);

    const [pythonConnected, setPythonConnected] =
        useState(false);

    const [isSending, setIsSending] =
        useState(false);


    const terminalRef = useRef(null);
    const inputRef = useRef(null);
    const wsRef = useRef(null);


    /* =====================================================
       AUTO SCROLL TERMINAL
       ===================================================== */

    useEffect(() => {

        if (terminalRef.current) {

            terminalRef.current.scrollTop =
                terminalRef.current.scrollHeight;

        }

    }, [terminalLines]);


    /* =====================================================
       FOCUS INPUT
       ===================================================== */

    useEffect(() => {

        const timer = setTimeout(() => {

            inputRef.current?.focus();

        }, 100);


        return () => {

            clearTimeout(timer);

        };

    }, []);


    /* =====================================================
       ADD TERMINAL LINE
       ===================================================== */

    const addTerminalLine = (type, text) => {

        if (
            text === undefined ||
            text === null ||
            text === ""
        ) {
            return;
        }


        setTerminalLines((previous) => [

            ...previous,

            {
                type,
                text: String(text),
            },

        ]);

    };


    /* =====================================================
       CHECK PYTHON CLIENT STATUS
       ===================================================== */

    const checkPythonStatus = async () => {

        try {

            const response = await fetch(
                `${API_URL}/commands/status`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );


            const text =
                await response.text();


            let data = {};


            try {

                data = text
                    ? JSON.parse(text)
                    : {};

            } catch {

                data = {};

            }


            if (!response.ok) {

                setPythonConnected(false);

                return;

            }


            setPythonConnected(
                Boolean(data.connected)
            );

        } catch (error) {

            console.error(
                "Python status error:",
                error
            );

            setPythonConnected(false);

        }

    };


    /* =====================================================
       PYTHON STATUS POLLING
       ===================================================== */

    useEffect(() => {

        checkPythonStatus();


        const interval =
            setInterval(() => {

                checkPythonStatus();

            }, 3000);


        return () => {

            clearInterval(interval);

        };

    }, []);


    /* =====================================================
       WEBSOCKET MESSAGE HANDLER
       ===================================================== */

    const handleWebSocketMessage = (event) => {

        try {

            const rawData =
                event.data;


            let data;


            /* =================================================
               PLAIN TEXT MESSAGE
               ================================================= */

            try {

                data =
                    JSON.parse(rawData);

            } catch {

                addTerminalLine(
                    "output",
                    rawData
                );

                setIsSending(false);

                return;

            }


            console.log(
                "WebSocket message:",
                data
            );


            const type =
                data.type || "";


            /* =================================================
               COMMAND OUTPUT
               ================================================= */

            if (
                type === "cmd_output" ||
                type === "command_output" ||
                type === "command-result" ||
                type === "command_result"
            ) {

                const output =
                    data.data ??
                    data.output ??
                    data.message ??
                    "";


                if (output !== "") {

                    addTerminalLine(
                        "output",
                        output
                    );

                }


                setIsSending(false);


                setTimeout(() => {

                    inputRef.current?.focus();

                }, 50);


                return;

            }


            /* =================================================
               COMMAND ERROR
               ================================================= */

            if (
                type === "cmd_error" ||
                type === "command_error" ||
                type === "error"
            ) {

                const error =
                    data.error ??
                    data.data ??
                    data.message ??
                    "Command execution failed.";


                addTerminalLine(
                    "error",
                    error
                );


                setIsSending(false);


                setTimeout(() => {

                    inputRef.current?.focus();

                }, 50);


                return;

            }


            /* =================================================
               COMMAND RESPONSE
               ================================================= */

            if (
                type === "command" &&
                (
                    data.data ||
                    data.output
                )
            ) {

                addTerminalLine(
                    "output",
                    data.data ??
                    data.output
                );


                setIsSending(false);

                return;

            }


            /* =================================================
               GENERIC OUTPUT
               ================================================= */

            if (
                data.data !== undefined &&
                data.data !== null
            ) {

                addTerminalLine(
                    "output",
                    data.data
                );

                return;

            }


            if (
                data.output !== undefined &&
                data.output !== null
            ) {

                addTerminalLine(
                    "output",
                    data.output
                );

                return;

            }

        } catch (error) {

            console.error(
                "WebSocket message handling error:",
                error
            );

        }

    };


    /* =====================================================
       WEBSOCKET CONNECTION
       ===================================================== */

    useEffect(() => {

        let socket;
        let reconnectTimer;


        const connectWebSocket = () => {

            try {

                console.log(
                    "Connecting command WebSocket:",
                    WS_URL
                );


                socket =
                    new WebSocket(WS_URL);


                wsRef.current =
                    socket;


                socket.onopen = () => {

                    console.log(
                        "Command WebSocket connected"
                    );

                };


                socket.onmessage =
                    handleWebSocketMessage;


                socket.onerror = (error) => {

                    console.error(
                        "Command WebSocket error:",
                        error
                    );

                };


                socket.onclose = () => {

                    console.log(
                        "Command WebSocket disconnected"
                    );


                    reconnectTimer =
                        setTimeout(() => {

                            connectWebSocket();

                        }, 3000);

                };

            } catch (error) {

                console.error(
                    "WebSocket connection failed:",
                    error
                );


                reconnectTimer =
                    setTimeout(() => {

                        connectWebSocket();

                    }, 3000);

            }

        };


        connectWebSocket();


        return () => {

            if (reconnectTimer) {

                clearTimeout(
                    reconnectTimer
                );

            }


            if (
                socket &&
                (
                    socket.readyState ===
                        WebSocket.OPEN ||
                    socket.readyState ===
                        WebSocket.CONNECTING
                )
            ) {

                socket.close();

            }


            wsRef.current = null;

        };

    }, []);


    /* =====================================================
       EXECUTE COMMAND
       ===================================================== */

    const executeCommand = async () => {

        const trimmedCommand =
            command.trim();


        if (!trimmedCommand) {

            return;

        }


        /* =================================================
           CHECK PYTHON CONNECTION
           ================================================= */

        if (!pythonConnected) {

            addTerminalLine(
                "error",
                "Python client is not connected."
            );

            return;

        }


        /* =================================================
           PREVENT DUPLICATE COMMAND
           ================================================= */

        if (isSending) {

            return;

        }


        setIsSending(true);


        /* =================================================
           SHOW COMMAND
           ================================================= */

        addTerminalLine(
            "command",
            `C:\\RAT> ${trimmedCommand}`
        );


        setCommand("");


        try {

            console.log(
                "Sending command:",
                trimmedCommand
            );


            const response =
                await fetch(
                    `${API_URL}/commands`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            command:
                                trimmedCommand,
                        }),
                    }
                );


            const responseText =
                await response.text();


            let data = {};


            try {

                data =
                    responseText
                        ? JSON.parse(
                            responseText
                        )
                        : {};

            } catch {

                data = {
                    error:
                        responseText,
                };

            }


            console.log(
                "Command API response:",
                {
                    status:
                        response.status,

                    data,
                }
            );


            /* =================================================
               BACKEND ERROR
               ================================================= */

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    `Command request failed (${response.status})`
                );

            }


            /* =================================================
               COMMAND SENT
               ================================================= */

            addTerminalLine(
                "status",
                data.message ||
                "Command sent successfully. Waiting for output..."
            );


            /*
             * Keep isSending true.
             *
             * It will become false when
             * WebSocket sends the result.
             */

        } catch (error) {

            console.error(
                "Command execution error:",
                error
            );


            addTerminalLine(
                "error",
                error.message ||
                "Unable to send command."
            );


            setIsSending(false);

        } finally {

            setTimeout(() => {

                inputRef.current?.focus();

            }, 50);

        }

    };


    /* =====================================================
       ENTER KEY
       ===================================================== */

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            executeCommand();

        }

    };


    /* =====================================================
       CLEAR TERMINAL
       ===================================================== */

    const clearTerminal = () => {

        setTerminalLines([]);


        setTimeout(() => {

            inputRef.current?.focus();

        }, 0);

    };


    /* =====================================================
       MAIN UI
       ===================================================== */

    return (

        <main className="command-prompt-page">

            <div className="command-prompt-content">


                {/* =================================================
                    HEADER
                   ================================================= */}

                <header className="command-prompt-header">

                    <div>

                        <span className="command-page-label">
                            REMOTE COMMAND
                        </span>


                        <h1>
                            {device.name}
                        </h1>


                        <p>
                            {device.macAddress}
                        </p>

                    </div>


                    <div
                        className="command-header-actions"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                        }}
                    >

                        {/* Python status */}

                        <div
                            className="command-python-status"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "7px",
                            }}
                        >

                            <span
                                style={{
                                    width: "9px",
                                    height: "9px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    background:
                                        pythonConnected
                                            ? "#22c55e"
                                            : "#ef4444",
                                }}
                            />


                            <span>

                                {pythonConnected
                                    ? "RAT Connected"
                                    : "RAT Offline"}

                            </span>

                        </div>


                    

                    </div>

                </header>


                {/* =================================================
                    TERMINAL
                   ================================================= */}

                <section className="command-terminal-container">


                    {/* =================================================
                        TOOLBAR
                       ================================================= */}

                    <div className="command-terminal-toolbar">

                        <div className="command-terminal-title">

                            <span className="command-terminal-dot"></span>

                            Command Prompt

                        </div>


                        <button
                            type="button"
                            className="command-clear-button"
                            onClick={
                                clearTerminal
                            }
                        >
                            Clear
                        </button>

                    </div>


                    {/* =================================================
                        TERMINAL
                       ================================================= */}

                    <div
                        ref={terminalRef}
                        className="command-terminal"
                    >


                        {/* =================================================
                            WELCOME
                           ================================================= */}

                        {terminalLines.length === 0 && (

                            <div className="command-welcome">

                                <div>
                                    RAT Remote
                                    Command Console
                                </div>


                                <div>
                                    Connected
                                    device:
                                    {" "}
                                    {
                                        device.macAddress
                                    }
                                </div>


                                <div>
                                    Python client:
                                    {" "}
                                    {pythonConnected
                                        ? "Connected"
                                        : "Not connected"}
                                </div>


                                <br />

                            </div>

                        )}


                        {/* =================================================
                            TERMINAL OUTPUT
                           ================================================= */}

                        {terminalLines.map(
                            (
                                line,
                                index
                            ) => (

                                <div
                                    key={`${index}-${line.type}`}
                                    className={`terminal-line terminal-line-${line.type}`}
                                >
                                    {line.text}
                                </div>

                            )
                        )}


                        {/* =================================================
                            COMMAND INPUT
                           ================================================= */}

                        <div className="command-input-line">

                            <span className="command-prompt-symbol">
                                C:\RAT&gt;
                            </span>


                            <input
                                ref={
                                    inputRef
                                }
                                type="text"
                                value={
                                    command
                                }
                                onChange={(
                                    event
                                ) =>
                                    setCommand(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                onKeyDown={
                                    handleKeyDown
                                }
                                disabled={
                                    !pythonConnected
                                }
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                placeholder={
                                    pythonConnected
                                        ? "Enter command..."
                                        : "Waiting for Python client..."
                                }
                            />


                            {isSending && (

                                <span
                                    className="command-executing"
                                >
                                    Waiting...
                                </span>

                            )}

                        </div>

                    </div>

                </section>

            </div>

        </main>

    );

}


export default CommandPrompt;