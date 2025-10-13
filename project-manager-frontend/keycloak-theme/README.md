# AuraFlow Keycloak Custom Theme

## Setup Instructions

### 1. Create Theme Directory Structure
```
keycloak-themes/
└── auraflow/
    └── login/
        ├── theme.properties
        ├── login.ftl
        ├── register.ftl
        ├── resources/
        │   ├── css/
        │   │   └── login.css
        │   ├── img/
        │   │   └── logo.png
        │   └── js/
        │       └── login.js
```

### 2. Deploy to Keycloak
1. Copy the `auraflow` folder to `{KEYCLOAK_HOME}/themes/`
2. Restart Keycloak server
3. In Keycloak Admin Console:
   - Go to Realm Settings → Themes
   - Set Login Theme to "auraflow"
   - Save

### 3. Alternative: CSS Injection
If you can't modify Keycloak server, use CSS injection in your frontend to override default styles.

## Theme Features
- Matches AuraFlow design system
- Modern gradient backgrounds
- Custom logo and branding
- Responsive design
- Professional form styling
