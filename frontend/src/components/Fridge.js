import { useContext, useState } from "react";
import { UserContext } from "../userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAppleAlt,
  faCarrot,
  faCheese,
  faEgg,
  faGlassWhiskey,
} from "@fortawesome/free-solid-svg-icons";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Fridge() {
  const userContext = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  if (!userContext.user) return <Navigate replace to="/login" />;

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
          Apple: faAppleAlt,
          Broccoli: faCarrot,
          Cheese: faCheese,
          Eggs: faEgg,
          Milk: faGlassWhiskey,
        };

        const itemsWithIcons = data.map((item) => ({
          ...item,
          icon: iconMap[item.name] || faCarrot, // Default icon fallback
        }));

        setFoodItems(itemsWithIcons);
      })

      .catch((error) => console.error("Error fetching fridge:", error));
  }, []);

  const handleItemSelection = (itemName) => {
    setSelectedItems((prevItems) => {
      if (prevItems.includes(itemName)) {
        return prevItems.filter((item) => item !== itemName);
      } else {
        return [...prevItems, itemName];
      }
    });
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
                Moj hladilnik
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "10px",
                    fontSize: "1rem",
                    color: "#333",
                  }}
                >
                  Izberi sestavine
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: "repeat(4, 1fr)",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "25px",
                  padding: "5px",
                  justifyItems: "center",
                  alignItems: "center",
                }}
              >
                {foodItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: selectedItems.includes(item.name)
                        ? "#b0d16b"
                        : "rgba(255, 255, 255, 0.5)",
                      padding: "5px",
                      borderRadius: "5px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                      width: "90%",
                      height: "100%",
                      marginBottom: "10px",
                      marginTop: "10px",
                    }}
                    onClick={() => handleItemSelection(item.name)}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      style={{
                        fontSize: "50px",
                        marginBottom: "2px",
                      }}
                    />
                    <span style={{ fontSize: "0.9rem" }}>{item.name}</span>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.name)}
                      onChange={() => handleItemSelection(item.name)}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {showMenu && (
          <div
            className="shadow"
            style={{
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              padding: "10px",
              marginBottom: "10px",
              minWidth: "200px",
              maxHeight: "400px",
              overflowY: "auto",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <div
              className="fw-bold mb-2"
              style={{
                fontSize: "1rem",
                borderBottom: "1px solid #ccc",
                paddingBottom: "5px",
              }}
            >
              Seznam sestavin
            </div>
            {selectedItems.length > 0 ? (
              selectedItems.map((item, idx) => (
                <div key={idx} className="mb-2">
                  {item}
                </div>
              ))
            ) : (
              <div className="mb-2">Ni izbranih sestavin.</div>
            )}
          </div>
        )}

        <div style={{ position: "relative" }}>
          <img
            src="/basket.png"
            alt="Basket"
            style={{
              width: "100px",
              height: "100px",
              cursor: "pointer",
            }}
            onClick={() => setShowMenu(!showMenu)}
          />
          {!showMenu && (
            <div
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "#dc3545",
                color: "#fff",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px",
                boxShadow: "0 0 4px rgba(0,0,0,0.3)",
              }}
            >
              {selectedItems.length}
            </div>
          )}
        </div>
      </div>
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
          src="/generiraj-white.svg"
          alt="Generiraj"
          style={{
            width: "30px",
            height: "30px",
          }}
        />
      </div>
    </div>
  );
}

export default Fridge;
