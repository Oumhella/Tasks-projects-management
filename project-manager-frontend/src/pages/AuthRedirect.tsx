// src/pages/AuthRedirect.tsx
import { useEffect } from "react";

const AuthRedirect = () => {
    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            // Make sure client_id matches your Keycloak configuration
            const keycloakAuthUrl = `http://localhost:8080/realms/project-manager/protocol/openid-connect/auth`;
            const clientId = 'project_manager_client'; // Use consistent client ID
            const redirectUri = encodeURIComponent('http://localhost:3000/callback');
            const responseType = 'code';
            const scope = encodeURIComponent('openid profile email');

            const authUrl = `${keycloakAuthUrl}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

            console.log('Redirecting to Keycloak:', authUrl);
            window.location.href = authUrl;
        } else {
            // Check if token is still valid (optional)
            // For now, just redirect to dashboardO
            window.location.href = '/dashboard';
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Redirecting to login...</p>
            </div>
        </div>
    );
};

export default AuthRedirect;