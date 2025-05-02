import { useState } from "react";

// Reusable square component
function Square({ value, onSquareClick, isWinning }) {
    // Dynamic Tailwind class for the square button
    const squareStyle = `
    flex items-center justify-center           // Center content
    w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28  // Responsive sizing
    border border-gray-400 rounded-lg          // Border and rounding
    text-4xl sm:text-5xl md:text-6xl font-bold // Text styling
    cursor-pointer                             // Cursor indication
    transition-colors duration-200 ease-in-out // Smooth background transition
    ${isWinning ? 'bg-green-200 text-green-800' : 'bg-white hover:bg-gray-100'} // Winning vs normal state
    ${value === 'X' ? 'text-blue-600' : 'text-red-600'} // Color for X and O
    `;

    // Render the square
    return <button className={squareStyle} onClick={onSquareClick}>{value}</button>
}

// Board component
function Board({ xIsNext, squares, onPlay }) {
    // Handle click event on a square
    function handleClick(i) {
        if (squares[i] || calculateWinner(squares).winner) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }

    // Check for the winner
    const {winner, line: winningLine} = calculateWinner(squares);
    let status;

    if (winner) {
        status = 'Winner: ' + winner;
    } else if (squares.every(Boolean)) {
        status = 'Draw!';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    // Render individual square
    const renderSquare = (i) => {
        const isWinning = winningLine && winningLine.includes(i);
        return (
            <Square 
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
            isWinning={isWinning}
            />
        );
    };

    // Dynamically create rows using loops
    const boardSize = 3;
    const boardRows = []
    for (let row = 0; row < boardSize; row++) {
        const rowSquares = [];
        for (let col = 0; col < boardSize; col++) {
            rowSquares.push(renderSquare(row * boardSize + col));
        }
        
        // Use Tailwind flex for rows
        boardRows.push(
            <div key={row} className="flex">
                {rowSquares}
            </div>
        );
    }

    // Render the board
    return (
        <div className="flex flex-col items-center">
            {/*Status for displaying the current game status */}
            <div className="text-2xl font-semibold mb-4 text-gray-700">{status}</div>
            {/* Board grid */}
            <div className="grid grid-cols-1 gap-1">
                {boardRows}
            </div>
        </div>
    )
}

// Main game component for managing game state and history
export default function Game() {
    // States for move history, current move, and game state
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    
    // Boolean to track whose turn it is
    // X is always the first player
    // True for X, False for O
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    // Handle play event
    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0,currentMove + 1),nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }
    
    // Handle jump to a specific move
    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    // Reset the game board
    function resetGame() {
        setHistory([Array(9).fill(null)]);
        setCurrentMove(0);
    }

    // Render the move history buttons
    const moves = history.map((squares,move) => {
        let description;
        if (move > 0) {
            description = 'Go to move # ' + move;
        } else {
            description = 'Go to game start';
        }
        
        return (
            <li key={move} className="mb-1">
                {/* Display text if it's the current move, otherwise a button */}
                {move === currentMove ? (
                    <span className="font-semibold text-gray-700">You are at move #{move}</span>
                ) : (
                    <button
                        onClick={() => jumpTo(move)}
                        // Tailwind styling for move buttons
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-800 transition-colors"
                    >
                        {description}
                    </button>
                )}
            </li>
        );
    });

    // Render the game component
    return (
    // Main container with Tailwind flex layout, centering, padding, and background
    <div className="flex flex-col md:flex-row justify-center items-start min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      {/* Game Board Area */}
      <div className="game-board mb-6 md:mb-0 md:mr-8 flex flex-col items-center">
        {/* Centering board elements */}
        {/* Game Title */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Tic Tac Toe</h1>
        {/* Render the Board component */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        {/* Reset Button Area */}
        <div className="mt-6 text-center">
            <button
                onClick={resetGame}
                // Tailwind styling for the reset button
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-0.5"
            >
                Reset Game
            </button>
        </div>
      </div>

      {/* Game Info Area (Move History) */}
      {/* Tailwind styling for the history panel */}
      <div className="game-info bg-white p-4 rounded-lg shadow-md w-full md:w-auto max-w-xs"> {/* Added max-width */}
        <h2 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Game History</h2>
        {/* Ordered list for moves */}
        <ol className="list-decimal list-inside space-y-1">{moves}</ol>
      </div>
    </div>
  );
}


// Helper function to calculate the winner
function calculateWinner (squares) {
    // All possible winning lines
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    // Check for a winner
    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner: squares[a], line: lines[i]};
        }
    }
    return {winner: null, line: null};
}