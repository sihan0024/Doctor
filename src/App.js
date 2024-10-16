import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import DoctorSchedule from './pages/DoctorSchedule';
import Login from './pages/login';
import Appointment from './pages/Appointment';
import PatientMedicalHistory from './pages/PatientMedicalHistory';
import Prescription from './pages/Prescription';
import Patientinfo from './pages/info';
import PrescriptionSummary from './pages/Summary';
import PrescriptionDisplay from './pages/PrescriptionDisplay';
function AppContent() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div style={{ display: 'flex' }}>
            {!isLoginPage && <SideBar />} 
            <div style={{ flex: 1, marginLeft: !isLoginPage ? '250px' : '0', paddingTop: !isLoginPage ? '60px' : '0' }}>
                {!isLoginPage && <TopBar />}
                <div style={{ marginTop: !isLoginPage ? '60px' : '0' }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                       
                        <Route path="/Appointment" element={<Appointment />} />
                        <Route path="/MedicalHistory" element={<PatientMedicalHistory />} />
                        <Route path="/doctor-schedule" element={<DoctorSchedule />} />
                        <Route path="/prescription" element={<Prescription />} />
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/info" element={<Patientinfo />} />
                        <Route path="/summary" element={<PrescriptionSummary />} />
                        <Route path="/in" element={<PrescriptionDisplay />} />

                    </Routes>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
