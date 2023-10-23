import { createTheme, adaptV4Theme } from '@mui/material/styles';

export default createTheme(adaptV4Theme({
    palette: {
        primary: { // works
          main: '#5A81FA',
          contrastText: '#fff',
        },
        secondary: { // works
          main: '#464BA8',
          contrastText: '#fff',
        }
    },
}));