import { useState } from "react";
import AddMedicine from "./AddMedicine";
// import { generatePDF } from "./generatePDF";

function Prescription({ handlePrescription, handlePrint }) {
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const [date, setDate] = useState(today);
  const [duration, setDuration] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [isAddMedOpen, setisAddMedOpen] = useState(false);

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  // const calculateAge = (birthDate) => {
  //   const dob = new Date(birthDate);
  //   const diff = Date.now() - dob.getTime();
  //   const age = new Date(diff);
  //   return Math.abs(age.getUTCFullYear() - 1970);
  // };
  // const handlePrint = () => {
  //   generatePDF({
  //     doctor,
  //     patient,
  //     duration,
  //     medList,
  //     prescriptionId,
  //     calculateAge,
  //   });
  // };
  return (
    <>
      <div className="prescription">
        <div className="btns">
          <input
            type="number"
            placeholder=" Treatment duration"
            onChange={(e) => {
              setDuration(Number(e.target.value));
            }}
            value={duration}
          ></input>
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
          ></input>
          <button
            className="active add-"
            onClick={(e) => {
              e.stopPropagation();
              setisAddMedOpen(true);
            }}
          >
            Add Medicine
          </button>
        </div>
        <div className="medicines">
          {medicines.map((medicine) => (
            <div className="medicine" key={medicine.medName}>
              {medicine.medName}
            </div>
          ))}
        </div>
        <button
          className="active"
          onClick={() => {
            handlePrint();
            handlePrescription({
              date: formatDate(date),
              treatmentDuration: duration,
              medicines: medicines,
            });
          }}
        >
          Save
        </button>
      </div>
      {isAddMedOpen && (
        <>
          <div className="overlay" onClick={() => setisAddMedOpen(false)}></div>
          <AddMedicine
            setisAddMedOpen={setisAddMedOpen}
            setMedicines={setMedicines}
          />
        </>
      )}
    </>
  );
}

export default Prescription;
