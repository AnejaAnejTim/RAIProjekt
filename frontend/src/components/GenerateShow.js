import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import generateIcon from '../assets/generiraj-white.svg';
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
    faMugHot
} from '@fortawesome/free-solid-svg-icons';
import IngredientsGenerate from './IngredientsGenerate';
import Basket from './Basket';
import GenerateFilters from './GenerateFilters';

function GenerateShow() {
    const userContext = useContext(UserContext);
    const [showMenu, setShowMenu] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    if (!userContext.user) return <Navigate replace to="/login" />;

    const foodItems = [
        { label: 'Korenje', icon: faCarrot },
        { label: 'Riba', icon: faFish },
        { label: 'Sir', icon: faCheese },
        { label: 'Jajca', icon: faEgg },
        { label: 'Kruh', icon: faBreadSlice },
        { label: 'Jabolko', icon: faAppleAlt },
        { label: 'Piščanec', icon: faDrumstickBite },
        { label: 'Čili', icon: faPepperHot },
        { label: 'Solata', icon: faLeaf },
        { label: 'Slanina', icon: faBacon },
        { label: 'Piškot', icon: faCookie },
        { label: 'Limona', icon: faLemon },
        { label: 'Sladoled', icon: faIceCream },
        { label: 'Pica', icon: faPizzaSlice },
        { label: 'Burger', icon: faHamburger },
        { label: 'Hrenovka', icon: faHotdog },
        { label: 'Špinača', icon: faSeedling },
        { label: 'Voda', icon: faBottleWater },
        { label: 'Vino', icon: faWineBottle },
        { label: 'Čaj', icon: faMugHot },
    ];

    const filteredItems = foodItems.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleItemRemove = (item) => {
        setSelectedItems(selectedItems.filter((selected) => selected !== item));
    };

    const handleItemSelection = (itemLabel) => {
        setSelectedItems((prevItems) =>
            prevItems.includes(itemLabel)
                ? prevItems.filter(item => item !== itemLabel)
                : [...prevItems, itemLabel]
        );
    };

    return (
        <div className="position-relative">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col col-xl-10">
                    <div className="row g-0">
                        <div className="col-12">
                            <IngredientsGenerate
                                foodItems={foodItems}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                selectedItems={selectedItems}
                                handleItemSelection={handleItemSelection}
                            />
                            <hr style={{ margin: '40px auto', width: '80%', borderTop: '1px solid #ccc' }} />
                                <GenerateFilters/>
                            <hr style={{ margin: '40px auto', width: '80%', borderTop: '1px solid #ccc' }} />
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
                    position: 'fixed',
                    bottom: '50px',
                    right: '20px',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 20px',
                    borderRadius: '30px',
                    backgroundColor: '#b0d16b',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    textDecoration: 'none',
                }}
            >
                <span style={{ fontSize: '1rem', color: 'white', marginRight: '10px' }}>
                    Generiraj recept
                </span>
                <img
                    src={generateIcon}
                    alt="Generiraj"
                    style={{ width: '30px', height: '30px' }}
                />
            </div>
        </div>
    );
}

export default GenerateShow;
