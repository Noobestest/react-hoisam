import React, { useEffect, useState, useRef } from 'react';
import './Games.css';

function Games() {
  const [context, setContext] = useState();
  const [canvas, setCanvas] = useState();
  let numberSequence = useRef(5);
  const tetrominos = {
    'I': [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    'J': [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    'L': [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    'O': [
      [1,1],
      [1,1],
    ],
    'S': [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    'Z': [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
    'T': [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ]
  };

  // const tetrominos = {
  //   'I': [
  //     [0,1,1,1,0],
  //     [0,0,1,0,0],
  //     [0,0,1,0,0],
  //     [0,1,1,1,0]
  //   ],
  //   'L': [
  //     [0,1,0,0,0],
  //     [0,1,0,0,0],
  //     [0,1,0,0,0],
  //     [0,1,1,1,0]
  //   ],
  //   'O': [
  //     [0,0,0,0,0],
  //     [0,1,1,1,0],
  //     [0,1,0,1,0],
  //     [0,1,1,1,0],
  //   ],
  //   'V': [
  //     [0,0,0,0,0],
  //     [1,0,0,0,1],
  //     [0,1,0,1,0],
  //     [0,0,1,0,0]
  //   ],
  //   'E': [
  //     [0,1,1,1,0],
  //     [0,1,0,0,0],
  //     [0,1,1,1,0],
  //     [0,1,0,0,0],
  //     [0,1,1,1,0],
  //   ],
  //   'U': [
  //     [0,0,0,0,0],
  //     [0,1,0,1,0],
  //     [0,1,0,1,0],
  //     [0,1,1,1,0],
  //   ],

  // };

  const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
  };

  let count = 0;
  const rowGrid = 20;
  const colGrid = 10;
  const grid = 32;
  const tetrominoSequence = [];
  const playfield = useRef([]);

  let rAF = useRef();  // keep track of the animation frame so we can cancel it
  let gameOver = false;

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
  
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const generateSequence = () => {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while (sequence.length) {
      const rand = getRandomInt(0, sequence.length - 1);
      const name = sequence.splice(rand, 1)[0];
      tetrominoSequence.push(name);
    }
  }

  const getNextTetromino = () => {
    if (tetrominoSequence.length === 0) {
      generateSequence();
    }

    var playfieldCol = 2;
    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];
  
    // I and O start centered, all others start in left-middle
    if(playfield.current.length > 0){
      playfieldCol = playfield.current[0].length / 2 - Math.ceil(matrix[0].length / 2);
    }
    
    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = name === 'I' ? -1 : -2;

    return {
      name: name,      // name of the piece (L, O, etc.)
      matrix: matrix,  // the current rotation matrix
      row: row,        // current row (starts offscreen)
      col: playfieldCol         // current col
    };
  }

  const tetromino = useRef(getNextTetromino());

  useEffect(() => {
    const dataCanvas = document.getElementById('game');
    const dataContext = dataCanvas.getContext('2d');

    setCanvas(dataCanvas);
    setContext(dataContext);

    if(context != null){
      // listen to keyboard events to move the active tetromino
      document.addEventListener('keydown', function(e) {
        if (gameOver) return;

        // left and right arrow keys (move)
        if (e.which === 37 || e.which === 39) {
          const col = e.which === 37
            ? tetromino.current.col - 1
            : tetromino.current.col + 1;

          if (isValidMove(tetromino.current.matrix, tetromino.current.row, col)) {
            tetromino.current.col = col;
          }
        }

        // up arrow key (rotate)
        if (e.which === 38) {
          const matrix = rotate(tetromino.current.matrix);
          if (isValidMove(matrix, tetromino.current.row, tetromino.current.col)) {
            tetromino.current.matrix = matrix;
          }
        }

        // down arrow key (drop)
        if(e.which === 40) {
          const row = tetromino.current.row + 1;

          if (!isValidMove(tetromino.current.matrix, row, tetromino.current.col)) {
            tetromino.current.row = row - 1;

            placeTetromino();
            return;
          }

          tetromino.current.row = row;
        }
      });
      // populate the empty state
      for (let row = -2; row < rowGrid; row++) {
        playfield.current[row] = [];

        for (let col = 0; col < colGrid; col++) {
          playfield.current[row][col] = 0;
        }
      }

      rAF.current = requestAnimationFrame(loop);
    };

  },[context])

  const rotate = (matrix) => {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
      row.map((val, j) => matrix[N - j][i])
    );
  
    return result;
  }

  const isValidMove = (matrix, cellRow, cellCol) => {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] && (
            // outside the game bounds
            cellCol + col < 0 ||
            cellCol + col >= playfield.current[0].length ||
            cellRow + row >= playfield.current.length ||
            // collides with another piece
            playfield.current[cellRow + row][cellCol + col])
          ) {
          return false;
        }
      }
    }
  
    return true;
  }

  const placeTetromino = () => {
    for (let row = 0; row < tetromino.current.matrix.length; row++) {
      for (let col = 0; col < tetromino.current.matrix[row].length; col++) {
        if (tetromino.current.matrix[row][col]) {
  
          //game over if piece has any part offscreen
          if (tetromino.current.row + row < 0) {
            return showGameOver();
          }

          playfield.current[tetromino.current.row + row][tetromino.current.col + col] = tetromino.current.name;
        }
      }
    }
  
    // check for line clears starting from the bottom and working our way up
    for (let row = playfield.current.length - 1; row >= 0; ) {
      if (playfield.current[row].every(cell => !!cell)) {
  
        // drop every row above this one
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < playfield.current[r].length; c++) {
            playfield.current[r][c] = playfield.current[r-1][c];
          }
        }
      }
      else {
        row--;
      }
    }
  
    tetromino.current = getNextTetromino();
  }

  const showGameOver = () => {
    cancelAnimationFrame(rAF.current);
    gameOver = true;
  
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
  }


  const loop = () => {
    rAF.current = requestAnimationFrame(loop);
    context.clearRect(0,0,canvas.width,canvas.height);

    // // draw the playfield.current
    for (let row = 0; row < rowGrid; row++) {
      for (let col = 0; col < colGrid; col++) {
        if (playfield.current[row][col]) {
          const name = playfield.current[row][col];
          context.fillStyle = colors[name];
  
          // drawing 1 px smaller than the grid creates a grid effect
          context.fillRect(col * grid, row * grid, grid-1, grid-1);
        }
      }
    }

 
    // draw the active tetromino
    if (tetromino.current) {
      // tetromino falls every 35 frames
      if (++count > 10) {
        tetromino.current.row++;
        count = 0;

        // place piece if it runs into anything
        if (!isValidMove(tetromino.current.matrix, tetromino.current.row, tetromino.current.col)) {
          tetromino.current.row--;
          placeTetromino();
        }
      }

      context.fillStyle = colors[tetromino.current.name];
      for (let row = 0; row < tetromino.current.matrix.length; row++) {
        for (let col = 0; col < tetromino.current.matrix[row].length; col++) {
          if (tetromino.current.matrix[row][col]) {

            // drawing 1 px smaller than the grid creates a grid effect
            context.fillRect((tetromino.current.col + col) * grid, (tetromino.current.row + row) * grid, grid-1, grid-1);
          }
        }
      }
    }
  }


  
  return (
    <div style={{textAlign:'center', width: '50%', margin:'auto'}}>
      <canvas style={{border:'5px solid black'}} width="320" height="640" id="game"></canvas>
    </div>
   
  );
}



export default Games;