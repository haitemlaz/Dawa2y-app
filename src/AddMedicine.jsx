import { useReducer, useState } from "react";
const initialState = {
  medName: "",
  dose: "",
  quantity: 0,
  repititionAfter: 1,
  schedule: [],
};
function reducer(state, action) {
  switch (action.type) {
    case "medName":
      return {
        ...state,
        medName: action.payload,
      };
    case "dose":
      return {
        ...state,
        dose: action.payload,
      };
    case "quantity":
      return {
        ...state,
        quantity: action.payload,
      };
    case "repititionAfter":
      return {
        ...state,
        repititionAfter: action.payload,
      };
    case "time":
      return {
        ...state,
        schedule:
          state.schedule.length === action.payload.index + 1
            ? [...state.schedule, { hour: action.payload.time }]
            : state.schedule.map((item, i) =>
                i === action.payload.index
                  ? { ...item, hour: action.payload.timme }
                  : item
              ),
      };
  }
}
function AddMedicine({ setisAddMedOpen }) {
  const [scheduleSize, setScheduleSize] = useState(1);
  const [{ medName, dose, quantity, repititionAfter, schedule }, dispatch] =
    useReducer(reducer, initialState);
  return (
    <form className="add-medicine pop-up" onClick={(e) => e.stopPropagation()}>
      <h1>Add medicine</h1>
      <label htmlFor="med-name">Name</label>
      <input
        type="text"
        id="med-name"
        onChange={(e) => dispatch({ type: "medName", payload: e.target.value })}
        value={medName}
      ></input>
      <label htmlFor="dose">Dose</label>
      <input
        type="text"
        id="dose"
        onChange={(e) => dispatch({ type: "dose", payload: e.target.value })}
        value={dose}
      ></input>
      <label htmlFor="Quantity">Quantity</label>
      <input
        type="number"
        id="Quantity"
        onChange={(e) =>
          dispatch({ type: "quantity", payload: Number(e.target.value) })
        }
        value={quantity}
      ></input>
      <label htmlFor="repititionAfter">Consum every </label>
      <div>
        <input
          type="number"
          name="repititionAfter"
          id="repititionAfter"
          placeholder="1"
          onChange={(e) =>
            dispatch({
              type: "repititionAfter",
              payload: Number(e.target.value),
            })
          }
          value={repititionAfter}
        ></input>
        days
      </div>
      <label>Schedule</label>
      <div className="schedule">
        {Array.from(
          { length: schedule.length === 0 ? 1 : schedule.length },
          (_, i) => (
            <div className="intake-time" key={i}>
              <label htmlFor={`intake-time-${i}`}>Intake time</label>
              <input
                id={`intake-time-${i}`}
                type="time"
                onChange={(e) =>
                  dispatch({
                    type: "time",
                    payload: { time: e.target.value, index: i },
                  })
                }
              ></input>
              <textarea placeholder="Notes ..." rows={2} cols={50}></textarea>
            </div>
          )
        )}
      </div>
      <button
        className="add-intake-time active"
        type="button"
        onClick={() => {
          console.log(scheduleSize);
          setScheduleSize((prev) => prev + 1);
        }}
      >
        Add
      </button>
      <div className="control-btns">
        <button className="confirm-btn active" type="button">
          Confirm
        </button>
        <button type="button" onClick={() => setisAddMedOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddMedicine;
