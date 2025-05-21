import { useState } from 'react';

function PokemonFilter({ onFilterChange }) {
    const [filters, setFilters] = useState({
        card_type: '',
        hp_type: '',
        supertype: '',
        ordering: '',
        search: '',
    });

    const [notPokemon, setNotPokemon] = useState(false)

    const card_types = {
        "": "All Types",
        "ポケモン": "Pokemon",
        "サポート": "Support",
        "グッズ": "Item",
        "ポケモンのどうぐ": "Tool"
    }

    const hpTypes = {
        "": "All HP Types",
        "fire": "Fire",
        "water": "Water",
        "grass": "Grass",
        "psychic": "Psychic",
        "dark": "Dark",
        "dragon": "Dragon",
        "steel": "Steel",
        "fighting": "Fighting",
        "electric": "Electric",
        "none": "Normal"
    }

    const supertypes = {
        "": "All Stages",
        "たね": "Basic",
        "1 進化": "1st evolution",
        "2 進化": "2nd evolution"
    }

    const orderingOptions = {
        "": "Default Order",
        "card_name": "Name A-Z",
        "-card_name": "Name Z-A",
        "hp_num": "HP Low to High",
        "-hp_num": "HP High to Low"
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        var newFilters = {}
        if (name === "card_type") {
            if (value === "ポケモン" || value === "") {
                setNotPokemon(false)
            } else {
                setNotPokemon(true)
            }
            newFilters = { ...filters, [name]: value, "hp_type": "", "supertype": "" }
        } else {
            newFilters = { ...filters, [name]: value }
        }

        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const newFilters = {
            card_type: '',
            hp_type: '',
            supertype: '',
            ordering: '',
            search: '',
        }
        setNotPokemon(false)
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    return (
        <div className="flex flex-wrap justify-center gap-3 mb-[4vh]">
            <input
                className="p-1.5 text-sm border-[0.1em] rounded-[10px] border-gray-500"
                type="text"
                name="search"
                placeholder="Search by name or ability..."
                value={filters.search}
                onChange={handleChange}
            />

            <select
                className="p-1.5 text-sm border-[0.1em] rounded-[10px] border-gray-500"
                name="card_type"
                value={filters.card_type}
                onChange={handleChange}
            >
                {Object.entries(card_types).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <select
                className="p-1.5 text-sm border-[0.1em] rounded-[10px] border-gray-500 disabled:opacity-30"
                name="hp_type"
                value={filters.hp_type}
                onChange={handleChange}
                disabled={notPokemon === true}
            >
                {Object.entries(hpTypes).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <select
                className="p-1.5 text-sm border-[0.1em] rounded-[10px] border-gray-500 disabled:opacity-30"
                name="supertype"
                value={filters.supertype}
                onChange={handleChange}
                disabled={notPokemon === true}
            >
                {Object.entries(supertypes).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <select
                className="p-1.5 text-sm border-[0.1em] rounded-[10px] border-gray-500"
                name="ordering"
                value={filters.ordering}
                onChange={handleChange}
            >
                {Object.entries(orderingOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <button className="border-1 rounded-[10px] w-[8vw] text-white bg-gradient-to-r from-gray-300 to-gray-400 shadow-lg border-gray-500 hover:cursor-pointer hover:bg-gradient-to-br" onClick={handleReset}>Reset</button>
        </div>
    );
}

export default PokemonFilter;
