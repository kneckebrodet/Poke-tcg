function PokemonCard({ pokemon, onClick, className = "" }) {
  if (!pokemon || !pokemon.image_url) {
    console.warn("PokemonCard received invalid card data:", pokemon);
    return null; // or return a placeholder if you prefer
  }

  return (
    <div onClick={onClick}>
      {pokemon.image_url && (
        <img
          src={pokemon.image_url}
          alt={pokemon.name}
          className={`select-none w-[4.5vw] rounded-[6%] mb-[1vh] hover:cursor-pointer border-1 border-gray-400 shadow-md/40 hover:shadow-lg/50 ${className}`}
        />
      )}
    </div>
  );
}

export default PokemonCard
