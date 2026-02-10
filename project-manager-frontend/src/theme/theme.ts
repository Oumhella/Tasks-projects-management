import { createTheme, alpha } from '@mui/material/styles';

// Modern Color Palette
const palette = {
  primary: {
    main: '#6366f1', // Indigo 500
    light: '#818cf8', // Indigo 400
    dark: '#4f46e5', // Indigo 600
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ec4899', // Pink 500
    light: '#f472b6', // Pink 400
    dark: '#db2777', // Pink 600
    contrastText: '#ffffff',
  },
  success: {
    main: '#10b981', // Emerald 500
    light: '#34d399',
    dark: '#059669',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#f59e0b', // Amber 500
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#ffffff',
  },
  error: {
    main: '#ef4444', // Red 500
    light: '#f87171',
    dark: '#dc2626',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0ea5e9', // Sky 500
    light: '#38bdf8',
    dark: '#0284c7',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f8fafc', // Slate 50
    paper: '#ffffff',
  },
  text: {
    primary: '#1e293b', // Slate 800
    secondary: '#64748b', // Slate 500
    disabled: '#94a3b8', // Slate 400
  },
};

const theme = createTheme({
  palette,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
      color: palette.text.primary,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
      color: palette.text.primary,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: palette.text.primary,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: palette.text.primary,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: palette.text.primary,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: palette.text.primary,
    },
    subtitle1: {
      fontSize: '1rem',
      color: palette.text.secondary,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: palette.text.secondary,
    },
    body1: {
      color: palette.text.primary,
    },
    body2: {
      color: palette.text.secondary,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${palette.primary.main} ${palette.background.default}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: 'transparent',
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: alpha(palette.primary.main, 0.2),
            minHeight: 24,
            border: `2px solid ${palette.background.default}`,
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
            backgroundColor: alpha(palette.primary.main, 0.5),
          },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
            backgroundColor: alpha(palette.primary.main, 0.5),
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: alpha(palette.primary.main, 0.5),
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '8px 16px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.primary.dark})`,
          '&:hover': {
             background: `linear-gradient(135deg, ${palette.primary.dark}, ${palette.primary.main})`,
          }
        },
        containedSecondary: {
            background: `linear-gradient(135deg, ${palette.secondary.main}, ${palette.secondary.dark})`,
             '&:hover': {
                background: `linear-gradient(135deg, ${palette.secondary.dark}, ${palette.secondary.main})`,
             }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            backgroundColor: alpha(palette.background.default, 0.5),
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: alpha(palette.background.default, 0.8),
            },
            '&.Mui-focused': {
              backgroundColor: '#fff',
              boxShadow: `0 4px 12px ${alpha(palette.primary.main, 0.1)}`,
            },
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
            elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: alpha('#fff', 0.8),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          color: palette.text.primary,
        },
      },
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                borderRadius: '8px',
                margin: '4px 8px',
                '&.Mui-selected': {
                    backgroundColor: alpha(palette.primary.main, 0.1),
                    color: palette.primary.main,
                    '&:hover': {
                         backgroundColor: alpha(palette.primary.main, 0.15),
                    }
                }
            }
        }
    }
  },
});

export default theme;
