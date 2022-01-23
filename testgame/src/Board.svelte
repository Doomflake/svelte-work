<script>
    import Square from "./Square.svelte";
    let squares = [null, null, null, null, null, null, null, null, null];
  </script>
  
  <style>
    .board {
      display: flex;
      flex-wrap: wrap;
      width: 300px;
    }
  </style>
  
  <div class="board">
    {#each squares as square, i}
      <Square value={i} />
    {/each}
  </div>
  <div>test</div>