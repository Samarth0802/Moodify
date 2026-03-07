import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './features/Auth/pages/Login'
import SignUp from './features/Auth/pages/SignUp'
import FaceExpression from './features/Expression/pages/FaceExpression'
import Logout from './features/Auth/components/Logout'
import ProtectedRoute from './ProtectedRoutes'

const AllRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/faceDetect" element={<ProtectedRoute>
            <FaceExpression/>
        </ProtectedRoute>} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AllRoutes