function AddMedicine() {
  return (
    <form className="add-medicine" onClick={(e) => e.stopPropagation()}>
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
        <div className="intake-time">
          <label htmlFor="intake-time">Intake time</label>{" "}
          <input id="intake-time" type="time"></input>
          <textarea placeholder="Notes ..." rows={2} cols={50}></textarea>
        </div>

        <button className="add-intake-time active" type="button">
          Add
        </button>
      </div>
      <div className="control-btns">
        <button className="confirm-btn active" type="button">
          Confirm
        </button>
        <button type="button">Cancel</button>
      </div>
    </form>
  );
}

export default AddMedicine;
