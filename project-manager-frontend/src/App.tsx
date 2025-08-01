import React from 'react';
import { useKeycloak } from '@react-keycloak/web';

// Define the token type interface outside the component for reusability
interface KeycloakTokenParsed {
    preferred_username?: string;
    realm_access?: {
        roles: string[];
    };
    // Add other common token fields if needed
    sub?: string;
    email?: string;
    given_name?: string;
    family_name?: string;
}

function App() {
    const { keycloak, initialized } = useKeycloak();


    if (!initialized) {
        return <div>Loading...</div>;
    }


    const token = keycloak.tokenParsed as KeycloakTokenParsed;
    const username = token?.preferred_username;

    return (
        <div>
            {keycloak.authenticated ? (
                <div>
                    <h1>Welcome, {username || 'User'}</h1>
                    <p>You are successfully authenticated!</p>
                    {token?.realm_access?.roles && (
                        <div>
                            <p>Your roles: {token.realm_access.roles.join(', ')}</p>
                        </div>
                    )}
                    <button
                        onClick={() => keycloak.logout()}
                        style={{ marginTop: '10px', padding: '8px 16px' }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div>
                    <h1>Please log in</h1>
                    <button
                        onClick={() => keycloak.login()}
                        style={{ padding: '8px 16px' }}
                    >
                        Login
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;