'use client';
import { createTheme } from "@mui/material/styles";

export const defaultTheme = createTheme({
    palette: {
        mode: "light", // Ensures a light theme
        primary: {
            main: "#f56300", // CTA color
            contrastText: "#ffffff", // Text on primary buttons
        },
        secondary: {
            main: "#0066cc", // Blue (Logo and Name)
            contrastText: "#ffffff", // Text on secondary buttons
        },
        background: {
            default: "#e6e6e6", // Platinum
            paper: "#f5f5f7",   // White for surfaces
        },
        text: {
            primary: "#424245", // Grey
            secondary: "#333333", // Darker grey for less emphasis
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                // Override for contained primary buttons:
                containedPrimary: {
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#373737", // your desired hover color
                    },
                },
                // You can also override the root if needed:
                root: {
                    // This might be necessary if other variants are used
                    "&:hover": {
                        backgroundColor: "#373737",
                    },
                },
            },
        },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif", // Customize if needed
        button: {
            textTransform: "none", // Disable uppercase buttons by default
        },
    },
});

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2", // Light blue
            contrastText: "#fff",
        },
        secondary: {
            main: "#f50057", // Pink
            contrastText: "#fff",
        },
        text: {
            primary: "#000",
            secondary: "#555",
        },
        button: {
            main: "#4caf50", // Green
            contrastText: "#fff",
        },
        background: {
            default: "#f3f4f6", // Light gray
            paper: "#fff",
        },
    },

});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#90caf9", // Light blue
            contrastText: "#000",
        },
        secondary: {
            main: "#f48fb1", // Light pink
            contrastText: "#000",
        },
        text: {
            primary: "#fff",
            secondary: "#ccc",
        },
        button: {
            main: "#ff9800", // Orange
            contrastText: "#000",
        },
        background: {
            default: "#121212", // Dark gray
            paper: "#1e1e1e",
        },
    },
});

// Grassy Theme
export const grassyTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#388e3c", // Green
            contrastText: "#fff",
        },
        secondary: {
            main: "#fdd835", // Yellow
            contrastText: "#000",
        },
        text: {
            primary: "#2e7d32",
            secondary: "#8bc34a",
        },
        button: {
            main: "#81c784", // Light green
            contrastText: "#000",
        },
        background: {
            default: "#e8f5e9", // Light green background
            paper: "#ffffff",
        },
    },
});


export const FigmaTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#22c55e", // Tailwind: green-500
        },
        background: {
            default: "#000000", // Background black
            paper: "#111827", // Dark gray background (gray-900)
        },


    },
    typography: {
        fontFamily: "'Inter', sans-serif", // Custom font
        h1: {
            fontSize: "2.5rem", // 40px
            fontWeight: 700,
            color: "rgba(70, 193, 144, 0.83) !important", // White text
        },
        h2: {
            fontSize: "2rem", // 32px
            fontWeight: 600,
            color: "rgba(70, 193, 144, 0.83) !important", // Gray-300
        },
        h3: {
            fontSize: "1.75rem", // 28px
            fontWeight: 600,
            color: "rgba(70, 193, 144, 0.83) !important", // Gray-400
        },
        h4: {
            fontSize: "1.75rem", // 28px
            fontWeight: 600,
            color: "rgba(70, 193, 144, 0.83) !important", // Gray-400
        },
        h5: {
            fontSize: "1.75rem", // 28px
            fontWeight: 600,
            color: "rgba(70, 193, 144, 0.83) !important", // Gray-400
        },
        h6: {
            fontSize: "1.75rem", // 28px
            fontWeight: 600,
            color: "rgba(70, 193, 144, 0.83) !important", // Gray-400
        },
        body1: {
            fontSize: "1rem", // 16px
            color: "rgba(255, 255, 255, 0.4)", // White with opacity
            lineHeight: 1.6,
        },
        body2: {
            fontSize: "0.875rem", // 14px
            color: "rgba(255, 255, 255, 0.6)", // Dimmed white
        },
        button: {
            textTransform: "none", // No uppercase for buttons
            fontWeight: 500,
        },
        subtitle1: {
            fontSize: "1rem", // 16px
            color: "gray", // White with opacity
            lineHeight: 1.6,
        },
        heading: {
            fontSize: "2rem", // 32px
            fontWeight: 600,
            color: "rgb(255, 255, 255) !important", // Gray-300
        }
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#040907", // Gray-800 with opacity
                    borderRadius: "12px",
                    padding: "16px",
                    color: "#ffffff", // Text color
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "#040907", // Gray-800 with opacity
                    color: "#ffffff", // Text color
                },
            },
        },
        MuiBox: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(70, 193, 144, 0.06)", // Gray-900 with opacity
                    borderRadius: "8px",
                    padding: "16px",
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)", // Black with 80% opacity
                    padding: "24px",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(70, 193, 144, 0.06)", // Darker input background (gray-800 with opacity)
                        borderRadius: "8px",
                        "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)", // 30% opacity border
                        },
                        "&:hover fieldset": {
                            borderColor: "#22c55e", // Green hover border
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#22c55e", // Green focus border
                        },
                    },
                    "& .MuiInputBase-input": {
                        color: "white", // White text with 90% opacity
                        "::placeholder": {
                            color: "white", // Placeholder text 50% opacity
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)", // Label text 70% opacity
                    },
                    "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
                        WebkitBoxShadow: "0 0 0px 1000px rgba(70, 193, 144, 0.06) inset !important",
                        backgroundColor: "rgba(70, 193, 144, 0.06) !important",
                        WebkitTextFillColor: "white !important",
                        transition: "background-color 5000s ease-in-out 0s", // Prevents Chrome from applying default autofill
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: "#46c190", // Default background color
                    color: "#000000", // Text color
                    fontSize: "1rem",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    padding: "12px 24px",
                    textTransform: "none", // Removes uppercase styling
                    "&:hover": {
                        backgroundColor: "#16a34a", // Darker green-600
                    },
                    "&:disabled": {
                        backgroundColor: "#374151", // Gray-700 when disabled
                        color: "#9ca3af", // Gray-400 text
                    },
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    padding: "10px 16px",
                    color: "rgba(255, 255, 255, 0.6)", // Dimmed white text
                    "&:hover": {
                        backgroundColor: "#203f33", // Greenish hover
                        color: "#ffffff",
                    },
                    "&.Mui-selected": {
                        backgroundColor: "#22c55e", // Green active state
                        color: "#ffffff",
                        "&:hover": {
                            backgroundColor: "#16a34a", // Darker green
                        },
                    },
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: "rgba(255, 255, 255, 0.6)", // Dimmed icons
                    minWidth: "40px",
                    "&.Mui-selected": {
                        color: "#ffffff",
                    },
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "inherit",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#07130e",  // Dark background color for AppBar
                    boxShadow: "none",            // Remove shadow
                },
            },
        },

        MuiTable: {
            styleOverrides: {
                root: {
                    borderCollapse: "collapse", // Collapse table borders
                    border: "3px solid #131917",  // Light border color for the table
                    borderRadius: '5px'
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: "16px",             // Custom padding for cells
                    // border: "1px solid #ddd",   // Border for table cells
                    // borderRadius: '5px',
                    border: "3px solid #131917",
                    color: "white",              // Text color in cells
                    fontWeight: 500,             // Bold text in cells
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: "#111111", // Light gray background for table header
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    backgroundColor: "#111111", // Light gray background for table header
                    border: "3px solid #131917",

                    "&:hover": {
                        // backgroundColor: "#f1f1f1", // Row hover color
                    },
                },
            },
        },

    }
});