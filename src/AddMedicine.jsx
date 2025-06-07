import { useReducer } from "react";
const initialState = {
  medName: "",
  dose: "",
  quantity: 0,
  repititionAfter: 1,
  tasks: [{ hour: "", note: "" }],
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
    case "add task":
      return {
        ...state,
        tasks: [...state.tasks, { hour: "", note: "" }],
      };
    case "time":
      return {
        ...state,
        tasks: state.tasks.map((item, index) =>
          index === action.payload.index
            ? { ...item, hour: action.payload.time }
            : item
        ),
      };
    case "note":
      return {
        ...state,
        tasks: state.tasks.map((item, index) =>
          index === action.payload.index
            ? { ...item, note: action.payload.note }
            : item
        ),
      };
  }
}
function AddMedicine({ setisAddMedOpen, setMedicines }) {
  // const [tasksSize, settasksSize] = useState(1);
  const [medicine, dispatch] = useReducer(reducer, initialState);
  const { medName, dose, quantity, repititionAfter, tasks } = medicine;
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
      <label>tasks</label>
      <div className="tasks">
        {Array.from({ length: tasks.length }, (_, i) => (
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
              value={tasks[i].hour}
            ></input>
            <textarea
              placeholder="Notes ..."
              rows={2}
              cols={50}
              onChange={(e) =>
                dispatch({
                  type: "note",
                  payload: { note: e.target.value, index: i },
                })
              }
              value={tasks[i].note}
            ></textarea>
          </div>
        ))}
      </div>
      <button
        className="add-intake-time active"
        type="button"
        onClick={() => {
          dispatch({ type: "add task", payload: "" });
        }}
      >
        Add
      </button>
      <div className="control-btns">
        <button
          className="confirm-btn active"
          type="button"
          onClick={() => {
            setMedicines((list) => [...list, medicine]);
            setisAddMedOpen(false);
          }}
        >
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
