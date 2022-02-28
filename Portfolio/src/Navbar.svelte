<script>
import Navbutton from "./Navbutton.svelte";
import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
let current = "Homepage"
</script>
<style>
div {
    margin: auto;
    width: 100%;
    overflow: hidden;
}


</style>
<div>
<Navbutton on:click="{() => current = 'Frontpage'}">Home</Navbutton>
<Navbutton on:click="{() => current = 'Aboutme'}">About</Navbutton>
<Navbutton on:click="{() => current = 'Contactform'}" >Contact</Navbutton>
<Navbutton on:click="{() => current = 'Examples'}">Examples</Navbutton>
</div>