import { useState } from "react";

const initialAppointments = [
  {
    id: 1,
    patient: "Sarah Johnson",
    date: "2025-06-10",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    patient: "Ali Meziane",
    date: "2025-06-11",
    time: "2:30 PM",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Laura Chen",
    date: "2025-06-12",
    time: "9:00 AM",
    status: "Cancelled",
  },
];

function Appointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [currentDate, setCurrentDate] = useState("2025-06-08");
  const [formData, setFormData] = useState({
    patient: "",
    time: "",
    status: "Pending",
  });

  const changeDate = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate.toISOString().split("T")[0]);
  };

  const handleInput = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addAppointment = () => {
    if (!formData.patient || !formData.time) return;
    const newAppointment = {
      id: Date.now(),
      patient: formData.patient,
      date: currentDate,
      time: formData.time,
      status: formData.status,
    };
    setAppointments((prev) => [...prev, newAppointment]);
    setFormData({ patient: "", time: "", status: "Pending" });
  };

  const deleteAppointment = (id) => {
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  const filtered = appointments.filter((a) => a.date === currentDate);

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <button onClick={() => changeDate(-1)}>&lt; Prev</button>
        <h2>{currentDate}</h2>
        <button onClick={() => changeDate(1)}>Next &gt;</button>
      </div>

      <div className="appointments-form">
        <input
          name="patient"
          placeholder="Patient Name"
          value={formData.patient}
          onChange={handleInput}
        />
        <input
          name="time"
          type="time"
          value={formData.time}
          onChange={handleInput}
        />
        <select name="status" value={formData.status} onChange={handleInput}>
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Cancelled</option>
        </select>
        <button onClick={addAppointment}>Add</button>
      </div>

      <ul className="appointments-list">
        {filtered.length === 0 ? (
          <p className="no-appointments">No appointments for this day.</p>
        ) : (
          filtered.map((appt) => (
            <li key={appt.id} className="appointment-item">
              <div className="appointment-info">
                <p className="patient-name">{appt.patient}</p>
                <p className="appointment-date">
                  {appt.time} – {appt.status}
                </p>
              </div>
              <button
                className="delete-button"
                onClick={() => deleteAppointment(appt.id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Appointments;
