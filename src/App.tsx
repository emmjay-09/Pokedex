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
    <section className="flex w-full max-w-[1400px] mx-auto flex-col gap-6 p-3 lg:flex-row lg:gap-10">
      <div className="flex w-full flex-col text-xl lg:m-10 lg:w-[360px] lg:shrink-0 lg:text-[28px]">
        <div className="mb-8 lg:mb-20">
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
        <div className="grid grid-cols-6 gap-2 lg:gap-4">
          {letters.map((letter) => (
            <button
              key={letter}
              className="rounded bg-[#d2c4f2] p-2 font-bold text-black shadow-lg transition-colors duration-300 lg:p-4"
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
            <div className="flex h-[400px] flex-col items-start overflow-auto overflow-x-hidden border-10 border-gray-200 p-4 lg:h-[1000px] lg:p-10">
              {handleFilter()}
            </div>
          ) : null}
        </div>
      </div>
      <div className="relative flex min-h-screen w-full max-w-[1000px] flex-col items-center rounded-[40px] bg-[#FFFDD0] p-4 shadow-lg lg:rounded-[100px] lg:p-0">
        {error && <p className="text-center text-2xl text-red-500 lg:text-[50px]">{error}</p>}
        {loading && <p className="text-2xl text-gray-500 lg:text-[50px]">Loading...</p>}
        {!loading && pokemon && !error && (
          <>
            <div className="flex w-full flex-col gap-6 p-4 sm:flex-row lg:h-[30%] lg:p-10">
              <img
                className="w-40 self-center rounded-[10%] bg-white p-5 shadow-lg sm:self-start lg:w-auto"
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
              />
              <div className="flex flex-col items-start sm:ml-4 lg:ml-10 lg:pl-10 lg:pr-10">
                <span className="text-2xl text-[#C0C0C0] lg:text-[50px]">
                  NO. {pokemon.id}
                </span>
                <span className="text-3xl lg:text-[60px]">
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
                        className={`mr-2 mt-4 inline-block rounded-full p-3 text-2xl text-black transition-colors duration-300 hover:text-white lg:mt-10 lg:p-5 lg:text-[50px]`}
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
            <div className="flex w-full flex-col items-start p-4 lg:h-[70%] lg:p-10">
              <h1>Pokedex entry</h1>
              <div className="text-2xl leading-normal tracking-wide text-start lg:text-[50px] lg:leading-15 lg:tracking-[5px]">
                {specie?.flavor_text_entries[0].flavor_text}
              </div>
            </div>
            <div className="p-4 lg:p-10" key={pokemon.id}>
              <h1 className="text-4xl lg:text-[70px]">STATS</h1>
              {pokemon.stats.map((type: any) => {
                const width = type.base_stat;

                return (
                  <div className="grid grid-cols-[minmax(90px,1fr)_minmax(100px,2fr)_50px] gap-2 lg:grid-cols-3 lg:gap-4" key={type.stat.name}>
                    <h1 className="text-start text-xl lg:text-[40px]">{type.stat.name}</h1>
                    <div className="relative mt-[15%] h-[10px] w-full bg-white lg:w-[400px]">
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
                    <div className="flex flex-col justify-center text-end text-2xl lg:text-[50px]">
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
