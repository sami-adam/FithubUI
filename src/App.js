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
import { CssVarsProvider } from '@mui/joy/styles';
import ProductForm from './components/product/ProductForm';
import EmployeeForm from './components/employee/EmployeeForm';
import ErrorBoundary from './components/common/ErrorBoundary';
import MemberForm from './components/member/MemberForm';
import FitnessClassPage from './pages/FitnessClassPage';
import FitnessClassForm from './components/fitnessClass/FitnessClassForm';
import i18n from './i18n';
import theme, { cacheLtr, cacheRtl } from './theme';
import { CacheProvider } from '@emotion/react';
import SupportPage from './pages/SupportPage';
import AccountPage from './pages/AccountPage';
import EntryPage from './pages/EntryPage';
import TransactionPage from './pages/TransactionPage';
import AccountForm from './components/accounting/AccountForm';
import JournalPage from './pages/JournalPage';
import JournalForm from './components/accounting/JournalForm';
import ProductCategoryPage from './pages/ProductCategoryPage';
import ProductCategoryForm from './components/product/ProductCayegoryForm';
import BenefitPage from './pages/BenefitPage';
import BenefitForm from './components/product/BenefitForm';
import TransactionForm from './components/accounting/TransactionForm';
import NotificationPage from './pages/NotificationPage';
import ClassSchedulePage from './pages/ClassSchedulePage';
import ClassScheduleForm from './components/fitnessClass/ClassScheduleForm';
import NotFoundPage from './pages/NotFoundPage';
import SignUpPage from './pages/SignUpPage';
import UserCreatedPage from './pages/UserCreatedPage';
import ClassEnrollmentPage from './pages/ClassEnrollmentPage';
import Dashboard from './pages/Dashboard';
//const joyTheme = extendJoyTheme();


function App() {
  return (
    <CacheProvider value={i18n.language === 'ar' ? cacheRtl : cacheLtr}>
    <ErrorBoundary>
    <MaterialCssVarsProvider>
    <CssVarsProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <Header />
        <Sidebar>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/user-created" element={<UserCreatedPage />} />
          <Route path="/undefined" element={<LoginPage />} />
          <Route path="/home" element={<HomePage/>} />
          <Route path="/" element={<HomePage/>} />
          <Route  path="/subscriptions" element={<SubscriptionPage />} />
          <Route  path="/subscription-form" element={<SubscriptionForm />} />
          <Route path="/subscriptions/:id" element={<SubscriptionForm />} />
          <Route path="/subscriptions/member/:id" element={<SubscriptionPage />} />
          <Route path="/members" element={<MemberPage/>} />
          <Route path="/member-form" element={<MemberForm/>} />
          <Route path="/members/:id" element={<MemberForm/>} />
          <Route path="/employees" element={<EmployeePage/>} />
          <Route path="/employee-form" element={<EmployeeForm/>} />
          <Route path="/employees/:id" element={<EmployeeForm/>} />
          <Route path="/emails" element={<EmailPage/>} />
          <Route path="/products" element={<ProductPage/>} />
          <Route path="/product-form" element={<ProductForm/>} />
          <Route path="/products/:id" element={<ProductForm/>} />
          <Route path="/product-categories" element={<ProductCategoryPage/>} />
          <Route path="/product-category-form" element={<ProductCategoryForm/>} />
          <Route path="/product-categories/:id" element={<ProductCategoryForm/>} />
          <Route path="/benefits" element={<BenefitPage/>} />
          <Route path="/benefit-form" element={<BenefitForm/>} />
          <Route path="/benefits/:id" element={<BenefitForm/>} />
          <Route path="/users" element={<UserPage/>} />
          <Route path="/fitness-classes" element={<FitnessClassPage/>} />
          <Route path="/fitness-class-form" element={<FitnessClassForm/>} />
          <Route path="/fitness-classes/:id" element={<FitnessClassForm/>} />
          <Route path="/class-schedules" element={<ClassSchedulePage/>} />
          <Route path="/class-schedule-form" element={<ClassScheduleForm/>} />
          <Route path="/class-schedules/:id" element={<ClassScheduleForm/>} />
          <Route path="/class-enrollments" element={<ClassEnrollmentPage/>} />
          <Route path="/class-enrollments/member/:id" element={<ClassEnrollmentPage/>} />
          <Route path="/support" element={<SupportPage/>} />
          <Route path="/accounts" element={<AccountPage/>} />
          <Route path="/account-form" element={<AccountForm/>} />
          <Route path="/accounts/:id" element={<AccountForm/>} />
          <Route path="/entries" element={<EntryPage/>} />
          <Route path="/transactions" element={<TransactionPage/>} />
          <Route path="/transaction-form" element={<TransactionForm/>} />
          <Route path="/transactions/:id" element={<TransactionForm/>} />
          <Route path="/journals" element={<JournalPage/>} />
          <Route path="/journal-form" element={<JournalForm/>} />
          <Route path="/journals/:id" element={<JournalForm/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/notifications" element={<NotificationPage/>} />
          <Route path="/404" element={<NotFoundPage/>} />
        </Routes>
        </Sidebar>
      </BrowserRouter>
    </CssVarsProvider>
    </MaterialCssVarsProvider>
    </ErrorBoundary>
    </CacheProvider>
  );
}

export default App;
