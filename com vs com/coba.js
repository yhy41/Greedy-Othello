// INI MASIH UNTUK TAMPILAN DAN BEBERAPA REQUEREMENT GAME MASIH 1/2 JALAN 


var OT = OT ||
{
	samping: 8, 
	// Banyak dari bidak samping the board
	bawah: 8, 
	// banyak dari bidak bawah the board
	container: null, 
	// kontainer 
	messages: null, 
	// buat pesan nantinya
	errors: null, 
	// untuk pesan error
	player: 'player1', 

	players: {
		player1: {
			on: true,
			score: 2
		},
		player2: {
			on: false,
			score: 2
		}
	},
	
	// papan permaian yang di isi array 
	board: [], 
	/* untuk pemanggil antinya */
	Konstruktor: function()
	{
		// Get elements
		OT.container = document.getElementById("papan");
		OT.messages = document.getElementById("messages");
		OT.errors = document.getElementById("errors");

		// build board
		OT.setUp(OT.samping, OT.bawah);

		// posision awal player
		var l = Math.floor((OT.samping-1)/2);
		var r = Math.ceil((OT.samping-1)/2);
		
		var t = Math.floor((OT.bawah-1)/2);
		var b = Math.ceil((OT.bawah-1)/2);

		OT.board[l][t].obj.placeBagian(null, false);
		OT.board[r][b].obj.placeBagian(null, false);
		OT.player = 'player2';
		OT.board[l][b].obj.placeBagian(null, false);
		OT.board[r][t].obj.placeBagian(null, false);
		OT.player = 'player1';

		// validasi pergerakan player player 
		OT.validMoves();

		console.log("Black's Move");
		OT.showMessage("Black's Move");

		if (OT.players.player1.on) {
			setTimeout(OT.computerMove, 1500);
		}
	},
//////////////////////////////////////////////////// "konstruktor" /////////////////////////////////////////////////////////////
	/*
	 * buat papan permainanya
	 * inisialisasi #dari Bagian samping and bawah as acs, dwn
	 */
	setUp: function(acs, dwn)
	{
		for (var a=0; a<acs; a++)
		{
			var colArray = [];
			for (var d=0; d<dwn; d++)
			{
				colArray.push({'obj':new Bidak(OT, a, d), 'Bagians':null});
			}
			OT.board.push(colArray);
		}
	},

	passTurn: function() {
		GAME.showError("Passing turn . . .");
		GAME.switchPlayer();
	},
	/*
	 * untuk on off dari setiap player nantinya;
	 */
	switchPlayer: function ()
	{
		if (OT.player == 'player1') {
			OT.player = 'player2';
			OT.showMessage("White's Move");
		} else {
			OT.player = 'player1';
			OT.showMessage("Black's Move");
		}

		// penampilan dari validasi pergerakan player
		OT.validMoves();

		if (OT.players[OT.player].on) {
			setTimeout(OT.computerMove, Math.round(800+Math.random()*1200));
		}
	},
/////////////////////////////////////////////////// "pemeriksaan pergerakan pemain " /////////////////////////////////////////// 
	/*
	 * periksa seluruh array yang ada dan di validasi 
	 * apakah gerakan player valid atau tidak 
	 * 
	 */
	validMoves: function()
	{
	 for (var a=0; a<OT.board.length; a++) {
		 for (var d=0; d<OT.board[a].length; d++){
			 if (!OT.board[a][d].obj.myBagian && !!OT.board[a][d].obj.checkBagian()){
				 OT.board[a][d].obj.myBidak.classList.add("highlight");
			 }
		 }
	 }
	},

	removeValidMoves: function()
	{
	 for (var a=0; a<OT.board.length; a++) {
		 for (var d=0; d<OT.board[a].length; d++){
			 OT.board[a][d].obj.myBidak.classList.remove("highlight");
		 }
	 }
	},

	/*
	 * untuk scoring permainan 
	 */
	tallyBagians: function() {
		//OT.board TODO
		var playerTally = {};
		OT.forEachBagian(function(Bagian){
			if (playerTally[Bagian.myPlayer]) {
				playerTally[Bagian.myPlayer] ++;
			} else {
				playerTally[Bagian.myPlayer] = 1;
			}
		});

		for (player in playerTally) {
			OT.showScore(player, playerTally[player]);
		}
	},

	/*
	 * mengembalikan hasil dari scoring permainan 
	 */
	showScore: function(player, score) {
		document.getElementById("score-"+player).innerHTML = score;
	},

	forEachBidak: function(doThing) {
		for (var a=0; a<OT.board.length; a++) {
 			for (var d=0; d<OT.board[a].length; d++){
				doThing(OT.board[a][d].obj.myBidak);
			}
	 	}
 	},

	forEachBagian: function(doThing) {
		for (var a=0; a<OT.board.length; a++) {
 			for (var d=0; d<OT.board[a].length; d++){
				if (!!OT.board[a][d].obj.myBagian) {
					doThing(OT.board[a][d].obj);
				}
			}
	 	}
 	},

}

/*
 *  isi dari papan permainan 
 */

