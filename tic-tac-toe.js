function genBoard(board){
	console.log(` ${board[0]} | ${board[1]} | ${board[2]}`);
	console.log('---------');
	console.log(` ${board[3]} | ${board[4]} | ${board[5]}`);
	console.log('---------');
	console.log(` ${board[6]} | ${board[7]} | ${board[8]}`);
}

function replayGame(){
	let answer = prompt('Would you like to play again? Enter Y for yes or N for no');
	if (answer.toLowerCase() == 'y'){
		// refreshes the page
		location.reload();
	} else {
		quitGame();
	}
}

function randFirstMove(){
	// randomly decides first player
	let randVal = Math.round(Math.random());
	return randVal === 0 ? 'Player 1' : 'AI Player';

}

function quitGame(){
	// notifies the user of his/her decision to exit
	alert('You have exited the game. Come play again!');
}

function checkForDraw(board){
	// if every piece is not a blank element, the board is filled
	// and the game is considered a draw
	return board.every((element) => {return element !== ""});
}

function alternatePlayer(currentPlayer){
	return currentPlayer == 'Player 1' ? 'AI Player' : 'Player 1';
}

function checkForWin(board){

	// establishs all possible win combinations
	let winCombos = [
	  [0,1,2],
	  [3,4,5],
	  [6,7,8],
	  [0,3,6],
	  [1,4,7],
	  [2,5,8],
	  [0,4,8],
	  [2,4,6]
	 ];

	 // loops through each win combination
	for(let i=0; i < winCombos.length; i++){

	    let a, b, c;

	    a = board[winCombos[i][0]];
	    b = board[winCombos[i][1]];
	    c = board[winCombos[i][2]];

	    // if all values within the combination are equal, returns true
	    if(a === b && b === c && a !== ""){
	      return true;
	    }
	  }
	  return false;
}

function promptForMove(currentPlayer, board){
	var choice = 0;
	var isValid = false;
	// loops until user provides a valid move
	do {
	    choice = prompt(`${currentPlayer}, enter a number between 1 and 9 (ex. 1 is upper-left corner of board)`);
	    isValid = choice >= 1 && choice <= 9 && board[choice - 1] === "";
	    if(isValid){
	        return choice - 1;
	    } else{
	        alert("You must choose an empty spot by entering a number between 1 and 9.");
	    }
	} while ( !isValid );
}

var letters = { "Player 1": "X", "AI Player": "O"};
var aiNextMove;

// AI uses the minimax algorithm alongside alpha beta pruning optimization to make best decision
function aiChoice(currentPlayer, board, depth = 0, alpha, beta){
	// base case for win
	if(checkForWin(board)){
		return currentPlayer === 'AI Player' ? depth - 10 : 10 - depth;
	// base case for draw
	} else if(checkForDraw(board)){
		return 0;
	// allows AI to think 6 moves ahead, sufficient to be invincible at Tic Tac Toe
	} else if(depth >= 6){
		return 0;
	}
	// possible moves that player can make
	let posMove = emptySpots(board);
	
	if(currentPlayer === 'AI Player'){
		// Loop through possible moves
		for(let i = 0; i < posMove.length; i++){
			// duplicates board variable to pass a modified board as parameter to recursive call
			let scratchBoard = board.slice(0,board.length);
			scratchBoard[posMove[i]] = letters[currentPlayer];
			// simulates a hypothetical move on the board using recursion and obtains a score
			// based on that move using minimax
			let score = aiChoice(alternatePlayer(currentPlayer),scratchBoard,depth + 1, alpha, beta);
			// gathers highest alpha score for decision tree level
			if(score > alpha){
				alpha = score;
				// Only decides the AI player's next move if the depth is 0
				// All depths above 0 are simulations for future moves
				if(depth === 0){
					aiNextMove = posMove[i];
				}
			}
			// If a higher score was already decided by minimax, stop evaluating children decision nodes
			// that return a score lower than the max score on the parent node
			if(alpha >= beta){
				break;
			}
		}
		return alpha;
	} else {
		// Loop through possible moves
		for(let i = 0; i < posMove.length; i++){
			// Duplicate board variable to pass a modified board as parameter to recursive call
			let scratchBoard = board.slice(0,board.length);
			scratchBoard[posMove[i]] = letters[currentPlayer];
			// Simulates a hypothetical move on the board using recursion and obtains a score
			// based on that move using minimax
			let score = aiChoice(alternatePlayer(currentPlayer),scratchBoard,depth + 1, alpha, beta);
			// gathers lowest beta score for decision tree level
			if(score < beta){
				beta = score;
			}
			if(alpha >= beta){
				break;
			}
		}
		return beta;
	}
}

// Gathers an array of open spots on the board
function emptySpots(board){
	let emptySpaces = []; 
	for(let i = 0; i < board.length; i++){
		if(board[i] === ""){
			emptySpaces.push(i);
		}
	}
	return emptySpaces;
}

function initGame(){
	// creates an array with 9 empty strings
	let board = new Array(9).join(".").split(".");
	let move;
	let won = false;
	let currentPlayer = randFirstMove();
	// continues game as long as winner is undecided
	while(!won){
		// generates board
		genBoard(board);
		if(currentPlayer == 'Player 1'){
			// prompts current player for move
			move = promptForMove(currentPlayer, board);
		} else{
			aiChoice(currentPlayer, board, undefined, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
			move = aiNextMove;
		}

		// adjusts board with move
		board[move] = letters[currentPlayer];

		// checks board for winning position
		if (checkForWin(board)){
			won = true;
			genBoard(board);
			alert(`${currentPlayer} is the winner!`);
			replayGame();
		}
		
		// checks board for draw
		if (checkForDraw(board)){
			genBoard(board);
			alert('The game resulted in a draw.');
			replayGame();
		}

		// alternates player
		currentPlayer = alternatePlayer(currentPlayer);
	}
}

// initiates tic-tac-toe game
initGame();
