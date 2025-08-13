import React, { useState } from 'react';
// The import statement is looking for a file at './User.css'.
// This error means the file could not be found at that path.
// To fix this, you must ensure the file 'User.css' exists in the same folder as 'UserCreationForm'.
import './user.css';

const UserCreationForm: React.FC = () => {



    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'developer'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8081/api/v1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Ajoutez ici d'autres headers comme les tokens d'autorisation si nécessaire
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Utilisateur créé avec succès :', result);
                // Vous pouvez réinitialiser le formulaire ou rediriger l'utilisateur ici
            } else {
                const errorData = await response.json();
                console.error('Échec de la création de l\'utilisateur :', errorData);
            }
        } catch (error) {
            console.error('Erreur réseau ou du serveur :', error);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Créer un nouvel utilisateur</h2>
            <form onSubmit={handleSubmit} className="form-content">
                <div className="input-group">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Nom d'utilisateur"
                        required
                        className="form-input"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        className="form-input"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mot de passe"
                        required
                        className="form-input"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="firstName">Prénom</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Prénom"
                        className="form-input"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="lastName">Nom de famille</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Nom de famille"
                        className="form-input"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="role">Rôle</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="form-input"
                    >
                        <option value="developer">Développeur</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Administrateur</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="form-button"
                >
                    Créer l'utilisateur
                </button>
            </form>
        </div>
    );
};

export default UserCreationForm;
