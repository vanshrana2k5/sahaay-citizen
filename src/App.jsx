import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SOS from './pages/SOS'
import Alerts from './pages/Alerts'
import Shelters from './pages/Shelters'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/shelters" element={<Shelters />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App