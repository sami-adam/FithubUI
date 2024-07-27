import { CssBaseline } from '@mui/joy';
import './App.css';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/common/SideBar';
import HomePage from './pages/HomePage';
import Header from './components/common/Header';
import SubscriptionPage from './pages/SubscriptionPage';
import MemberPage from './pages/MemberPage';
import EmployeePage from './pages/EmployeePage';
import EmailPage from './pages/EmailPage';


function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Header />
      <Sidebar>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/" element={<HomePage/>} />
        <Route  path="/subscriptions" element={<SubscriptionPage />} />
        <Route path="/members" element={<MemberPage/>} />
        <Route path="/employees" element={<EmployeePage/>} />
        <Route path="/emails" element={<EmailPage/>} />
      </Routes>
      </Sidebar>
    </BrowserRouter>
  );
}

export default App;
