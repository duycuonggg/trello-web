import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddtoDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Button from '@mui/material/Button'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflow: 'auto',
      borderBottom: '1px solid white',
      paddingX: 2,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label='Duy Cuong'
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label='Public/Private Workspace'
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label='Add to Google drive'
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label='Automation'
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<FilterIcon />}
          label='Filters'
          clickable
        />
      </Box>

      <Box sx={{
        display: 'flex',
        alignItem: 'center',
        gap: 2
      }}>

        <Button
          variant='outlined'
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={2}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: '34px',
              height: '34px',
              fontSize: '16px',
              border: 'none'
            }
          }}
        >
          <Tooltip title='duycuong'>
            <Avatar alt="Remy Sharp"
              src='https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-6/434676690_442145844943398_3149193981518289588_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=1dvUdTliDOsQ7kNvwGXM4VN&_nc_oc=AdmkdATQKV8Wr3Vnyn2Nq79SJAk-FahGlYYRhZcokMt2cMDFDed05eAAn-N1rLI1KNE&_nc_zt=23&_nc_ht=scontent-hkg1-1.xx&_nc_gid=BC7VHcCQTo0kKWCWQdf58w&oh=00_AfFUI0l2Eob72tPjPvzWyCZKvBVDVOP-1LCneZS-_WG9qA&oe=68051B35'
            />
          </Tooltip>
          <Tooltip title='duycuong'>
            <Avatar alt="Remy Sharp"
              src='https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-6/434676690_442145844943398_3149193981518289588_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=1dvUdTliDOsQ7kNvwGXM4VN&_nc_oc=AdmkdATQKV8Wr3Vnyn2Nq79SJAk-FahGlYYRhZcokMt2cMDFDed05eAAn-N1rLI1KNE&_nc_zt=23&_nc_ht=scontent-hkg1-1.xx&_nc_gid=BC7VHcCQTo0kKWCWQdf58w&oh=00_AfFUI0l2Eob72tPjPvzWyCZKvBVDVOP-1LCneZS-_WG9qA&oe=68051B35'
            />
          </Tooltip>
          <Tooltip title='duycuong'>
            <Avatar alt="Remy Sharp"
              src='https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-6/434676690_442145844943398_3149193981518289588_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=1dvUdTliDOsQ7kNvwGXM4VN&_nc_oc=AdmkdATQKV8Wr3Vnyn2Nq79SJAk-FahGlYYRhZcokMt2cMDFDed05eAAn-N1rLI1KNE&_nc_zt=23&_nc_ht=scontent-hkg1-1.xx&_nc_gid=BC7VHcCQTo0kKWCWQdf58w&oh=00_AfFUI0l2Eob72tPjPvzWyCZKvBVDVOP-1LCneZS-_WG9qA&oe=68051B35'
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar