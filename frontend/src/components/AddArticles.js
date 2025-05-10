import { useState } from "react";

const MAX_ROWS = 10;
const MIN_ROWS = 1;

const initialIngredient = { name: "", quantity: "", unit: "g" };

const AddArticles = () => {
  const [ingredients, setIngredients] = useState([{ ...initialIngredient }]);

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
      alert("Please fill out all fields for every ingredient.");
      return;
    }
    const res = await fetch("http://localhost:3001/myfridge", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingredients),
    });
   
    if(res.status === 201){
       console.log(res)
      window.location.replace("/myfridge");
    }else{
      console.log(res)
    }
  };

  return (
    <div className="container mt-4">
      <h1 style={{ color: "rgb(163,188,4)" }}>Hello!</h1>
      <p
        style={{
          color: "rgb(163,188,4)",
          fontFamily: "Marker Felt, fantasy",
          fontSize: 24,
        }}
      >
        Let's generate a recipe together!
      </p>
      <p style={{ color: "rgb(163,188,4)" }}>
        • Enter the name and weight of each ingredient you have in your pantry.
        <br />
        • Click "Submit" to generate a recipe.
        <br />
        • Follow and rate the recipe, and optionally share it.
        <br />
      </p>
      <form onSubmit={handleSubmit}>
        <h2 style={{ color: "rgb(163,188,4)" }}>Enter your ingredients!</h2>
        <div id="form-container">
          {ingredients.map((ingredient, index) => (
            <div className="form-row one-ingri" key={index}>
              <div className="form-group col-md-10">
                <label style={{ color: "rgb(163,188,4)" }}>Ingredient</label>
                <input
                  type="text"
                  className="form-control"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
              </div>
              <div className="form-group col-md-10">
                <label style={{ color: "rgb(163,188,4)" }}>
                  Weight/quantity
                </label>
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
                    <option value="pc">pc</option>
                  </select>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
        <div className="form-group mt-2">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={addRow}
            disabled={ingredients.length >= MAX_ROWS}
          >
            Add more
          </button>
          <button
            type="button"
            className="btn btn-danger me-2"
            onClick={removeRow}
            disabled={ingredients.length <= MIN_ROWS}
          >
            Remove
          </button>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArticles;
