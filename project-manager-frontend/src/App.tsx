// // import React from 'react';
// // import { useKeycloak } from '@react-keycloak/web';
// //
// // interface CustomKeycloakToken {
// //     preferred_username?: string;
// //     realm_access?: {
// //         roles: string[];
// //     };
// // }
// //
// // function App() {
// //     const { keycloak, initialized } = useKeycloak();
// //
// //     if (!initialized) return <div>Loading...</div>;
// //
// //     const token = keycloak.tokenParsed as CustomKeycloakToken | undefined;
// //     const username = token?.preferred_username;
// //
// //     return (
// //         <div>
// //             {keycloak.authenticated ? (
// //                 <>
// //                     <h1>Welcome, {username || 'User'}</h1>
// //                     <p>You are authenticated.</p>
// //                     <button onClick={() => keycloak.logout()}>Logout</button>
// //                 </>
// //             ) : (
// //                 <>
// //                     <h1>Please log in</h1>
// //                     <button onClick={() => keycloak.login()}>Login</button>
// //                 </>
// //             )}
// //         </div>
// //     );
// // }
// //
// // export default App;
// import React from 'react';
// import { useKeycloak } from '@react-keycloak/web';
// import UserCreationForm from './components/users/User';
//
// interface CustomKeycloakToken {
//     preferred_username?: string;
//     realm_access?: {
//         roles: string[];
//     };
//     sub?: string;
// }
//
// const App: React.FC = () => {
//     const { keycloak, initialized } = useKeycloak();
//
//     if (!initialized) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <p className="text-xl font-semibold text-gray-700">Chargement...</p>
//             </div>
//         );
//     }
//
//     const token = keycloak.tokenParsed as CustomKeycloakToken | undefined;
//     const username = token?.preferred_username;
//
//     return (
//         <div className="min-h-screen bg-gray-100 p-4">
//             <div className="flex justify-between items-center bg-white shadow-md p-4 mb-8 rounded-lg">
//                 {keycloak.authenticated ? (
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-800">
//                             Bienvenue, <span className="text-blue-600">{username || 'Utilisateur'}</span>!
//                         </h1>
//                         <p className="text-sm text-gray-500 mt-1">Vous êtes authentifié.</p>
//                     </div>
//                 ) : (
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-800">
//                             Bienvenue sur le gestionnaire de projet!
//                         </h1>
//                         <p className="text-sm text-gray-500 mt-1">Veuillez vous connecter pour continuer.</p>
//                     </div>
//                 )}
//                 {keycloak.authenticated && (
//                     <button
//                         onClick={() => keycloak.logout()}
//                         className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
//                     >
//                         Se déconnecter
//                     </button>
//                 )}
//                 {!keycloak.authenticated && (
//                     <button
//                         onClick={() => keycloak.login()}
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
//                     >
//                         Se connecter
//                     </button>
//                 )}
//             </div>
//
//             <div className="flex justify-center">
//                 {keycloak.authenticated ? (
//                     <UserCreationForm />
//                 ) : (
//                     <div className="bg-white shadow-md rounded-lg p-6 text-center">
//                         <p className="text-lg text-gray-600">Vous devez être connecté pour créer un utilisateur.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default App;
import React from 'react';
// The import statement is looking for a file at `./components/users/User.tsx`.
// This error means the file could not be found at that path.
// To fix this, you must ensure the file 'User.tsx' exists in 'src/components/users/'.
import UserCreationForm from './components/users/User';
import UserList from "./components/users/UserList";

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
            <UserCreationForm />
            <UserList />
        </div>
    );
};

export default App;
