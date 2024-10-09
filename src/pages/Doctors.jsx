import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import '../pages/Doctor.css';

const AddPatient = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    gender: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleRegister = async () => {
    try {
      const patientsCollection = collection(db, 'Patients');
      await addDoc(patientsCollection, patient);
      alert('Patient registered successfully');
      navigate('/patients-list'); // Redirect to the patient list after registration
    } catch (error) {
      console.error('Error adding patient: ', error);
    }
  };

  return (
    <div className="add-new-patient-container">
      <h2>Register New Patient</h2>
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={patient.fullName}
          onChange={handleChange}
          placeholder="Enter full name"
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={patient.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={patient.phoneNumber}
          onChange={handleChange}
          placeholder="Enter phone number"
        />
      </div>
      <div className="form-group">
        <label>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={patient.dateOfBirth}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={patient.address}
          onChange={handleChange}
          placeholder="Enter address"
        />
      </div>
      <div className="form-group">
        <label>Gender</label>
        <select name="gender" value={patient.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <button className="register-button" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
};

export default AddPatient;
