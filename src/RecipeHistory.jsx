import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "./firebase";

function RecipeHistory({ patient }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    setLoading(true);
    const recipesRef = ref(database, `patients/${patient.id}/recipes`);
    get(recipesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convert to array and sort by newest first
        const arr = Object.values(data).reverse();
        setRecipes(arr);
      } else {
        setRecipes([]);
      }
      setLoading(false);
    });
  }, [patient]);

  return (
    <>
      <div className=" pop-up">
        <div className="recipes">
          <h2>Recipe History</h2>
          {loading ? (
            <div>Loading...</div>
          ) : recipes.length === 0 ? (
            <div className="no-recipes">There is no recipes</div>
          ) : (
            recipes.map((recipe, i) => (
              <div
                className="recipe"
                key={i}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="doctor">Dr. {recipe.drName}</div>
                <div className="date">{recipe.date}</div>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedRecipe && (
        <>
          <div className="overlay" onClick={() => setSelectedRecipe(null)} />
          <div
            className="pop-up recipe-popup"
            style={{ minWidth: 350, maxWidth: 500 }}
          >
            <h2>Prescription Details</h2>
            <div>
              <strong>Date:</strong> {selectedRecipe.date}
            </div>
            <div>
              <strong>Doctor:</strong> {selectedRecipe.drName}
            </div>
            <div>
              <strong>Treatment Duration:</strong>{" "}
              {selectedRecipe.treatmentDuration} days
            </div>
            <div>
              <strong>Medicines:</strong>
              <ul>
                {selectedRecipe.medicines &&
                  selectedRecipe.medicines.map((med, idx) => (
                    <li key={idx}>
                      <div>
                        <strong>{med.medName}</strong> ({med.dose}) –{" "}
                        {med.quantity}x every {med.repititionAfter} day(s)
                      </div>
                      {med.tasks && med.tasks.length > 0 && (
                        <ul>
                          {med.tasks.map((task, tIdx) => (
                            <li key={tIdx}>
                              <span>
                                <strong>Time:</strong> {task.hour}
                                {task.note && (
                                  <>
                                    {" "}
                                    | <strong>Note:</strong> {task.note}
                                  </>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
            <button className="active" onClick={() => setSelectedRecipe(null)}>
              Close
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default RecipeHistory;
