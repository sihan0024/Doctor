import React, { useState } from 'react';
import './Prescription.css';

const AddPrescription = () => {
  const [patient, setPatient] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [note, setNote] = useState('');

  const handleAddMedicine = () => {
    const medicineName = document.getElementById('medicineName').value;
    const medicineType = document.getElementById('medicineType').value;
    const instruction = document.getElementById('instruction').value;
    const days = document.getElementById('days').value;

    if (medicineName && medicineType) {
      setMedicines([...medicines, { medicineName, medicineType, instruction, days }]);
      document.getElementById('medicineName').value = '';
      document.getElementById('medicineType').value = '';
      document.getElementById('instruction').value = '';
      document.getElementById('days').value = '';
    }
  };

  const handleSendPrescription = () => {
    // Logic for sending prescription can be added here
    console.log('Sending Prescription:', { patient, prescriptionDate, medicines, diagnosis, note });
  };

  return (
    <div className="add-prescription-container">
      <h1>Good Morning, Dr Sheril</h1>
      <h2>Add Prescription</h2>

      <div className="form-group">
        <label>Select Patient *</label>
        <select value={patient} onChange={(e) => setPatient(e.target.value)}>
          <option value="">Select</option>
          {/* Add patient options here */}
        </select>
      </div>

      <div className="form-group">
        <label>Prescription Date *</label>
        <input type="date" value={prescriptionDate} onChange={(e) => setPrescriptionDate(e.target.value)} required />
      </div>

      <h3>Medicine</h3>
      <div className="medicine-form">
        <input type="text" id="medicineName" placeholder="Medicine Name" />
        <input type="text" id="medicineType" placeholder="Medicine Type" />
        <input type="text" id="instruction" placeholder="Instruction" />
        <input type="text" id="days" placeholder="Days" />
        <button onClick={handleAddMedicine}>Add</button>
      </div>

      <table className="medicine-table">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Medicine Type</th>
            <th>Instruction</th>
            <th>Days</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((med, index) => (
            <tr key={index}>
              <td>{med.medicineName}</td>
              <td>{med.medicineType}</td>
              <td>{med.instruction}</td>
              <td>{med.days}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Diagnosis</h3>
      <div className="diagnosis-form">
        <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Diagnosis" />
      </div>

      <h3>Note</h3>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note"></textarea>

      <div className="buttons">
        <button onClick={() => console.log('Back')}>Back</button>
        <button onClick={handleSendPrescription}>Send Prescription</button>
      </div>
    </div>
  );
};

export default AddPrescription;
