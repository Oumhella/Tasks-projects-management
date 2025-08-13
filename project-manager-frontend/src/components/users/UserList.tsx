import React, { useState, useEffect } from 'react';
// The import statement is looking for a file at './UserList.css'.
// This error means the file could not be found at that path.
// To fix this, you must ensure the file 'UserList.css' exists in the same folder as 'UserList'.
import './userList.css';
interface User {
    id: number; // ou string, selon le type d'ID de votre API
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

const UserList: React.FC = () => {
    // Spécifier explicitement le type du state 'users' pour résoudre les erreurs TypeScript
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Remplacez 'VOTRE_ENDPOINT_API_UTILISATEURS' par l'URL de votre API
                const response = await fetch('http://localhost:8081/api/v1/users');
                if (!response.ok) {
                    throw new Error('La récupération des données a échoué');
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                // @ts-ignore
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []); // Le tableau vide [] garantit que cet effet ne s'exécute qu'une seule fois, au montage du composant.

    if (isLoading) {
        return <div className="loading-message">Chargement des utilisateurs...</div>;
    }

    if (error) {
        return <div className="error-message">Erreur : {error}</div>;
    }

    // @ts-ignore
    return (
        <div className="user-list-container">
            <h2 className="user-list-title">Liste des Utilisateurs</h2>
            {users.length > 0 ? (
                <ul className="user-list">
                    {users.map(user => (
                        <li key={user.id} className="user-card">
                            <div className="user-name">
                                {user.firstName} {user.lastName}
                            </div>
                            <div className="user-email">{user.email}</div>
                            <div className="user-role">{user.role}</div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-users-message">Aucun utilisateur trouvé.</div>
            )}
        </div>
    );
};

export default UserList;
