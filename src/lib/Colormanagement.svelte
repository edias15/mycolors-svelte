<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { TextInput } from 'carbon-components-svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';

	let visible = false,
		color = '',
		approximateColor = '',
		approximateColorName = '',
		hexColors: string[] = [],
		nameColors: string[] = [],
		nameColor = '',
		found = true,
		filled = false;

	onMount(() => (visible = true));

	function handleChange(e: any) {
		color = e.target.value;
	}

	function hexPutHash(c: string) {
		return c.search('#') === -1 ? `#${c}` : c;
	}

	function handleKeyDown(e: any) {
		filled = true;
		if (e.key === 'Enter' || color.replace('#', '').length === 6) {
			searchNamesColor();
		}
	}

	function handleKeyUp(e: any) {
		console.log('tecla -> ', e.key);
		filled = true;
		if (e.key === 'Enter' || color.replace('#', '').length === 6) {
			searchNamesColor();
		}
	}

	function handleClick() {
		if (color.replace('#', '').length < 3) {
			alert('Please enter a valid color');
		} else {
			searchNamesColor();
		}
	}

	function handleClean() {
		color = '';
		nameColor = '';
		approximateColor = '';
		approximateColorName = '';
		filled = false;
		found = false;
	}

	function handleSave() {
		if (color.replace('#', '').length < 3) {
			alert('Please enter a valid color');
		} else {
			saveNamesColor();
		}
	}

	function checkUniqueName(namep: string) {
		return true;
		//		return nameColors.find((n) => n.hex === namep);
	}

	function saveNamesColor() {
		const a = checkUniqueName(nameColor);
		console.log('check Name: ', a);
		return;
		const myHeaders = new Headers();
		myHeaders.append('Access-Control-Allow-Origin', '*');
		myHeaders.append('Access-Control-Allow-Credentials', 'true');
		myHeaders.append('Access-Control-Allow-Headers', '*');
		myHeaders.append('Content-Type', 'application/json');
		const colorWithHash = hexPutHash(color);
		const myBody = {
			hex: `${colorWithHash}`,
			name: `${document.getElementById('nameInput').value}`,
		};
		const options = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(myBody),
			mode: 'cors',
			cache: 'default',
		};
		const url = 'http://localhost:3030/colornames/';
		fetch(url, options)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					return { name: 'Database server offline' };
				}
			})
			.then((data) => {
				const colorWithHash = hexPutHash(data.hex);
				color = colorWithHash;
				nameColor = colorWithHash + ' - ' + data.name;
				found = true;
			})
			.catch((err) => {
				found = true;
				color = String('#' + colorWithoutHash);
			});
	}

	async function similarColor(color) {
		hexColors.push(color);
		const colorsSorted = hexColors.sort(colorSort.sortFn);
		const typedColor = (item) => item === color;
		const result = colorsSorted.findIndex(typedColor);
		if (result != -1) {
			const beforeColor = colorsSorted[result - 1];
			const afterColor = colorsSorted[result + 1];
			approximateColor = beforeColor;
			const nearestColor = (item) => item.substring(0, 7) === beforeColor;
			approximateColorName = nameColors.find(nearestColor);
		}
	}

	function getAllColors_() {
		const myHeaders = new Headers();
		myHeaders.append('Access-Control-Allow-Origin', '*');
		myHeaders.append('Access-Control-Allow-Credentials', true);
		myHeaders.append('Access-Control-Allow-Headers', '*');
		myHeaders.append('Content-Type', 'application/json');
		const options = {
			method: 'GET',
			headers: myHeaders,
			mode: 'cors',
			cache: 'default',
		};
		const url = 'http://localhost:3030/colornames/';
		fetch(url, options)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					return { name: 'Database server offline' };
				}
			})
			.then((data) => {
				const hexColor = [],
					nameColor = [];
				data.map((item: any) => {
					hexColor.push(item.hex);
				});
				data.map((item) => {
					nameColor.push(item.hex + ' - ' + item.name);
				});
				hexColors = hexColor;
				nameColors = nameColor;
			});
	}

	function searchNamesColor() {
		return client.query({
			query: gql`
				colorByHex(hex: "{$color}") {
					colors {
						hex
						name
					}
				}
			`,
		});

		const myHeaders = new Headers();
		myHeaders.append('Access-Control-Allow-Origin', '*');
		myHeaders.append('Access-Control-Allow-Credentials', true);
		myHeaders.append('Access-Control-Allow-Headers', '*');
		myHeaders.append('Content-Type', 'application/json');
		const options = {
			method: 'GET',
			headers: myHeaders,
			mode: 'cors',
			cache: 'default',
		};
		const colorWithoutHash = color.replace('#', '');
		const url = 'http://localhost:3030/colornames/' + `${colorWithoutHash}`;
		fetch(url, options)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					return { name: 'Database server offline' };
				}
			})
			.then((data) => {
				const colorWithHash = hexPutHash(data.hex);
				color = colorWithHash;
				nameColor = colorWithHash + ' - ' + data.name;
				found = true;
			})
			.catch((err) => {
				found = true;
				color = String('#' + colorWithoutHash);
				similarColor(String('#' + colorWithoutHash));
			});
	}
</script>

<div class="app-container">
	<div class="row-container">
		<div class="col-container">
			<div class="col1-title">
				<p>Actual</p>
			</div>
			<div class="col1-container">
				<h2 class="name-container">
					{nameColor}
				</h2>
			</div>
			<div class="input-container">
				<input
					class="input-hexcolor"
					id="hexColor"
					type="text"
					maxlength={7}
					placeholder="#999999"
					bind:value={color}
					on:change={handleChange}
					on:keyup={handleKeyUp}
					on:keydown={handleKeyDown}
				/>
				{#if filled}
					<Fa icon={faTimes} on:click={handleClean} />
				{/if}
				<input
					required
					id="nameInput"
					label="Name"
					type="text"
					maxlength={20}
					placeholder=""
					disabled={found}
				/>
			</div>
		</div>
		<div class="col-container">
			<div class="col1-title">
				<p>Nearest</p>
			</div>
			<div class="col2-container">
				<h2 class="name-container">
					{approximateColorName}
				</h2>
			</div>
			<div class="button-container">
				<button on:click={handleSave} disabled={found} theme="blue">Save</button>
			</div>
		</div>
	</div>
</div>

<style>
	div.app-container {
		margin: 30px;
	}
	div.row-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;
	}
	div.col-container {
		display: flex;
		flex-direction: column;
		flex-basis: 100%;
		flex: 1;
	}
	div.col1-title {
		display: flex;
		justify-content: center;
	}
	div.col1-container {
		margin-left: 10px;
		background-color: var(--color, #fff);
		border-radius: 6px;
		box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
		margin-right: 10px;
		height: 100px;
	}
	div.col2-container {
		margin-left: 10px;
		background-color: var(--approximateColor, #fff);
		border-radius: 6px;
		box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
		margin-right: 10px;
		height: 100px;
	}
	div.input-container {
		display: flex;
		padding: 20px 10px;
		justify-content: space-around;
	}
	button {
		background-color: '#3f51b5';
		color: white;
		padding: 5px 15px;
		border-radius: 5px;
		outline: 0;
		text-transform: uppercase;
		margin: 10px 0px;
		cursor: pointer;
		box-shadow: 0px 2px 2px lightgray;
		transition: ease background-color 250ms;
	}
	button:hover {
		background-color: '#283593';
	}
	button:disabled {
		cursor: default;
		opacity: 0.1;
	}
</style>
