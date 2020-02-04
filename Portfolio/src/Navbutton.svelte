<script>

	import { createEventDispatcher } from 'svelte';
    
	const dispatch = createEventDispatcher();

/*	function navhandler() {
		dispatch('message', {
			text: {current}
		});
	}
*/
</script>
<style>
button {
    background: tan;
    border-radius: .4em;
    width: 25%; /* fallback for non-calc() browsers */
    width: calc(100% / 4);
    height: 2em;
    margin: auto;
    text-align: center;
    float: left;
    display: block;
}

</style>

<button on:click >
<slot />
</button> 

