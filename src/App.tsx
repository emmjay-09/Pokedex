import "./App.css";
import { useState, useEffect, useRef } from "react";

export default function Pokemon() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [specie, setSpecie] = useState<any>(null);
  const [search, setSearch] = useState<string>("charmeleon");
  const [error, setError] = useState<string>("");
  const [currentletter, setCurrentLetter] = useState<string>("");
  const [fullData, setFullData] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const previousSearch = useRef(search);
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

  useEffect(() => {
    if (
      previousSearch.current !== search &&
      !loading &&
      pokemon &&
      statsRef.current
    ) {
      statsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      previousSearch.current = search;
    }
  }, [loading, pokemon, search]);

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
            className="m-4 hover:bg-[#d2c4f2] focus:bg-[#c0c0c0] rounded p-2 text-black transition-colors duration-300"
            key={pokemon.name}
          >
            {pokemon.name}{" "}
          </button>
        </span>
      ));

  return (
    <section className="mx-auto flex w-full max-w-[1000px] flex-col gap-3 p-2 text-sm lg:flex-row lg:gap-4">
      <div className="flex w-full flex-col lg:m-3 lg:w-[220px] lg:shrink-0">
        <div className="mb-4">
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
        <div className="grid grid-cols-6 gap-2">
          {letters.map((letter) => (
            <button
              key={letter}
              className="rounded bg-[#d2c4f2] p-1 text-sm font-bold text-black shadow-lg transition-colors duration-300"
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
            <div className="flex h-[260px] flex-col items-start overflow-auto overflow-x-hidden border-4 border-gray-200 p-2">
              {handleFilter()}
            </div>
          ) : null}
        </div>
      </div>
      <div className="relative flex h-fit w-full max-w-[620px] flex-col items-center rounded-[24px] bg-[#FFFDD0] p-2 shadow-lg">
        {error && (
          <p className="text-center text-lg text-red-500">{error}</p>
        )}
        {loading && <p className="text-lg text-gray-500">Loading...</p>}
        {!loading && pokemon && !error && (
          <>
            <div className="flex w-full flex-col gap-1 p-1 sm:flex-row">
              <img
                className="w-24 self-center rounded-[10%] bg-white p-1 shadow-lg sm:self-start"
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
              />
              <div className="flex flex-col items-start sm:ml-1">
                <span className="text-base text-[#C0C0C0]">
                  NO. {pokemon.id}
                </span>
                <span className="text-2xl font-bold">
                  {pokemon.name.toUpperCase()}
                </span>
                <div className="text-base font-bold">
                  {pokemon.types.map((type: any) => {
                    const selectedElement = elements.find(
                      (element) =>
                        element.name.toLowerCase() === type.type.name,
                    );
                    return (
                      <div
                        className="mr-1 mt-0.5 inline-block rounded-full p-1 text-sm text-black transition-colors duration-300 hover:text-white"
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
            <div className="flex w-full flex-col items-start p-1">
              <h1 className="text-base font-semibold">Pokedex entry</h1>
              <div className="text-base leading-tight text-start">
                {specie?.flavor_text_entries[0].flavor_text}
              </div>
            </div>
            <div className="w-full p-1" key={pokemon.id} ref={statsRef}>
              <h1 className="text-3xl font-bold">STATS</h1>
              {pokemon.stats.map((type: any) => {
                const width = type.base_stat;

                return (
                  <div
                    className="grid grid-cols-[minmax(75px,1fr)_minmax(80px,2fr)_32px] items-center gap-1"
                    key={type.stat.name}
                  >
                    <h1 className="text-start text-base">
                      {type.stat.name}
                    </h1>
                    <div className="relative h-1.5 w-full bg-white">
                      <div
                        className="absolute h-1.5 bg-blue-500"
                        style={{
                          width: `${width}%`,
                          animation: "grow-stat 2s ease forwards",
                          transformOrigin: "left",
                          backgroundColor: color,
                        }}
                      ></div>
                    </div>
                    <div className="flex flex-col justify-center text-end text-base">
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
