import AddMedicine from "./AddMedicine";
import Header from "./Header";
import SideBar from "./SideBar";

function MainView({ isAddMedOpen, setisAddMedOpen }) {
  return (
    <div className="main">
      <div className="btns">
        <input type="number" placeholder="Treatment duration"></input>
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
      {isAddMedOpen && <AddMedicine />}
    </div>
  );
}

export default MainView;
