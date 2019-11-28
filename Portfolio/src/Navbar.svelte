<script>
import Navbutton from "./Navbutton.svelte";
import current from "./App.svelte";
</script>
<style>
div {
    margin: auto;
    width: 100%;
    overflow: hidden;
}
.active {
		background-color: #ff3e00;
		color: white;
	}
</style>
<div>
<Navbutton on:message class="{current === 'home' ? 'active' : ''}"
	on:click="{() => current = 'home'}">Home</Navbutton>
<Navbutton on:message class="{current === 'about' ? 'active' : ''}"
	on:click="{() => current = 'about'}">About</Navbutton>
<Navbutton on:message>Contact</Navbutton>
<Navbutton on:message>Examples</Navbutton>
</div>