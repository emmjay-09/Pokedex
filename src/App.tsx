import "./App.css";
import { useState, useEffect } from "react";

export default function Pokemon() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [specie, setSpecie] = useState<any>(null);
  const [search, setSearch] = useState<string>("charmeleon");
  const [error, setError] = useState<string>("");
  const [currentletter, setCurrentLetter] = useState<string>("");
  const [fullData, setFullData] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
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
  const [isHovered, setIsHovered] = useState("");
  const color =
    elements.find(
      (element) =>
        element.name.toLowerCase() === pokemon?.types?.[0]?.type.name,
    )?.color || "#d2c4f2";

  useEffect(() => {
    setLoading(true);
    setError("");
    async function fetchData() {
      try {
        const [pokemonResponse, specieResponse, fullResponse] =
          await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${search}`),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${search}`),
            fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`),
          ]);

        if (!pokemonResponse.ok || !specieResponse.ok) {
          throw new Error("Pokemon not found");
        }
        const pokemonData = await pokemonResponse.json();
        const specieData = await specieResponse.json();
        const fullData = await fullResponse.json();
        setPokemon(pokemonData);
        setSpecie(specieData);
        setFullData(fullData.results);
      } catch {
        setError("Pokemon not found. Try another name!");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [search]);

  const handleFilter = () =>
    fullData
      .filter((pokemon) => pokemon.name.startsWith(currentletter.toLowerCase()))
      .map((pokemon) => (
        <span
          className="rounded w-[100%] m-[2px]"
          style={{ background: color }}
        >
          <button
            onClick={() => setSearch(pokemon.name)}
            className="m-4 "
            key={pokemon.name}
          >
            {pokemon.name}{" "}
          </button>
        </span>
      ));

  return (
    <section className="flex w-max p-3">
      <div className="m-20 text-[40px] flex flex-col">
        <div className="mb-20">
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
        <div className="grid grid-cols-6 gap-4">
          {letters.map((letter) => (
            <button
              key={letter}
              className="bg-[#d2c4f2] text-black font-bold p-4 rounded shadow-lg transition-colors duration-300"
              style={{
                backgroundColor: color,
              }}
              onClick={() => setCurrentLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {currentletter ? (
            <div className="border-10 border-gray-200 p-10 overflow-auto overflow-x-hidden flex flex-col items-start h-[1000px]">
              {handleFilter()}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col relative items-center bg-[#FFFDD0] h-[1500px] w-[1000px] rounded-[100px] shadow-lg">
        {error && <p className="text-red-500 text-[50px]">{error}</p>}
        {loading && <p className="text-[50px] text-gray-500">Loading...</p>}
        {!loading && pokemon && !error && (
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
                <span className="text-[60px]">
                  {pokemon.name.toUpperCase()}
                </span>
                <div className="text-xl font-bold">
                  {pokemon.types.map((type: any) => {
                    const selectedElement = elements.find(
                      (element) =>
                        element.name.toLowerCase() === type.type.name,
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
            </div>
            <div className="flex flex-col items-start w-[100%] h-[70%] p-10">
              <h1>Pokedex entry</h1>
              <div className="text-[50px] leading-15 tracking-[5px] text-start">
                {specie?.flavor_text_entries[0].flavor_text}
              </div>
            </div>
            <div className="p-10" key={pokemon.id}>
              <h1 className="text-[70px]">STATS</h1>
              {pokemon.stats.map((type: any) => {
                const width = type.base_stat;

                return (
                  <div className="grid grid-cols-3 gap-4" key={type.stat.name}>
                    <h1 className="text-start text-[40px]">{type.stat.name}</h1>
                    <div className="w-[400px] h-[10px] relative bg-white mt-[15%]">
                      <div
                        className={`h-[10px] absolute bg-blue-500`}
                        style={{
                          width: `${width}%`,
                          animation: "grow-stat 2s ease forwards",
                          transformOrigin: "left",
                          backgroundColor: color,
                        }}
                      ></div>
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
    </section>
  );
}
