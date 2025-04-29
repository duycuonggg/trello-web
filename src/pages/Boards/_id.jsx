// Board Details
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/Boardbar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'

function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      {/* ?. (optional chaining): thay cho if nếu có board thì in ra */}
      <BoardBar board={mockData?.board} />
      <BoardContent board={mockData?.board} />
    </Container>
  )
}

export default Board