import AddMedicine from "./AddMedicine";
import Header from "./Header";
import SideBar from "./SideBar";
// import { database } from "./firebase";

function MainView({ isAddMedOpen, setisAddMedOpen, setPatient, patient }) {
  return (
    <>
      {" "}
      <Header setPatient={setPatient} />
      <div className="main-content">
        <div className=" pop-up profile">
          {patient && patient.name ? (
            <>
              <h2>User Information</h2>
              <p>
                <strong>Name:</strong>
                {patient.name}
              </p>
              <p>
                <strong>Age:</strong> {patient.age}
              </p>
              <p>
                <strong>Gender:</strong> {patient.sex}
              </p>
              <p>
                <strong>Phone:</strong> {patient.phone}
              </p>
              <p>
                <strong>Email:</strong> {patient.email}
              </p>
              <p>
                <strong>Insurance:</strong>{" "}
                {patient.insurance === 0 ? "Unavailable" : "Available"}
              </p>
            </>
          ) : (
            "No Patient is Selected"
          )}
        </div>
        <div className="prescription">
          <div className="btns">
            <input type="number" placeholder=" Treatment duration"></input>
            <input type="date"></input>

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
        </div>
      </div>
      {isAddMedOpen && (
        <>
          <div className="overlay" onClick={() => setisAddMedOpen(false)}></div>
          <AddMedicine setisAddMedOpen={setisAddMedOpen} />
        </>
      )}
    </>
  );
}

export default MainView;
