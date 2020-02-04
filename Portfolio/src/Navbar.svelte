<script>
import Navbutton from "./Navbutton.svelte";
</script>
<style>
div {
    margin: auto;
    width: 100%;
    overflow: hidden;
}
:global(.active) {
	background-color: blueviolet;
}
</style>
<div>
<Navbutton on:click >Home</Navbutton>
<Navbutton on:click >About</Navbutton>
<Navbutton on:click >Contact</Navbutton>
<Navbutton on:click >Examples</Navbutton>
</div>