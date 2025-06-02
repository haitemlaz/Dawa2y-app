import { useState } from "react";
import "./App.css";
import Header from "./Header";
import MainView from "./MainView";
import SideBar from "./SideBar";
import StartMenu from "./StartMenu";
import { useEffect } from "react";
import firebaseApp from "./firebase";
import Login from "./login";

function App() {
  const [page, SetPage] = useState("login");
  const [patient, setPatient] = useState({});

  const [isAddMedOpen, setisAddMedOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    try {
      const appName = firebaseApp.name;
      console.log(`✅ Firebase initialized: ${appName}`);
    } catch (error) {
      console.error("❌ Firebase connection failed:", error);
    }
  }, []);

  return (
    <>
      {}
      {page === "patient" && (
        <div className="workspace">
          {isOpen && <SideBar />}
          <div className="main">
            {page === "start" && <StartMenu SetPage={SetPage} />}
            <MainView
              isAddMedOpen={isAddMedOpen}
              setisAddMedOpen={setisAddMedOpen}
              setPatient={setPatient}
              patient={patient}
            />
          </div>
        </div>
      )}
      {page === "login" && <Login SetPage={SetPage} />}
    </>
  );
}
export default App;
