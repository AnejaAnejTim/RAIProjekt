import {useEffect, useState} from "react";
import iconMap from "../utils/iconMap";
import IngredientsMyFridge from "./IngredientsMyFridge";

function MyFridge() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fridgeItems, setFridgeItems] = useState([]);

  const handleItemSelection = (itemLabel) => {
    setSelectedItems((prev) =>
      prev.includes(itemLabel)
        ? prev.filter((label) => label !== itemLabel)
        : [...prev, itemLabel]
    );
  };

  function handleRemoveItemFromList(itemId) {
    setFridgeItems(prevItems => prevItems.filter(item => item._id !== itemId));
  }


  useEffect(() => {
    fetch(`/myfridge`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unauthorized or other server error");
        }
        return response.json();
      })
      .then((data) => {
        const itemsWithIcons = data.map((item) => ({
          ...item,
          icon: iconMap[item.icon] || iconMap.faCarrot,
        }));

        setFridgeItems(itemsWithIcons);
      })
      .catch((error) => console.error("Error fetching fridge:", error));
  }, []);

  return (
    <div className="position-relative">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col col-xl-10">
          <div className="row g-0">
            <div className="col-12">
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  fontSize: "2rem",
                  color: "#333",
                }}
              >
                Vaš hladilnik
                <div style={{fontSize: "1.6rem"}}>
                  Tukaj imate pregled vseh vaših sestavin
                </div>
                <IngredientsMyFridge
                  foodItems={fridgeItems}
                  selectedItems={selectedItems}
                  handleItemSelection={handleItemSelection}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onRemoveItem={handleRemoveItemFromList}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyFridge;
