import { useState } from "react";

function AddMedicine({setisAddMedOpen}) {
  const [scheduleSize,setScheduleSize]=useState(1)
  return (
    <form className="add-medicine pop-up" onClick={(e) => e.stopPropagation()}>
      <h1>Add medicine</h1>
      <label htmlFor="med-name">Name</label>
      <input type="text" id="med-name"></input>
      <label htmlFor="dose">Dose</label>
      <input type="text" id="dose"></input>
      <label htmlFor="Quantity">Quantity</label>
      <input type="number" id="Quantity"></input>
      <label htmlFor="repititionAfter">Consum every </label>
      <div>
        <input
          type="number"
          name="repititionAfter"
          id="repititionAfter"
          placeholder="1"
        ></input>
        days
      </div>
      <label>Schedule</label>
      <div className="schedule">
        {Array.from({ length: scheduleSize }, (_, i) => (
          <div className="intake-time" key={i}>
            <label htmlFor={`intake-time-${i}`}>Intake time</label>{" "}
            <input id={`intake-time-${i}`} type="time"></input>
            <textarea placeholder="Notes ..." rows={2} cols={50}></textarea>
          </div>
        ))}

       
      </div>
       <button className="add-intake-time active" type="button" onClick={()=>{console.log(scheduleSize)
          setScheduleSize(prev=>prev+1)}}>
          Add
        </button>
      <div className="control-btns">
        <button className="confirm-btn active" type="button">
          Confirm
        </button>
        <button type="button" onClick={() => setisAddMedOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}

export default AddMedicine;
