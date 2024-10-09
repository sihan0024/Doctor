import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore"; // Firebase Firestore functions

import { db } from '../firebase-config';// Import Firestore configuration
import './Patients.css'; // Import the CSS file for styling

const Patients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetching patients from Firebase 'patients' collection
    const unsubscribe = onSnapshot(collection(db, "patients"), (snapshot) => {
      setPatients(
        snapshot.docs.map((doc) => ({
          refNo: doc.id, // Reference No from Firestore document ID
          ...doc.data(), // Spread other fields from Firestore document
        }))
      );
    });

    // Cleanup subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="patient-list-container">
      <div className="header">
        <button className="add-patient-button">+ Add Patient</button>
        <h2>Patients</h2>
      </div>

      <table className="patient-table">
        <thead>
          <tr>
            <th>Reference No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>NIC</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.refNo}>
              <td>{patient.refNo}</td>
              <td>{patient.name}</td>
              <td>{patient.email}</td>
              <td>{patient.phone}</td>
              <td>{patient.address}</td>
              <td>{patient.nic}</td>
              <td className="actions">
                <button className="edit-button">✏️</button>
                <button className="delete-button">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="back-button">Back</button>
    </div>
  );
};

export default Patients;
