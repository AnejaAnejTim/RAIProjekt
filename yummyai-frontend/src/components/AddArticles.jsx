import { useState } from "react";
import addIcon from "../assets/plus-white.svg";
import removeIcon from "../assets/x-white.svg";
import submitIcon from "../assets/submit-white.svg";

const MAX_ROWS = 10;
const MIN_ROWS = 1;

const initialIngredient = { name: "", quantity: "", unit: "g" };

const AddArticles = () => {
  const [ingredients, setIngredients] = useState([{ ...initialIngredient }]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addRow = () => {
    if (ingredients.length < MAX_ROWS) {
      setIngredients([...ingredients, { ...initialIngredient }]);
    }
  };

  const removeRow = () => {
    if (ingredients.length > MIN_ROWS) {
      setIngredients(ingredients.slice(0, -1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyField = ingredients.some(
      (ingredient) =>
        !ingredient.name.trim() || !ingredient.quantity || !ingredient.unit
    );

    if (hasEmptyField) {
      alert("Prosimo, izpolnite vsa polja za vsako sestavino.");
      return;
    }

    setLoading(true);

    const res = await fetch("/myfridge", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingredients),
    });

    setLoading(false);

    if (res.status === 201) {
      window.location.replace("/myfridge");
    } else {
      console.log("Napaka pri vnosu sestavin:", res);
    }
  };

  return (
    <div className="container mt-4">
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Nalaganje...</span>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h1 style={{ color: "#333", fontSize: "2rem" }}>Napolni svoj hladilnik!</h1>
        <div style={{ fontSize: "1.6rem", color: "#333" }}>
          Vnesi vse sestavine, ki jih imaš trenutno doma
        </div>
      </div>

          <form onSubmit={handleSubmit}>
      <div id="form-container" className="d-flex flex-column align-items-center">
        {ingredients.map((ingredient, index) => (
          <div className="form-row one-ingri mb-3 w-75" key={index}>
            <div className="form-group mb-2">
              <label style={{ color: "#333" }}>Ime sestavine</label>
              <input
                type="text"
                className="form-control"
                value={ingredient.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label style={{ color: "#333" }}>Teža / količina</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleInputChange(index, "quantity", e.target.value)
                  }
                />
                <select
                  className="form-control"
                  value={ingredient.unit}
                  onChange={(e) =>
                    handleInputChange(index, "unit", e.target.value)
                  }
                >
                  <option value="mg">mg</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="l">l</option>
                  <option value="ml">ml</option>
                  <option value="pc">kos</option>
                </select>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>

      <div className="form-group mt-3 text-center d-flex justify-content-center gap-2 flex-wrap">
        <button
          type="button"
          style={{
            backgroundColor: "#add8e6",
            border: "none",
            color: "white",
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            borderRadius: "6px",
          }}
          onClick={addRow}
          disabled={ingredients.length >= MAX_ROWS}
        >
          <span style={{ fontSize: "1rem", marginRight: "10px" }}>Dodaj vrstico</span>
          <img src={addIcon} alt="Dodaj" style={{ width: "24px", height: "24px" }} />
        </button>

        <button
          type="button"
          style={{
            backgroundColor: "#e84138",
            border: "none",
            color: "white",
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            borderRadius: "6px",
          }}
          onClick={removeRow}
          disabled={ingredients.length <= MIN_ROWS}
        >
          <span style={{ fontSize: "1rem", marginRight: "10px" }}>Odstrani vrstico</span>
          <img src={removeIcon} alt="Odstrani" style={{ width: "24px", height: "24px" }} />
        </button>

        <button
          type="submit"
          style={{
            backgroundColor: "#b0d16b",
            border: "none",
            color: "white",
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            borderRadius: "6px",
          }}
        >
          <span style={{ fontSize: "1rem", marginRight: "10px" }}>Vnesi</span>
          <img src={submitIcon} alt="Vnesi" style={{ width: "24px", height: "24px" }} />
        </button>
      </div>
    </form>
    </div>
  );
};

export default AddArticles;
