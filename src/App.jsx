import { useState } from "react";
import "./App.css";
import Header from "./Header";
import MainView from "./MainView";
import SideBar from "./SideBar";
import StartMenu from "./StartMenu";

function App() {
  const [page, SetPage] = useState("start");

  const [isAddMedOpen, setisAddMedOpen] = useState(false);
  const isOpen = true;
  return (
    <>
      <Header />
      {page === "start" && <StartMenu SetPage={SetPage}/>}

      {page === "patient" && (
        <div className="main-content">
          {isOpen ? <SideBar /> : null}
          <MainView
            isAddMedOpen={isAddMedOpen}
            setisAddMedOpen={setisAddMedOpen}
          />
        </div>
      )}
    </>
  );
}
export default App;
