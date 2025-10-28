import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import './index.css';
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {initOptions, keycloak} from "./config/Keycloak";
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1JEaF5cXmRCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXdceHRcQmFcUkVzWUZWYEk=');



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
