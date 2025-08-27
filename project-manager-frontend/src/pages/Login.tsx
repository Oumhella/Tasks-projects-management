// src/pages/Login.tsx
import React from 'react';

const Login = () => {
    const handleLogin = () => {
        // Redirect to Keycloak login
        const keycloakUrl = 'http://localhost:8080/realms/project-manager/protocol/openid-connect/auth';
        const params = new URLSearchParams({
            client_id: 'project_manager_client',
            redirect_uri: 'http://localhost:3000/callback',
            response_type: 'code',
            scope: 'openid profile email',
        });

        window.location.href = `${keycloakUrl}?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Welcome to Project Manager
                    </h2>
                    <button
                        onClick={handleLogin}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors w-full"
                    >
                        Login with Keycloak
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;