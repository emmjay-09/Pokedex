import "./App.css";
import { useState, useEffect } from "react";

export default function Pokemon() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [specie, setSpecie] = useState<any>(null);
  const [search, setSearch] = useState<string>("charmeleon");
  const [error, setError] = useState<string>("");
  const elements = [
    { id: 1, name: "Fire", color: "#F08030" },
    { id: 2, name: "Water", color: "#6890F0" },
    { id: 3, name: "Grass", color: "#78C850" },
    { id: 4, name: "Electric", color: "#F8D030" },
    { id: 5, name: "Psychic", color: "#F85888" },
    { id: 6, name: "Ice", color: "#90E0E0" },
    { id: 7, name: "Dragon", color: "#7038F8" },
    { id: 8, name: "Dark", color: "#705848" },
    { id: 9, name: "Fairy", color: "#EE99AC" },
    { id: 10, name: "Normal", color: "#A8A878" },
    { id: 11, name: "Fighting", color: "#C03028" },
    { id: 12, name: "Flying", color: "#A8A878" },
    { id: 13, name: "Poison", color: "#A040A0" },
    { id: 14, name: "Ground", color: "#E0C068" },
    { id: 15, name: "Rock", color: "#B8B878" },
    { id: 16, name: "Bug", color: "#A8B820" },
    { id: 17, name: "Ghost", color: "#705848" },
    { id: 18, name: "Steel", color: "#B8B878" },
  ];
  const [loading, setLoading] = useState<any>();

  const [isHovered, setIsHovered] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        const [pokemonResponse, specieResponse] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${search}`),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${search}`),
        ]);

        setLoading(true);
        if (!pokemonResponse.ok || !specieResponse.ok) {
          throw new Error("Pokemon not found");
        }
        const pokemonData = await pokemonResponse.json();
        const specieData = await specieResponse.json();
        setPokemon(pokemonData);
        setSpecie(specieData);
      } catch {
        setError("Pokemon not found. Try another name!");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [search]);
  console.log(pokemon);
  return (
    <div className="flex flex-col relative items-center bg-[#FFFDD0] h-[1500px] w-[1000px] rounded-[100px] shadow-lg">
      {error && <p className="text-red-500">{error}</p>}
      {pokemon && !error && (
        <>
          <div className="flex w-[100%] h-[30%] p-10">
            <img
              className="bg-white rounded-[10%] p-5 shadow-lg "
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
            />
            <div className="ml-10 flex flex-col items-start leading-15 pl-10 pr-10">
              <span className="text-[#C0C0C0] text-[50px]">
                NO. {pokemon.id}
              </span>
              <span className="text-[60px]">{pokemon.name.toUpperCase()}</span>
              <div className="text-xl font-bold">
                {pokemon.types.map((type: any) => {
                  const selectedElement = elements.find(
                    (element) => element.name.toLowerCase() === type.type.name,
                  );
                  return (
                    <div
                      className={`inline-block text-black text-[50px] p-5 mt-10 rounded-full mr-2 hover:text-white transition-colors duration-300`}
                      onMouseEnter={() => setIsHovered(type.type.name)}
                      onMouseLeave={() => setIsHovered("")}
                      style={{
                        backgroundColor:
                          isHovered === type.type.name
                            ? selectedElement?.color
                            : "#d2c4f2",
                      }}
                      key={type.type.name}
                    >
                      {type.type.name}{" "}
                    </div>
                  );
                })}
              </div>
            </div>

            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(e.currentTarget.value.toLowerCase());
                }
              }}
              placeholder="Type pokemon name here"
              type="text"
            />
          </div>
          <div className="flex flex-col items-start w-[100%] h-[70%] p-10">
            <h1>Pokedex entry</h1>
            <div className="text-[50px] leading-15 tracking-[5px] text-start">
              {specie?.flavor_text_entries[0].flavor_text}
            </div>
          </div>
          <div className="p-10">
            <h1 className="text-[70px]">STATS</h1>
            {pokemon.stats.map((type: any) => {
              const width = type.base_stat % 100;
              return (
                <div className="grid grid-cols-3 gap-4" key={type.stat.name}>
                  <h1 className="text-start text-[40px]">{type.stat.name}</h1>
                  <div className="w-[400px] h-[10px] relative bg-white mt-[15%]">
                    <div className={`h-[10px] absolute bg-blue-500`}></div>
                  </div>
                  <div className="text-[50px] flex flex-col justify-center text-end">
                    {type.base_stat}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
