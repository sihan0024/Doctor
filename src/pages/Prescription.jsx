import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import './Prescription.css';

const AddPrescription = () => {
  const location = useLocation();
  const { doctorId } = location.state || {};
  const navigate = useNavigate();
  const [patient, setPatient] = useState('');
  const [patientsList, setPatientsList] = useState([]);
  const [doctorName] = useState('Dr. Umesha De Silva');
  const [biography] = useState('M.B.B.S., M.D., M.S. | Reg. No: D07');
  const [contactNo] = useState('0719878689');
  const [referenceNo, setReferenceNo] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [note, setNote] = useState('');

  const [medicinesList, setMedicinesList] = useState([]);
  const [inputMedicineName, setInputMedicineName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [addedMedicines, setAddedMedicines] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [medicineType, setMedicineType] = useState('');
  const [instruction, setInstruction] = useState('');
  const [days, setDays] = useState('');

  // Fetch medicines from Firestore
  useEffect(() => {
    const fetchMedicines = async () => {
      const medicineCollection = collection(db, 'Medicine');
      const medicineSnapshot = await getDocs(medicineCollection);
      const fetchedMedicines = medicineSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMedicinesList(fetchedMedicines);
    };

    fetchMedicines();
  }, []);

  // Fetch patients for the doctor
  useEffect(() => {
    const fetchPatients = async () => {
      if (!doctorId) {
        console.error('Doctor ID is undefined');
        return;
      }

      const appointmentsCollection = collection(db, 'Appointments');
      const q = query(appointmentsCollection, where('doctorId', '==', doctorId));
      const appointmentSnapshot = await getDocs(q);
      const fetchedPatients = appointmentSnapshot.docs.map((doc) => ({
        id: doc.id,
        patientName: doc.data().patientName,
        appointmentNumber: doc.data().appointmentNumber,
      }));

      setPatientsList(fetchedPatients);
    };

    fetchPatients();
  }, [doctorId]);

  const handlePatientSelect = (e) => {
    const selectedPatient = patientsList.find((p) => p.patientName === e.target.value);
    setPatient(selectedPatient.patientName);
    setReferenceNo(selectedPatient.appointmentNumber.slice(-4)); // Get last four digits
  };

  const handleMedicineChange = (e) => {
    const value = e.target.value;
    setInputMedicineName(value);

    if (value.length > 0) {
      const filteredSuggestions = medicinesList.filter((med) =>
        med.medicineName && med.medicineName.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setActiveSuggestionIndex(0);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectMedicine = (medicine) => {
    setInputMedicineName(medicine.medicineName);
    setSelectedMedicine(medicine);
    setMedicineType(medicine.medicineType); // Set medicine type based on selection
    setSuggestions([]);
  };

  const handleAddMedicine = async () => {
    if (inputMedicineName) {
      const existingMedicineIndex = addedMedicines.findIndex(
        (med) => med.medicineName === inputMedicineName
      );

      if (selectedMedicine) {
        // Update existing medicine if it exists
        if (existingMedicineIndex !== -1) {
          setAddedMedicines((prev) =>
            prev.map((med, index) =>
              index === existingMedicineIndex
                ? {
                    ...med,
                    medicineType: `${med.medicineType}, ${selectedMedicine.medicineType}`, // Append type
                    instruction: instruction, // Update instruction
                    days: days, // Update days
                  }
                : med
            )
          );
        } else {
          // Add new medicine
          setAddedMedicines((prev) => [
            ...prev,
            {
              medicineName: selectedMedicine.medicineName,
              medicineType: selectedMedicine.medicineType,
              instruction,
              days,
            },
          ]);
        }
      } else {
        const newMedicine = {
          medicineName: inputMedicineName,
          medicineType,
          isHidden: false,
          brandName: inputMedicineName.toLowerCase(),
          price: '0', // Default price
        };

        try {
          const medicineRef = doc(db, 'Medicine', inputMedicineName.toLowerCase());
          await setDoc(medicineRef, newMedicine);
          setAddedMedicines((prev) => [
            ...prev,
            {
              medicineName: inputMedicineName,
              medicineType,
              instruction,
              days,
            },
          ]);
        } catch (error) {
          console.error('Error adding new medicine: ', error);
        }
      }

      // Clear input fields
      setInputMedicineName('');
      setMedicineType('');
      setInstruction('');
      setDays('');
      setSelectedMedicine(null);
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (suggestions.length > 0) {
        handleSelectMedicine(suggestions[activeSuggestionIndex]); // Select highlighted suggestion
      } else if (e.target.id === 'instruction' || e.target.id === 'days') {
        handleAddMedicine(); // Add medicine when Enter is pressed in instruction or days field
      }
    } else if (e.key === 'ArrowDown') {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex === 0 ? suggestions.length - 1 : prevIndex - 1
      );
    }
  };

  const handleSendPrescription = () => {
    navigate('/summary', {
      state: {
        patient,
        prescriptionDate,
        diagnosis,
        note,
        medicines: addedMedicines,
        doctorName,
        biography,
        contactNo,
        referenceNo,
      },
    });
  };

  return (
    <div className="add-prescription-container">
      <h1>Add Prescription</h1>

      <div className="form-group">
        <label>Patient Name *</label>
        <select value={patient} onChange={handlePatientSelect} required>
          <option value="">Select a patient</option>
          {patientsList.map((patient, index) => (
            <option key={index} value={patient.patientName}>
              {patient.patientName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Reference No *</label>
        <input
          type="text"
          value={referenceNo}
          onChange={(e) => setReferenceNo(e.target.value)}
          required
          readOnly
        />
      </div>

      <div className="form-group">
        <label>Prescription Date *</label>
        <input
          type="date"
          value={prescriptionDate}
          onChange={(e) => setPrescriptionDate(e.target.value)}
          required
        />
      </div>

      <h3>Medicine</h3>
      <div className="medicine-form">
        <input
          type="text"
          value={inputMedicineName}
          onChange={handleMedicineChange}
          onKeyDown={handleKeyPress}
          placeholder="Medicine Name"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((med, index) => (
              <li
                key={med.id}
                className={index === activeSuggestionIndex ? 'active' : ''}
                onClick={() => handleSelectMedicine(med)}
              >
                {med.medicineName}
              </li>
            ))}
          </ul>
        )}
        <input
          type="text"
          value={medicineType}
          onChange={(e) => setMedicineType(e.target.value)} // Update medicine type here
          placeholder="Medicine Type"
        />

        <input
          type="text"
          id="instruction"
          value={instruction}
          placeholder="Instruction"
          onChange={(e) => setInstruction(e.target.value)} // Handle input change
          onKeyDown={handleKeyPress}
        />
        <input
          type="text"
          id="days"
          value={days}
          placeholder="Days"
          onChange={(e) => setDays(e.target.value)} // Handle input change
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleAddMedicine}>Add Medicine</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Medicine Type</th>
            <th>Instruction</th>
            <th>Days</th>
          </tr>
        </thead>
        <tbody>
          {addedMedicines.map((med, index) => (
            <tr key={index}>
              <td>{med.medicineName}</td>
              <td>{med.medicineType}</td>
              <td>{med.instruction}</td>
              <td>{med.days}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-group">
        <label>Diagnosis *</label>
        <input
          type="text"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button onClick={handleSendPrescription}>Send Prescription</button>
    </div>
  );
};

export default AddPrescription;
