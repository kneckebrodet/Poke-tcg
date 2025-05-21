import { useState } from 'react';

function PokemonFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    card_type: '',
    hp_type: '',
    supertype: '',
    ordering: '',
    search: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
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
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="flex flex-wrap gap-3 mb-[4vh]">
      <input
        className="p-1.5 text-sm border-2 rounded-[10px]"
        type="text"
        name="search"
        placeholder="Search by name or ability..."
        value={filters.search}
        onChange={handleChange}
      />

      <select className="p-1.5 text-sm border-2 rounded-[10px]" name="card_type" value={filters.card_type} onChange={handleChange}>
        <option value="">All Cards</option>
        <option value="ポケモン">Pokemon</option>
        <option value="グッズ">Item</option>
        <option value="サポート">Support</option>
        <option value="ポケモンのどうぐ">Tool</option>
      </select>

      <select className="p-1.5 text-sm border-2 rounded-[10px]" name="hp_type" value={filters.hp_type} onChange={handleChange}>
        <option value="">All HP Types</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="grass">Grass</option>
        <option value="psychic">Psychic</option>
        <option value="dark">Dark</option>
        <option value="dragon">Dragon</option>
        <option value="steel">Steel</option>
        <option value="fighting">Fighting</option>
        <option value="electric">Electric</option>
        <option value="none">Normal</option>
      </select>

      <select className="p-1.5 text-sm border-2 rounded-[10px]" name="supertype" value={filters.supertype} onChange={handleChange}>
        <option value="">All Supertypes</option>
        <option value="たね">Basic</option>
        <option value="1 進化">1st evolution</option>
        <option value="2 進化">2nd evolution</option>
      </select>

      <select className="p-1.5 text-sm border-2 rounded-[10px]" name="ordering" value={filters.ordering} onChange={handleChange}>
        <option value="">Default Order</option>
        <option value="card_name">Name A-Z</option>
        <option value="-card_name">Name Z-A</option>
        <option value="hp_num">HP Low to High</option>
        <option value="-hp_num">HP High to Low</option>
      </select>

      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default PokemonFilter;
