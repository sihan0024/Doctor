import React, { useEffect, useState } from 'react';
import './Summary.css';
import { db } from '../firebase-config'; // Adjust the path if necessary
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'; // Import updateDoc
import { useLocation } from 'react-router-dom'; // Import useLocation
import CryptoJS from 'crypto-js'; // Import CryptoJS for encryption  

const Summary = () => {
  const location = useLocation(); // Get location object
  const summaryData = location.state || {}; // Get passed data or set as an empty object
  const [doctorDetails, setDoctorDetails] = useState(null); // State to hold doctor details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const doctorId = location.state?.doctorId || localStorage.getItem('doctorId'); // Get doctorId from state or localStorage

  useEffect(() => {
    if (!doctorId) {
      setError('Doctor ID not available.');
      setLoading(false);
      return;
    }

    const fetchDoctorData = async () => {
      try {
        const docRef = doc(db, 'Doctors', doctorId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDoctorDetails(docSnap.data()); // Set doctor details
          localStorage.setItem('doctorId', doctorId); // Store doctorId in localStorage
        } else {
          setError('No matching doctor found.');
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error.message);
        setError('Error fetching doctor data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  const handleBack = () => {
    // Logic for navigating back
    console.log('Back button clicked');
  };

  const handleSend = async () => {
    // Logic for sending the summary to Firestore
    try {
      // Encrypt the summary data
      const encryptedSummary = {
        doctor: {
          doctorName: CryptoJS.AES.encrypt(doctorDetails.doctorName, 'secret-key').toString(),
          biography: CryptoJS.AES.encrypt(doctorDetails.biography, 'secret-key').toString(),
          phoneNumber: CryptoJS.AES.encrypt(doctorDetails.phoneNumber, 'secret-key').toString(),
        },
        patient: CryptoJS.AES.encrypt(summaryData.patient, 'secret-key').toString(),
        referenceNo: '', // This will be filled with the document ID later
        prescriptionDate: CryptoJS.AES.encrypt(summaryData.prescriptionDate, 'secret-key').toString(),
        diagnosis: CryptoJS.AES.encrypt(summaryData.diagnosis, 'secret-key').toString(),
        note: CryptoJS.AES.encrypt(summaryData.note, 'secret-key').toString(),
        medicines: summaryData.medicines.map(med => ({
          medicineName: CryptoJS.AES.encrypt(med.medicineName, 'secret-key').toString(),
          instruction: CryptoJS.AES.encrypt(med.instruction, 'secret-key').toString(),
          days: CryptoJS.AES.encrypt(med.days, 'secret-key').toString(),
        })),
      };

      // Add the encrypted data to Firestore
      const docRef = await addDoc(collection(db, "prescriptions"), encryptedSummary);
      console.log("Document written with ID: ", docRef.id);
      
      // Update the document with the reference number
      await updateDoc(docRef, {
        referenceNo: docRef.id
      });
      
      // Optionally, show feedback to the user here (e.g., alert, toast)
      alert('Prescription sent successfully! Reference No: ' + docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert('Error sending prescription: ' + e.message);
    }
  };

  return (
    <div className="summary-container">
      <div className="patient-details">
        <div className="left-section">
          {/* Handle loading, error, and fetched doctor details */}
          {loading ? (
            <p>Loading doctor details...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <h3>{doctorDetails?.doctorName || 'Doctor Name'}</h3>
              <p>{doctorDetails?.biography || 'Biography'}</p>
              <p>Mob. No: {doctorDetails?.phoneNumber || 'Phone Number'}</p>
            </>
          )}
        </div>
        <div className="right-section">
          <p><strong>Patient Name:</strong> {summaryData.patient}</p>
          <p><strong>Reference No:</strong> {summaryData.referenceNo}</p>
          <p><strong>Prescription Date:</strong> {summaryData.prescriptionDate}</p>
          <p><strong>Diagnosis:</strong> {summaryData.diagnosis}</p>
          <p><strong>Note:</strong> {summaryData.note}</p>
        </div>
      </div>

      <table className="medicine-table">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Dosage</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.medicines && summaryData.medicines.map((med, index) => (
            <tr key={index}>
              <td>{med.medicineName}</td>
              <td>{med.instruction}</td>
              <td>{med.days}</td>
            </tr>
          ))} 
        </tbody>
      </table>

      <div className="advice-section">
        <p><strong>Advice Given:</strong> {summaryData.advice || "Avoid Oily and Spicy Food"}</p>
        <p><strong>Follow Up:</strong> {summaryData.followUp || "8-Nov-2024"}</p>
      </div>

      <div className="button-container">
        <button className="back-button" onClick={handleBack}>Back</button>
        <button className="send-button" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Summary;
