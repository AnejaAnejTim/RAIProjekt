import { useState } from 'react';
import { faCarrot, faFish, faCheese, faEgg, faBreadSlice, faAppleAlt, faDrumstickBite, faPepperHot, faLeaf, faBacon, faCookie, faLemon, faIceCream, faPizzaSlice, faHamburger, faHotdog, faSeedling, faBottleWater, faWineBottle, faMugHot } from '@fortawesome/free-solid-svg-icons';
import IngredientsMyFridge from './IngredientsMyFridge';

function MyFridge() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleItemSelection = (itemLabel) => {
        setSelectedItems(prev =>
            prev.includes(itemLabel)
                ? prev.filter(label => label !== itemLabel)
                : [...prev, itemLabel]
        );
    };

    const fridgeItems = [
        { label: 'Korenje', icon: faCarrot },
        { label: 'Riba', icon: faFish },
        { label: 'Sir', icon: faCheese },
        { label: 'Jajca', icon: faEgg },
        { label: 'Kruh', icon: faBreadSlice },
        { label: 'Jabolko', icon: faAppleAlt },
        { label: 'Piščanec', icon: faDrumstickBite },
        { label: 'Paprika', icon: faPepperHot },
        { label: 'Solata', icon: faLeaf },
        { label: 'Slanina', icon: faBacon },
        { label: 'Piškoti', icon: faCookie },
        { label: 'Limona', icon: faLemon },
        { label: 'Sladoled', icon: faIceCream },
        { label: 'Pica', icon: faPizzaSlice },
        { label: 'Burger', icon: faHamburger },
        { label: 'Hrenovka', icon: faHotdog },
        { label: 'Kali', icon: faSeedling },
        { label: 'Voda', icon: faBottleWater },
        { label: 'Vino', icon: faWineBottle },
        { label: 'Čaj', icon: faMugHot },
    ];

    return (
            <div className="position-relative">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col col-xl-10">
                    <div className="row g-0">
                        <div className="col-12">
                            <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2rem', color: '#333' }}>
                            Vaš hladilnik
                            <div style={{ fontSize: '1.6rem' }}>
                                Tukaj imate pregled vseh vaših sestavin
                            </div>
                                    <IngredientsMyFridge
                                        foodItems={fridgeItems}
                                        selectedItems={selectedItems}
                                        handleItemSelection={handleItemSelection}
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
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
