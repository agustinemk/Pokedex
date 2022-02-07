const pokemon_container = document.querySelector(".pokemon-container");
const spinner = document.querySelector("#spinner");

const load = document.querySelector("#load");

let offset = 1;
let limit = 20;

const types_colours = {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#FFC6D9',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fighting: '#2F2F2F',
    default: '#9CF2FB',
};

function block_load_button() {
	load.disabled = true;
	load.textContent = "Cargando...";
}

function unblock_load_button() {
	load.disabled = false;
	load.textContent = "Cargar más!";
}

load.addEventListener("click", () => {
	offset += limit;
	block_load_button();
	fetch_pokemons(offset, limit);
})

async function fetch_pokemon(id) {
	await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
	.then((res) => res.json())
	.then(async function get_card(data) {
		await create_pokemon(data);
		//await new Promise(r => setTimeout(r, 200));
	});
}

async function fetch_pokemons(offset, limit) {
	spinner.style.display = "block";
	for (let i = offset; i < offset+limit; i++) {
		await fetch_pokemon(i);
	}
	spinner.style.display = "none"; //turn off loading spinner
	unblock_load_button();
}

async function create_pokemon(pokemon) {
	const flip_card = document.createElement("div");
	flip_card.classList.add("flip-card");

	const card_container = document.createElement("div");
	card_container.classList.add("card-container");

	flip_card.appendChild(card_container);

	const card = document.createElement("div");
	card.classList.add('pokemon-block');

	const sprite_container = document.createElement("div");
	sprite_container.classList.add("img-container");

	const sprite = document.createElement("img");
	sprite.src = pokemon.sprites.front_default;

	sprite_container.appendChild(sprite);

	const number = document.createElement("div");
	number.classList.add("number");
	number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

	const name = document.createElement("p");
	name.classList.add("name");
	name.textContent = pokemon.name;

	card.appendChild(sprite_container);
	card.appendChild(number);
	card.appendChild(name);

	pokemon.types.forEach(function get_types(info) {
		const type_container = document.createElement("div");
		type_container.classList.add("type-container");

		const type = document.createElement("p");
		type.classList.add("type");
		type.textContent = info.type.name;
		type_container.style.background = types_colours[info.type.name] ? types_colours[info.type.name] : types_colours["default"];

		type_container.append(type);
		card.appendChild(type_container);
	})


	const card_back = document.createElement("div");
	card_back.classList.add("pokemon-block-back");
	
	card_back.appendChild(progress_bar(pokemon.stats));

	card_container.appendChild(card);
	card_container.appendChild(card_back);

	pokemon_container.appendChild(flip_card);
}

function progress_bar(stats) {
	function get_bar_colour(percent) {
		if (percent < 40) {
			return "#ff4a4a";
		}
		if (percent < 60) {
			return "#ff804a";
		}
		if (percent < 100) {
			return "#4aff6e";
		}
		else {
			return "#ff4ae1";
		}
	}

	function get_name(stat) {
		switch (stat.stat.name) {
			case "hp" :
				return "HP";
			case "attack":
				return "ATK";
			case "defense":
				return "Defense";
			case "special-attack":
				return "Sp. Attack";
			case "special-defense":
				return "Sp. Defense";
			case "speed":
				return "Speed";
			default:
				return null;
		}
	}

	const stats_container = document.createElement("div");
	stats_container.classList.add("stats-container");

	stats.forEach(function get_stats(stat){
		const stat_container = document.createElement("div");

		stat_container.classList.add("stat-container");

		const stat_name = document.createElement("div");
		stat_name.classList.add("stat-name");
		stat_name.textContent = get_name(stat);

		const progress = document.createElement("div");
		progress.classList.add("progress");

		const progress_bar = document.createElement("div");
		progress_bar.classList.add("progress-bar");

		progress_bar.setAttribute("aria-valuenow", stat.base_stat/2);
		progress_bar.setAttribute("aria-valuemin", 0);
		progress_bar.setAttribute("aria-valuemax", 100);
		progress_bar.style.backgroundColor = get_bar_colour(parseInt(stat.base_stat))
		progress_bar.style.width = stat.base_stat/2+"%";

	
		progress_bar.textContent = stat.base_stat;

		progress.appendChild(progress_bar);
		stat_container.appendChild(stat_name);
		stat_container.appendChild(progress);
	
		stats_container.appendChild(stat_container);
	})
	return stats_container;
}

fetch_pokemons(offset, limit);