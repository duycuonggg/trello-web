import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
// import { teal, deepOrange, cyan, orange } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  // kích thước giao diện
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  // màu giao diện
  colorSchemes: {
    light: {},
    dark: {}
  },
  // other properties
  components: {
    // scrollbar
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },
    // chuyển về chữ bình thường (viết hoa chữ cái đầu)
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          // border
          borderWidth: '0.5px',
          '&:hover': { borderWidth: '0.5px' }
        }
      }
    },
    // chỉnh màu trong input
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem'
        }
      }
    },
    // sửa trong input
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': { borderWidth: '0.5px !important' },
          '&:hover fieldset': { borderWidth: '1px !important' },
          '&.Mui-focused fieldset': { borderWidth: '1px !important' }
        }
      }
    }
  }
})

export default theme