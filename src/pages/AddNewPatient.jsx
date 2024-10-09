import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config'; // Import your Firebase config
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import './AddNewPatient.css';

const AddNewPatient = () => {
  const [patientData, setPatientData] = useState({
    referenceNo: '',
    name: '',
    phone: '',
    gender: '',
    nic: '',
    email: '', // Optional email field
    bloodGroup: '',
    address: '',
    dob: '',
    allergies: ''
  });

  const [message, setMessage] = useState('');

  // Function to generate the reference number
  const generateReferenceNo = async () => {
    try {
      // Fetch all patients from Firestore to determine the next number
      const querySnapshot = await getDocs(collection(db, 'Patients'));
      const totalPatients = querySnapshot.size + 1; // Increment the count for the new patient
      const referenceNo = `REF-2024${totalPatients}`; // Format the reference number
      setPatientData((prevData) => ({ ...prevData, referenceNo }));
    } catch (error) {
      console.error('Error generating reference number:', error);
    }
  };

  useEffect(() => {
    // Generate the reference number when the component mounts
    generateReferenceNo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new document in Firestore with NIC as the document ID
      await setDoc(doc(db, 'Patients', patientData.nic), patientData);
      setMessage('Patient registered successfully!');

      // Reset form fields after successful submission
      setPatientData({
        referenceNo: '',
        name: '',
        phone: '',
        gender: '',
        nic: '',
        email: '',
        bloodGroup: '',
        address: '',
        dob: '',
        allergies: ''
      });

      // Generate a new reference number for the next patient
      generateReferenceNo();
    } catch (error) {
      console.error('Error registering patient:', error);
      setMessage('Failed to register patient. Please try again.');
    }
  };

  return (
    <div className="add-new-patient-container">
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Reference No:</label>
          <input type="text" name="referenceNo" value={patientData.referenceNo} readOnly />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={patientData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone no:</label>
          <input type="text" name="phone" value={patientData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select name="gender" value={patientData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>NIC:</label>
          <input type="text" name="nic" value={patientData.nic} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email (Optional):</label> {/* Email field is optional */}
          <input type="email" name="email" value={patientData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Blood Group:</label>
          <input type="text" name="bloodGroup" value={patientData.bloodGroup} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input type="text" name="address" value={patientData.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input type="date" name="dob" value={patientData.dob} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Allergies or Other:</label>
          <input type="text" name="allergies" value={patientData.allergies} onChange={handleChange} />
        </div>

        <button type="submit" className="register-button">Register</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddNewPatient;
