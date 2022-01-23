<script lang="ts">
	const title = "Tic Tac Toe";
	import Board from "./Board.svelte";
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<h1>{title}</h1>
<div>{Board}</div>