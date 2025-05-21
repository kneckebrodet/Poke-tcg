function PokemonCard({ pokemon, onClick }) {
  return (
    <div onClick={onClick}>
      {pokemon.image_url && (
        <img
          src={pokemon.image_url}
          alt={pokemon.name}
          className="w-[20vw] rounded-[18px] mb-[1vh] hover:cursor-pointer border-1 border-gray-400 shadow-md/40"
        />
      )}
    </div>
  );
}

export default PokemonCard;
