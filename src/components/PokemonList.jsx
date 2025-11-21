// src/components/PokemonList.jsx
import { useState, useEffect } from "react";

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=10"
      );

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Pokémon");
      }

      const data = await response.json();
      // Detaildaten für jedes Pokémon laden (inkl. Bild)
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            id: details.id,
            height: details.height,
            typenames: details.types.map((typeInfo) => typeInfo.type.name).join(", "),
          };
        })
      );

      setPokemons(detailedPokemons);
    } catch (err) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <p>Loading Pokémon...</p>;
  }

  if (error) {
    return <p>Fehler: {error}</p>;
  }

  return (
      <div className="pokemon-page">
        <h1>Pokédex</h1>
      <h2>Pokémon Liste</h2>
      <div className="pokemon-grid">
        {pokemons.map((pokemon) => (
          <div key={pokemon.name} className="pokemon-card">
            <img src={pokemon.image} alt={pokemon.name} width="80" />
            <p className="pokemon-name">{pokemon.name}</p>
            <p className="pokemon-id">ID: {pokemon.id}</p>
            <p>Height: {pokemon.height}</p>
            <p>Type(s): {pokemon.typenames}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonList;
