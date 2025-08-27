import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import './index.css';
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {initOptions, keycloak} from "./config/Keycloak";

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={initOptions}
    >
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
     </ReactKeycloakProvider>
);
