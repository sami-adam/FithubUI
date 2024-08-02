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
import ProductPage from './pages/ProductPage';
import UserPage from './pages/UserPage';
import SubscriptionForm from './components/subscription/SubscriptionForm';
import { Experimental_CssVarsProvider as MaterialCssVarsProvider } from '@mui/material/styles';
import { CssVarsProvider, extendTheme as extendJoyTheme, THEME_ID } from '@mui/joy/styles';
import ProductForm from './components/product/ProductForm';
import EmployeeForm from './components/employee/EmployeeForm';
import ErrorBoundary from './components/common/ErrorBoundary';
import MemberForm from './components/member/MemberForm';
import FitnessClassPage from './pages/FitnessClassPage';
import FitnessClassForm from './components/fitnessClass/FitnessClassForm';
const joyTheme = extendJoyTheme();


function App() {
  return (
    <ErrorBoundary>
    <MaterialCssVarsProvider>
    <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
      <BrowserRouter>
        <CssBaseline />
        <Header />
        <Sidebar>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/undefined" element={<LoginPage />} />
          <Route path="/home" element={<HomePage/>} />
          <Route path="/" element={<HomePage/>} />
          <Route  path="/subscriptions" element={<SubscriptionPage />} />
          <Route  path="/subscription-form" element={<SubscriptionForm />} />
          <Route path="/members" element={<MemberPage/>} />
          <Route path="/member-form" element={<MemberForm/>} />
          <Route path="/employees" element={<EmployeePage/>} />
          <Route path="/employee-form" element={<EmployeeForm/>} />
          <Route path="/emails" element={<EmailPage/>} />
          <Route path="/products" element={<ProductPage/>} />
          <Route path="/product-form" element={<ProductForm/>} />
          <Route path="/users" element={<UserPage/>} />
          <Route path="/fitness-classes" element={<FitnessClassPage/>} />
          <Route path="/fitness-class-form" element={<FitnessClassForm/>} />
        </Routes>
        </Sidebar>
      </BrowserRouter>
    </CssVarsProvider>
    </MaterialCssVarsProvider>
    </ErrorBoundary>
  );
}

export default App;
