import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'

/**
 * Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập
 * Sử dụng <Outlet /> của react-router-dom để hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
 * https://reactrouter.com/en/main/components/outlet
 * Một bài hướng dẫn khá đầy đủ:
 * https://www.robinwieruch.de/react-router-private-routes/
 */
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      {/* redirect route */}
      <Route path='/' element={
        /***
         * Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu route / sẽ không nằm
         * trong lịch sử trình duyệt nữa, thực hành trên trang 404 để thấy sự khác biệt
         */
        <Navigate to='/boards/685644743e96ccf31f22e754' replace={true} />
      } />

      {/* Protected Routes (Hiểu đơn giản trong dự án của chúng ta là những route chỉ cho truy cập sau khi đã login) */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* <Outlet /> của react-router-dom sẽ chạy vào các child route trong này */}

        {/* board details route */}
        <Route path='boards/:boardId' element={<Board />} />

        {/* User Settings */}
        <Route path='settings/account' element={<Settings />} />
        <Route path='settings/security' element={<Settings />} />
      </Route>

      {/* Authentication */}
      <Route path='login' element={<Auth />} />
      <Route path='register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 route */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
