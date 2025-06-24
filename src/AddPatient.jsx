import { useState } from "react";
import { database, auth } from "./firebase";
import { ref, get, set } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";

function AddPatient({ onClose }) {
  const [step, setStep] = useState("verify"); // "verify" or "form"
  const [patientId, setPatientId] = useState("");
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    insurence: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleVerify = async () => {
    if (!patientId.trim()) {
      alert("Please enter the patient's id");
      return;
    }
    const patientsRef = ref(database, "patients");
    const snapshot = await get(patientsRef);
    const patientsData = snapshot.exists() ? snapshot.val() : {};
    if (patientsData.hasOwnProperty(patientId.trim())) {
      alert("This id already exists");
      return;
    }
    setStep("form");
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddPatient = async () => {
    const {
      name,
      age,
      gender,
      phone,
      insurence,
      email,
      password,
      confirmPassword,
    } = form;
    if (!name || !age || !gender) {
      alert("Please fill the required fields");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const patientRef = ref(database, `patients/${patientId.trim()}`);
      await set(patientRef, {
        id: patientId.trim(),
        name,
        "birth date": formatDate(age),
        sex: gender,
        phone,
        insurence: parseInt(insurence) || 0,
        email,
      });
      alert("Patient added successfully!");
      onClose();
    } catch (err) {
      alert("Error adding patient: " + err.message);
    }
  };
  function formatDate(dateString) {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  return (
    <div className="pop-up add-patient">
      {step === "verify" ? (
        <>
          <h2>Verify Patient ID</h2>
          <input
            type="text"
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <div style={{ marginTop: 16 }}>
            <button className="active" onClick={handleVerify}>
              Verify
            </button>
            <button onClick={onClose} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>Add Patient</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="date"
            name="age"
            placeholder="Birth Date"
            value={form.age}
            onChange={handleChange}
          />
          <label htmlFor="gender">Gender</label>
          <select
            name="gender"
            id="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          <label htmlFor="insurence">Insurance</label>
          <select
            name="insurence"
            id="insurence"
            value={form.insurence}
            onChange={handleChange}
          >
            <option value="">Select Insurance</option>
            <option value="1">Available</option>
            <option value="0">Unavailable</option>
          </select>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <div style={{ marginTop: 16 }}>
            <button className="active" onClick={handleAddPatient}>
              Add Patient
            </button>
            <button onClick={onClose} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AddPatient;
