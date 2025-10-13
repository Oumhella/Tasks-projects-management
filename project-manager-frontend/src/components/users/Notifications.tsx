import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { keycloak } from "../../config/Keycloak";

const KeycloakAwareNotifications = () => {
    const clientRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [authStatus, setAuthStatus] = useState<string>("Initializing...");
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const maxRetries = 5;
    const retryCount = useRef(0);

    const connectWebSocket = async () => {
        try {
            // Multiple ways to check if Keycloak is ready and authenticated
            const isKeycloakReady = keycloak &&
                keycloak.authenticated !== undefined &&
                keycloak.authenticated === true;

            if (!isKeycloakReady) {
                retryCount.current++;

                if (retryCount.current <= maxRetries) {
                    setAuthStatus(`Waiting for authentication... (${retryCount.current}/${maxRetries})`);
                    console.log(`Keycloak not ready yet, retry ${retryCount.current}/${maxRetries}`);
                    console.log("Keycloak state:", {
                        authenticated: keycloak?.authenticated,
                        token: keycloak?.token ? "present" : "missing",
                        tokenParsed: keycloak?.tokenParsed ? "present" : "missing"
                    });

                    // Exponential backoff
                    const delay = Math.min(1000 * Math.pow(2, retryCount.current - 1), 10000);
                    retryTimeoutRef.current = setTimeout(connectWebSocket, delay);
                    return;
                } else {
                    setAuthStatus("Max retries reached - authentication failed");
                    console.error("Max retries reached, giving up on WebSocket connection");
                    return;
                }
            }

            // Reset retry count on successful auth check
            retryCount.current = 0;
            setAuthStatus("Authenticated - connecting to WebSocket...");

            // Ensure we have a fresh token
            const refreshed = await keycloak.updateToken(30);
            console.log(refreshed ? "Token refreshed" : "Token still valid");

            const token = keycloak.token;
            if (!token) {
                throw new Error("No Keycloak token found after authentication check!");
            }

            console.log("Token info:", {
                tokenLength: token.length,
                tokenStart: token.substring(0, 20) + "...",
                username: keycloak.tokenParsed?.preferred_username
            });

            // Disconnect existing connection if any
            if (clientRef.current && clientRef.current.connected) {
                clientRef.current.deactivate();
            }

            const wsUrl = `http://localhost:8081/ws?access_token=${token}`;
            console.log("Attempting WebSocket connection to:", wsUrl.replace(token, "TOKEN_HIDDEN"));

            const client = new Client({
                webSocketFactory: () => new SockJS(wsUrl),
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                debug: (str) => {
                    console.log("STOMP Debug:", str);
                },

                onConnect: (frame) => {
                    console.log("✅ Connected to WebSocket", frame);
                    setIsConnected(true);
                    setAuthStatus("Connected to WebSocket");

                    // Subscribe to topic notifications (broadcast to all)
                    client.subscribe("/topic/notifications", (message) => {
                        if (message.body) {
                            try {
                                const activity = JSON.parse(message.body);
                                console.log("📢 New activity (topic):", activity);
                                showNotification(activity);
                            } catch (e) {
                                console.error("Error parsing notification:", e);
                            }
                        }
                    });

                    // Subscribe to user-specific notifications
                    client.subscribe("/user/queue/notifications", (message) => {
                        if (message.body) {
                            try {
                                const activity = JSON.parse(message.body);
                                console.log("👤 New activity (user-specific):", activity);
                                showNotification(activity);
                            } catch (e) {
                                console.error("Error parsing user notification:", e);
                            }
                        }
                    });
                },

                onStompError: (frame) => {
                    console.error("❌ STOMP error:", frame.headers['message']);
                    console.error("Additional details:", frame.body);
                    setIsConnected(false);
                    setAuthStatus("STOMP connection error");
                },

                onWebSocketError: (event) => {
                    console.error("❌ WebSocket error:", event);
                    setIsConnected(false);
                    setAuthStatus("WebSocket connection error");
                },

                onWebSocketClose: (event) => {
                    console.log("🔌 WebSocket closed:", event);
                    setIsConnected(false);
                    setAuthStatus("WebSocket connection closed");
                },

                onDisconnect: (frame) => {
                    console.log("📴 Disconnected:", frame);
                    setIsConnected(false);
                    setAuthStatus("Disconnected from WebSocket");
                }
            });

            clientRef.current = client;
            client.activate();

        } catch (error) {
            console.error("❌ WebSocket connection failed:", error);
            setAuthStatus("Connection failed");
            setIsConnected(false);

            if (error instanceof Error) {
                console.error("Error message:", error.message);
                console.error("Error stack:", error.stack);
            }

            // Retry on error
            if (retryCount.current < maxRetries) {
                retryCount.current++;
                const delay = 3000;
                console.log(`Retrying connection in ${delay}ms... (${retryCount.current}/${maxRetries})`);
                retryTimeoutRef.current = setTimeout(connectWebSocket, delay);
            }
        }
    };

    const showNotification = (activity: any) => {
        // Browser notification
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Project Manager', {
                    body: activity.details,
                    icon: '/favicon.ico'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Project Manager', {
                            body: activity.details,
                            icon: '/favicon.ico'
                        });
                    }
                });
            }
        }

        // Console notification for development
        console.log(`🔔 Notification: ${activity.details}`);

        // You can replace alert with a toast library like react-toastify
        // alert(`🔔 ${activity.details}`);
    };

    useEffect(() => {
        console.log("🔄 NotificationComponent mounted, starting connection process...");

        // Initial connection attempt
        connectWebSocket();

        // Cleanup function
        return () => {
            console.log("🧹 NotificationComponent unmounting, cleaning up...");

            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }

            if (clientRef.current && clientRef.current.connected) {
                clientRef.current.deactivate();
            }
        };
    }, []); // Empty dependency array - only run once

    // Manual reconnect function
    const handleReconnect = () => {
        retryCount.current = 0;
        connectWebSocket();
    };


    return (
        <div style={{
            padding: '12px',
            background: isConnected ? '#e8f5e8' : '#ffeee8',
            borderRadius: '8px',
            border: `2px solid ${isConnected ? '#4CAF50' : '#ff9800'}`,
            marginBottom: '10px'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                🔔 Real-time Notifications
            </div>

            <div style={{ fontSize: '13px', color: '#333', marginBottom: '4px' }}>
                Status: {authStatus}
            </div>

            <div style={{
                fontSize: '12px',
                color: isConnected ? '#4CAF50' : '#f44336',
                fontWeight: 'bold'
            }}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>

            {!isConnected && (
                <button
                    onClick={handleReconnect}
                    style={{
                        marginTop: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    🔄 Retry Connection
                </button>
            )}
        </div>
    );
};

export default KeycloakAwareNotifications;