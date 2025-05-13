import { useEffect, useState, useContext } from "react";
import { UserContext } from "../userContext";
import { Navigate } from "react-router-dom";
import generateIcon from "../assets/generiraj-white.svg";
import {
  faCarrot,
  faFish,
  faCheese,
  faEgg,
  faBreadSlice,
  faAppleAlt,
  faDrumstickBite,
  faPepperHot,
  faLeaf,
  faBacon,
  faCookie,
  faLemon,
  faIceCream,
  faPizzaSlice,
  faHamburger,
  faHotdog,
  faSeedling,
  faBottleWater,
  faWineBottle,
  faMugHot,
} from "@fortawesome/free-solid-svg-icons";
import IngredientsGenerate from "./IngredientsGenerate";
import Basket from "./Basket";
import GenerateFilters from "./GenerateFilters";

function GenerateShow() {
  const userContext = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/myfridge`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unauthorized or other server error");
        }
        return response.json();
      })
      .then((data) => {
        const iconMap = {
          "faCarrot": faCarrot,
          "faFish": faFish,
          "faCheese": faCheese,
          "faEgg": faEgg,
          "faBreadSlice": faBreadSlice,
          "faAppleAlt": faAppleAlt,
          "faDrumstickBite": faDrumstickBite,
          "faPepperHot": faPepperHot,
          "faLeaf": faLeaf,
          "faBacon": faBacon,
          "faCookie": faCookie,
          "faLemon": faLemon,
          "faIceCream": faIceCream,
          "faPizzaSlice": faPizzaSlice,
          "faHamburger": faHamburger,
          "faHotdog": faHotdog,
          "faSeedling": faSeedling,
          "faBottleWater": faBottleWater,
          "faWineBottle": faWineBottle,
          "faMugHot": faMugHot,
        };

        const itemsWithIcons = data.map((item) => ({
          ...item,
          icon: iconMap[item.icon] || faCarrot, // default fallback icon
        }));

        setFoodItems(itemsWithIcons);
      })
      .catch((error) => console.error("Error fetching fridge:", error));
  }, []);

  if (!userContext.user) return <Navigate replace to="/login" />;

  const filteredItems = foodItems.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemRemove = (item) => {
    setSelectedItems(selectedItems.filter((selected) => selected !== item));
  };

  const handleItemSelection = (itemName) => {
    setSelectedItems((prevItems) =>
      prevItems.includes(itemName)
        ? prevItems.filter((item) => item !== itemName)
        : [...prevItems, itemName]
    );
  };

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
                Generiraj recept
                <div style={{ fontSize: "1.6rem" }}>
                  1. Izberite sestavine iz vašega hladilnika
                </div>
                <IngredientsGenerate
                  foodItems={filteredItems}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedItems={selectedItems}
                  handleItemSelection={handleItemSelection}
                />
              </div>
              <hr
                style={{
                  margin: "40px auto",
                  width: "80%",
                  borderTop: "1px solid #ccc",
                }}
              />
              <GenerateFilters />
              <hr
                style={{
                  margin: "40px auto",
                  width: "80%",
                  borderTop: "1px solid #ccc",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Basket
        showMenu={showMenu}
        handleItemRemove={handleItemRemove}
        setShowMenu={setShowMenu}
        selectedItems={selectedItems}
      />

      <div
        style={{
          position: "fixed",
          bottom: "50px",
          right: "20px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 20px",
          borderRadius: "30px",
          backgroundColor: "#b0d16b",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        <span style={{ fontSize: "1rem", color: "white", marginRight: "10px" }}>
          Generiraj recept
        </span>
        <img
          src={generateIcon}
          alt="Generiraj"
          style={{ width: "30px", height: "30px" }}
        />
      </div>
    </div>
  );
}

export default GenerateShow;
