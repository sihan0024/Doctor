import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config'; // Adjust the import path as necessary
import { getDoc, doc } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

const PrescriptionDisplay = ({ referenceNo }) => {
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        // Use referenceNo to get the document from Firestore
        const docRef = doc(db, 'prescriptions', referenceNo);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Fetched prescription data:", docSnap.data());
          setPrescriptionData(docSnap.data());
        } else {
          setError('No matching prescription found.');
        }
      } catch (error) {
        console.error("Error fetching prescription data:", error.message);
        setError('Error fetching prescription data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch prescription data only if referenceNo is provided
    if (referenceNo) {
      fetchPrescriptionData();
    } else {
      setError('Document ID (referenceNo) is not provided.');
      setLoading(false);
    }
  }, [referenceNo]);

  const decryptImage = (encryptedImgData) => {
    if (!encryptedImgData) {
      throw new Error('No encrypted image data available.');
    }
    // Replace 'your-secret-key' with your actual secret key used for encryption
    const bytes = CryptoJS.AES.decrypt(encryptedImgData, 'your-secret-key');
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    // Assuming the decrypted data is base64 encoded
    return `data:image/png;base64,${decryptedData}`;
  };

  const decryptSummaryDetails = (data) => {
    // Decrypt the necessary details
    const decryptedDoctorDetails = {
      doctorName: data.doctor?.doctorName || "Unknown",
      biography: data.doctor?.biography || "No biography available",
      phoneNumber: data.doctor?.phoneNumber || "No phone number",
    };

    const decryptedPatientDetails = {
      patientName: data.patient || "Unknown",
      appointmentNo: data.appointmentNo || "Not assigned",
      prescriptionDate: data.prescriptionDate || "Not specified",
      diagnosis: data.diagnosis || "No diagnosis provided",
      note: data.note || "No notes available",
      advice: data.advice || "No advice provided",
      followUp: data.followUp || "No follow-up scheduled",
    };

    return { decryptedDoctorDetails, decryptedPatientDetails };
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const { decryptedDoctorDetails, decryptedPatientDetails } = decryptSummaryDetails(prescriptionData || {});

  return (
    <div className="prescription-display">
      {error && <p>{error}</p>}
      {prescriptionData?.encryptedImage && (
        <div className="image-container">
          <h4>Prescription Image:</h4>
          <img 
            src={decryptImage(prescriptionData.encryptedImage)} 
            alt="Prescription" 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
        </div>
      )}
      
      <div className="summary-details">
        <h3>Doctor Details</h3>
        <p><strong>Name:</strong> {decryptedDoctorDetails.doctorName}</p>
        <p><strong>Biography:</strong> {decryptedDoctorDetails.biography}</p>
        <p><strong>Phone Number:</strong> {decryptedDoctorDetails.phoneNumber}</p>

        <h3>Patient Details</h3>
        <p><strong>Name:</strong> {decryptedPatientDetails.patientName}</p>
        <p><strong>Appointment No:</strong> {decryptedPatientDetails.appointmentNo}</p>
        <p><strong>Prescription Date:</strong> {decryptedPatientDetails.prescriptionDate}</p>
        <p><strong>Diagnosis:</strong> {decryptedPatientDetails.diagnosis}</p>
        <p><strong>Note:</strong> {decryptedPatientDetails.note}</p>
        <p><strong>Advice Given:</strong> {decryptedPatientDetails.advice}</p>
        <p><strong>Follow Up:</strong> {decryptedPatientDetails.followUp}</p>
      </div>
    </div>
  );
};

export default PrescriptionDisplay;
