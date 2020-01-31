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
:global(.active) {
	background-color: blueviolet;
}
</style>
<div>
<Navbutton>Home</Navbutton>
<Navbutton>About</Navbutton>
<Navbutton>Contact</Navbutton>
<Navbutton>Examples</Navbutton>
</div>