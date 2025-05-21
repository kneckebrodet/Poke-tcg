function PokemonCard({ pokemon, onClick }) {
  return (
    <div className="pokemon-card" onClick={onClick}>
      {pokemon.image_url && (
        <img
          src={pokemon.image_url}
          alt={pokemon.name}
          className="w-[20vw] rounded-[11px] mb-[1vh] hover:cursor-pointer"
        />
      )}
    </div>
  );
}

export default PokemonCard;