var Bidak = function (g, acs, dwn)
{
	var bidakObj = this;
	this.game = g;
	this.myX = acs;
	this.myY = dwn;
	this.myPlayer = null;
	this.myTweens = {};
// penambahan bulat bulat kedalam bidak/papan
	this.myBidak = document.createElement("span");
	var classlist = "bidak";
	if (this.myY == 0) {
		// baris pertama
		classlist = classlist + " first";
	}
	if ((this.myX + this.myY)%2 == 0) {
		
		classlist = classlist + " odd";
	}
	this.myBidak.setAttribute("class", classlist);
	this.myBidak.onclick = function(){
		// perwarnaan biar lebih menarik untuk odd
		if (!bidakObj.game.players[bidakObj.game.player].on) {
			bidakObj.placeBagian(null, true);
		}
	};
	this.game.container.appendChild(this.myBidak);

	this.myBagian;

	this.placeBagian = function(e, playerIsPlacing)
	{
		console.log("place Bagian");
		if (playerIsPlacing) {
			var BagiansToFlip = this.checkBagian();
			if(BagiansToFlip == false) {
				this.game.showError("Invalid move. ("+this.myX+","+this.myY+")");
				// pesan menentukan bahwa ketidak valitan
				return false;
			}
		}

		if (this.game.board[this.myX][this.myY].obj.myPlayer == null) {
			//set bagian papan
			this.game.board[this.myX][this.myY].obj.myPlayer = this.game.player;
			this.myPlayer = this.game.player;
			//penempatan setiap bulatan bulatan
			this.myBagian = document.createElement("span");
			this.myBagian.setAttribute("class", "Bagian " + this.game.player);
			this.myBidak.appendChild(this.myBagian);
			// pemanggilan cek pergerakana
			this.myBidak.onclick = null;

			setTimeout(function(){bidakObj.myBagian.classList.add("placed")}, 20); // Give the Bagian the "placed" class so it falls onto the board

			this.game.removeValidMoves();
			setTimeout(function(){bidakObj._checkWin()}, 250);
			setTimeout(function(){bidakObj.game.tallyBagians()}, 250);

			if (playerIsPlacing) {
				setTimeout(function(e){bidakObj.flipBagians(BagiansToFlip)}, 250);
			}
		}
	}

	//mengembalikan false jika gerakan tidak valid (tidak ada Bagian dengan warna yang berlawanan di dekatnya, dan tidak ada gerakan yang dapat dilakukan
	//kembali dengan Bagian untuk membalik (dalam urutan) jika langkah tersebut valid
	this.checkBagian = function()
	{
		var opposingPlayer = '';
		var thisPlayer = '';
		if (this.game.player == 'player1') { opposingPlayer = 'player2'; thisPlayer = 'player1'; }
		else { opposingPlayer = 'player1'; thisPlayer = 'player2'; }


		var modifiers = [function(cor){cor.y--;return cor;},			//atas 
								 function(cor){cor.x++; cor.y--;return cor;},	//atas kanan
								 function(cor){cor.x++;return cor;},			//bawah
								 function(cor){cor.x++; cor.y++;return cor;},	//bawah kanan
								 function(cor){cor.y++;return cor;},			//bawah
								 function(cor){cor.x--; cor.y++;return cor;},	//bawah ngriri
								 function(cor){cor.x--;return cor;},			//left
								 function(cor){cor.x--; cor.y--;return cor;}];//atas ngiri

		var BagianArray = [];

		for(var i=0; i<modifiers.length; i++)
		{
			var cor = {'x':this.myX, 'y':this.myY};
			var tempList = [];
			var isValid = false;
			var nextBagian = true;

			do {
				//untuk mengubah nilai setelah di validasi
				cor = modifiers[i](cor);


				if (isWithinBounds()) {

					var isOppositeResult = isOpposite();
					// jika sudah berada di ujung jangan perikasi lagi
					if (isOppositeResult == null) {
						nextBagian = false;
					} else if (isOppositeResult == true) {
						tempList.push({'x':cor.x, 'y':cor.y});
					} else if (isOppositeResult == false) {
						if (tempList.length > 0) {
							isValid = true;
						} else {
							nextBagian = false; 
						}
					}
				}
			} while(isWithinBounds() && isValid == false && nextBagian == true);

			if (isValid != false && tempList.length > 0) {
				BagianArray.push(tempList);
			}
		}

		if (BagianArray.length == 0) {
			return false;
		} else { 
			return BagianArray;
		}


		function isWithinBounds() {
			if(cor.x >= 0 && cor.x <= bidakObj.game.samping-1 && cor.y >= 0 && cor.y <= bidakObj.game.bawah-1) {
				return true;
			} else {
				return false;
			}
		}

		function isOpposite() {
			if (bidakObj.game.board[cor.x][cor.y].obj.myPlayer == opposingPlayer) {
				return true;
			}
			else if (bidakObj.game.board[cor.x][cor.y].obj.myPlayer == thisPlayer) {
				return false;
			}
			else {
				return null;
			}
		}
	}

	this.flipBagians = function(which)
	{
		var flipCount = 0;
		var delay = 333;

		for (var i=0; i<which.length; i++)
		{
			for (var j=0; j<which[i].length; j++)
			{
	
				setTimeout(bidakObj.game.board[which[i][j].x][which[i][j].y].obj.flipMe, flipCount * delay);
				flipCount++;

				setTimeout(bidakObj.game.tallyBagians, flipCount * delay);
			}
		}

		setTimeout(bidakObj.game.switchPlayer, flipCount * delay);
	}

	this.flipMe = function()
	{
		if (bidakObj.myPlayer == 'player1') {
			bidakObj.myPlayer = 'player2';
			bidakObj.myBagian.classList.remove("player1");
			bidakObj.myBagian.classList.add("player2");
		} else if (bidakObj.myPlayer == 'player2') {
			bidakObj.myPlayer = 'player1';
			bidakObj.myBagian.classList.remove("player2");
			bidakObj.myBagian.classList.add("player1");
		}
	}

	return this;
}


