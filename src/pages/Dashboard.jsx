// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import './Dashboard.css';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';

const Dashboard = () => {
  const location = useLocation();
  const { doctorId } = location.state || {}; // Get doctorId from the state passed during navigation

  const [totalAppointments, setTotalAppointments] = useState(0);
  const [appointmentsToday, setAppointmentsToday] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId) return;

      try {
        // Query to fetch appointments for the logged-in doctor
        const q = query(collection(db, 'Appointments'), where('doctor Id', '==', doctorId));
        
        // Set up a listener to update appointment counts in real-time
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
          let total = 0;
          let todayCount = 0;

          querySnapshot.forEach((doc) => {
            total += 1; // Increment total appointments count
            const appointmentDate = doc.data().date; // Assume your document has a 'date' field
            if (appointmentDate === today) {
              todayCount += 1; // Increment today's appointments count
            }
          });

          setTotalAppointments(total); // Update total appointments state
          setAppointmentsToday(todayCount); // Update today's appointments state
        });

        return () => unsubscribe(); // Cleanup subscription on component unmount
      } catch (error) {
        console.error('Error fetching appointments data: ', error);
      }
    };

    fetchAppointments(); // Call the fetch function
  }, [doctorId]); // Dependency on doctorId to re-fetch when it changes

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <div className="main-content">
        <div className="cards">
          <div className="card">
            <h3>Appointments Today</h3>
            <p>{appointmentsToday}</p>
            <img src="icon1.png" alt="icon" />
          </div>
          <div className="card">
            <h3>Total Appointments</h3>
            <p>{totalAppointments}</p>
            <img src="icon2.png" alt="icon" />
          </div>
        </div>

        {/* Dashboard Bottom Section */}
        <div className="dashboard-bottom">
          <div className="patient-list">
            <div className="patient-list-header">
              <h3>Patient</h3>
              <p>This is your overall latest patient list</p>
              <button className="see-all">See All</button>
            </div>
            <div className="patient-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Priority</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Replace with real patient data */}
                  <tr>
                    <td>Adam Messy</td>
                    <td>#P00023</td>
                    <td><span className="priority medium">Medium</span></td>
                    <td>June 2, 2023</td>
                    <td>June 5, 2023</td>
                  </tr>
                  <tr>
                    <td>Celina Akusta</td>
                    <td>#P00024</td>
                    <td><span className="priority low">Low</span></td>
                    <td>June 3, 2023</td>
                    <td>June 5, 2023</td>
                  </tr>
                  {/* More rows as needed */}
                </tbody>
              </table>
            </div>
          </div>

          <div className="calendar">
            <div className="calendar-header">
              <h3>June 2023</h3>
              <p>Showing appointments for the month</p>
            </div>
            <div className="calendar-content">
              {/* Render calendar here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
