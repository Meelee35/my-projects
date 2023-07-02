document.querySelector("#server-lookup-form").addEventListener("submit", function (e) {
	e.preventDefault(); //stop form from submitting
	let ip = e.target.elements.ip.value;
	let url = e.target.action;

	console.log(ip + " " + url);
	document.getElementById("spinner").classList.add("visually-hidden");
	try {

		console.log("Start spinner");
		hideAll();
		document.getElementById("spinner").classList.remove("visually-hidden");
		fetch(url + ip, {
			method: "GET",
		})
			.then((raw_response) => {
				if (!raw_response.ok) {
					errorlist({error: "[Errno 100] Bad response"})
					throw new Error('Network response was not ok');
				}
				return raw_response.json();
			})
			.then((response) => {
				try {
					var description = response.description;
					var version = response.version.name;
					var player_count = response.players.online;
					var player_max = response.players.max;
					var latency = response.latency + "ms";
					base64Image(response.favicon);
					playerlist(response);
					errorlist(response);

					document.getElementById("list").className = null;
					console.log(description);
					const formatted_description = convertMinecraftToHTML(description);
					document.getElementById("description").innerHTML = formatted_description;
					document.getElementById("version").textContent = version;
					document.getElementById("latency").textContent = latency;
					document.getElementById("player_count").textContent = player_count;
					document.getElementById("player_max").textContent = player_max;
					console.log("Stop spinner");
					document.getElementById("spinner").classList.add("visually-hidden");
				} catch {
					errorlist(response);
					document.getElementById("spinner").classList.add("visually-hidden");
				}
			})
			.catch((error) => {
				console.error(error);
				errorlist({ error: "[Errno 404] Not found" });
				document.getElementById("spinner").classList.add("visually-hidden");
			});
	} catch (error) {
		console.error(error);
		errorlist({ error: "[Errno 101] An error occurred" });
		console.log("Stop spinner");
		document.getElementById("spinner").classList.add("visually-hidden");
	}
});

/*
fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits')
  .then(response => response.json());

var element = document.getElementById('list');

element.style.display = null;
*/

// Thanks chatgpt
function convertMinecraftToHTML(text) {
	const colorCodeMap = {
		"§0": { color: "#000000", background: "rgba(32, 32, 32, 0.5)" }, // Black
		"§1": { color: "#0000AA", background: "rgba(32, 32, 64, 0.5)" }, // Dark Blue
		"§2": { color: "#00AA00", background: "rgba(32, 64, 32, 0.5)" }, // Dark Green
		"§3": { color: "#00AAAA", background: "rgba(32, 64, 64, 0.5)" }, // Dark Aqua
		"§4": { color: "#AA0000", background: "rgba(64, 32, 32, 0.5)" }, // Dark Red
		"§5": { color: "#AA00AA", background: "rgba(64, 32, 64, 0.5)" }, // Dark Purple
		"§6": { color: "#FFAA00", background: "rgba(64, 64, 32, 0.5)" }, // Gold
		"§7": { color: "#AAAAAA", background: "rgba(64, 64, 64, 0.5)" }, // Gray
		"§8": { color: "#555555", background: "rgba(48, 48, 48, 0.5)" }, // Dark Gray
		"§9": { color: "#5555FF", background: "rgba(48, 48, 96, 0.5)" }, // Blue
		"§a": { color: "#55FF55", background: "rgba(48, 96, 48, 0.5)" }, // Green
		"§b": { color: "#55FFFF", background: "rgba(48, 96, 96, 0.5)" }, // Aqua
		"§c": { color: "#FF5555", background: "rgba(96, 48, 48, 0.5)" }, // Red
		"§d": { color: "#FF55FF", background: "rgba(96, 48, 96, 0.5)" }, // Light Purple
		"§e": { color: "#FFFF55", background: "rgba(96, 96, 48, 0.5)" }, // Yellow
		"§f": { color: "#FFFFFF", background: "rgba(64, 64, 64, 0.5)" }, // White with Dark Gray background
	};

	const styleCodeMap = {
		"§k": "text-decoration: blink", // Obfuscated
		"§l": "font-weight: bold", // Bold
		"§m": "text-decoration: line-through", // Strikethrough
		"§n": "text-decoration: underline", // Underline
		"§o": "font-style: italic", // Italic
		"§r": "color: inherit; font-weight: inherit; text-decoration: inherit; font-style: inherit; background-color: inherit", // Reset
	};

	let htmlText = text;

	for (const code in colorCodeMap) {
		const { color, background } = colorCodeMap[code];
		const regex = new RegExp(`\\${code}`, "g");
		htmlText = htmlText.replace(regex, `<span style="color: ${color}; background-color: ${background}">`);
	}

	for (const code in styleCodeMap) {
		const regex = new RegExp(`\\${code}`, "g");
		htmlText = htmlText.replace(regex, `<span style="${styleCodeMap[code]}">`);
	}

	htmlText = htmlText.replace(/§r/g, "</span>");

	return htmlText;
}

function base64Image(image) {
	document.getElementById("favicon").src = image;
}

//Thanks chatgpt
function playerlist(json) {
	const playerList = json.players.sample;

	// Get the player list element and container
	const playerListElement = document.getElementById("player-list");
	const playerListContainer = document.getElementById("player-list-div");

	// Clear the existing player list
	playerListElement.innerHTML = "";

	// Create a document fragment to improve performance
	const fragment = document.createDocumentFragment();

	// Check if playerList is empty or undefined
	if (playerList && playerList.length > 0) {
		// Iterate through the player list and create list items for each player
		playerList.forEach((player) => {
			const liElement = document.createElement("li");
			liElement.classList.add("list-group-item");
			liElement.classList.add("bg-secondary");
			liElement.classList.add("text-white");
			liElement.textContent = player.name;
			fragment.appendChild(liElement);
		});

		// Append the list items to the player list element
		playerListElement.appendChild(fragment);

		// Remove the 'visually-hidden' class to show the player list container
		playerListContainer.classList.remove("visually-hidden");
	} else {
		// Add the 'visually-hidden' class to hide the player list container
		playerListContainer.classList.add("visually-hidden");
	}
}

function errorlist(json) {
	document.getElementById("list").classList.add("visually-hidden");
	error_span = document.getElementById("error");
	error_div = document.getElementById("error-div");
	if (json.error != undefined) {
		document.getElementById("spinner").classList.add("visually-hidden");
		console.log("error");
		error_span.textContent = json.error;
		error_div.classList.remove("visually-hidden");
	} else {
		document.getElementById("spinner").classList.add("visually-hidden");
		error_div.classList.add("visually-hidden");
	}
}

function hideAll() {
	document.getElementById("error-div").classList.add("visually-hidden");
	document.getElementById("list").classList.add("visually-hidden");
}
