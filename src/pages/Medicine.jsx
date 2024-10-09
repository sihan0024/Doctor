import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import './PatientAppointment.css';

const Appointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctorId = location.state?.doctorId || localStorage.getItem('doctorId'); // Retrieve from localStorage if not in state
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) {
      setError('Doctor ID not available.');
      setLoading(false);
      return;
    }

    const fetchAppointments = () => {
      try {
        const q = query(
          collection(db, 'Appointments'),
          where('doctor Id', '==', doctorId)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const appointmentsData = [];
          querySnapshot.forEach((doc) => {
            appointmentsData.push({ id: doc.id, ...doc.data() });
          });
          setAppointments(appointmentsData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Error fetching appointments: ' + error.message);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const handlePatientClick = (patientId) => {
    navigate(`/info`, { state: { patientId } });
  };

  return (
    <div className="appointment">
      <main className="appointment-main">
        <div className="appointment-content">
          <h2 className="appointment-greeting">Good Morning, Dr Sheril</h2>
          <div className="appointment-summary">
            <h3>Select Patient</h3>
            <select className="appointment-select">
              <option value="">Select</option>
              {appointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {appointment.patientName}
                </option>
              ))}
            </select>
            <div className="appointment-count">
              <div className="count-box">
                <p>Appointment Count</p>
                <span>{appointments.length}</span>
              </div>
            </div>
          </div>

          <table className="appointment-table">
            <thead>
              <tr>
                <th>Appointment No</th>
                <th>Patient Name</th>
                <th>Blood Group</th>
                <th>Phone Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="error">
                    {error}
                  </td>
                </tr>
              ) : appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.appointmentNumber}</td>
                    <td onClick={() => handlePatientClick(appointment.id)} className="patient-name">
                      {appointment.patientName}
                    </td>
                    <td>{appointment.bloodGroup}</td>
                    <td>{appointment.contactNo}</td>
                    <td>
                      <button className="send-prescription-btn">
                        Send Prescription
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No appointments available.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="action-buttons">
            <button className="back-btn" onClick={() => window.history.back()}>
              Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appointment;
