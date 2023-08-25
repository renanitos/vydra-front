import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          '&.integrantes-title': {
            color: '#1F1F1F',
            marginTop: '10px',
          },
        },
      },
    },
  },
});

export default theme;
