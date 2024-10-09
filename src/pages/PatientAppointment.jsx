import React from 'react';
import './PatientAppointment.css';

const PatientMedicalHistory = () => {
  return (
    <div className="patient-medical-history">
      
      
      <main className="patient-medical-history-main">
        
        <div className="patient-medical-history-content">
          
          <h3 className="patient-medical-history-title">Patient Medical History</h3>
          <div className="patient-medical-history-cards">
            <div className="patient-medical-history-card">
              <img src="./assets/group-13.svg" alt="Patient Profile" className="patient-profile-pic" />
              <h3>Pamudi Dayarathne</h3>
              <p>Patient ID - 2000100</p>
              <p>Age - 23</p>
              <p>Gender - Female</p>
              <p>Blood type - O+ (O positive)</p>
            </div>
            <div className="patient-medical-history-details">
              <div className="information-card">
                <h3 className="card-title">Information</h3>
                <div className="information-details">
                  <p>Diseases: Fever</p>
                  <p>Issued medicines: Panadol</p>
                  <p>Last visit: 24/08/2024</p>
                </div>
              </div>
              <div className="prescription-card">
                <h3 className="card-title">Patient Prescription</h3>
                <div className="prescription-details">
                  <p>Ref No: 2000100</p>
                  <p>Date: 24.Aug.2024</p>
                  <p>Name: Pamudi Dayarathne</p>
                  <p>Issued medicines: Panadol</p>
                  <p>Dosage: 500mg every 6 hours</p>
                  <p>Issued by: Medical Officer</p>
                </div>
              </div>
            </div>
          </div>
          <div className="action-buttons">
            <button className="back-btn">Back</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientMedicalHistory;
