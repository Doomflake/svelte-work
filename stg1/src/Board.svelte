<script>
  import Square from "./Square.svelte";
  let play1 = "Jacob";
  let play2 = "Dad";
  let winner = null;
  let winning = null;
  let squares = [null, null, null, null, null, null, null, null, null];
  let xIsNext = true;
  $: status = "Next Player: " + (xIsNext ? play1 : play2);

  function restartGame() {
    squares = [null, null, null, null, null, null, null, null, null];
    xIsNext = true;
    winner = null;
  }

  function handleClick(i) {
    if (!squares[i]) {
      squares[i] = xIsNext ? "X" : "0";
      xIsNext = !xIsNext;
      winning = calculateWinner(squares)
      if (winning = X) {
        winner = "Jacob"}
        else {winner = "Dad"};
    //  winner = winning;
      ( 'Winner is ' + winning);
    }
  }

  function calculateWinner(squares) {
    const winningCombo = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < winningCombo.length; i++) {
      const [a, b, c] = winningCombo[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
     // winning = `${squares[a]}`;
      return `${squares[a]}`;
    }

    const isDraw = squares.every(square => square !== null);
    return isDraw ? "It's a draw" : null;
  }
</script>

<style>
  h3 {
    color: red;
  }

  .board {
    display: flex;
    flex-wrap: wrap;
    width: 300px;
  }
</style>

{#if winner}
  <h3>{winner}</h3>
{:else}
  <h3>{status}</h3>
{/if}

<div class="board">
  {#each squares as square, i}
    <Square value={square} handleClick={() => handleClick(i)} />
  {/each}
</div>

{#if winner}
  <button on:click={restartGame}>Restart Game</button>
{/if}