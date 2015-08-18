/*
 *  Game of Solitaire
 *  www-course assignment nr. 1 
 *  Lassi Lääti  
 *	
 *	REFERENCES:
 *	http://davidwalsh.name/css-flip
 *	http://bravenewmethod.com/2013/11/19/easy-html5-canvas-and-css-sprite-texture-atlas/
 *
 * 	textures:
 *	http://www.ironstarmedia.co.uk/2010/01/free-game-assets-08-playing-card-pack/
 */

//Global variables
var rot0 = "matrix(1, 0, 0, 1, 0, 0)" //matrix of 3x2, == transform: rotateY(0deg)
/*
	INITIALIZE DOCUMENT:
	-create stacks
	-create cards
*/
$(document).ready(function() {
	
	window.addEventListener('resize', function(){
		//cards in dealer stack have fixed position, they need to be recalibrated when window rezizes
		updateCards()
	}, false);
	//create bottom stacks
	for(var a = 1; a <= 7;a++)
	{
		//attach jQuery droppable class to each stack
		$("#stack"+a).droppable({
			greedy: true,
			accept: acceptDrop,
			drop: dropCard
		}).dblclick(function(event){
			/*
			Initialize double click to each stack, 
			we dont attach it to cards because dblclick event
			gets threw everything under mouse when triggered
			-> this way, threw whole stack of cards in one event
			*/
			//if there is at least one card-container inside this stack
			if($(event.currentTarget).find(".card-container").length > 0)
			{
				//find out the card id
				var card = $(event.currentTarget).find(".card-container").last().attr("id").split("-")
				//loop thew "finished cards stacks"
				for(var i = 8; i <= 11; i++)
				{
					//if in finished cards stack we have at least one card
					if($("#stack"+i).find(".card-container").length>0)
					{
						//get the last cards id
						var id = $("#stack"+i).find(".card-container").last().attr("id").split("-")
						//if card has same suit (card[1]) and one higher number (card[2]), then its ok
						if((id[1] == card[1] && card[2]==parseInt(id[2])+1))
						{
							//move card to finished stacks and update
							$(event.currentTarget).find(".card-container").last().detach().appendTo($("#stack"+i).find(".card-container").last())
							updateCards();
							return true
						}
					}
					// else if finished stack is empty, and card is ace (card numer is 1)
					else if(card[2] == "1"){
						//move card to finished stacks and update
						$(event.currentTarget).find(".card-container").last().detach().appendTo($("#stack"+i))
						updateCards();
						return true
					}
				}	
			}
		});
	}
	//initiate every finished stack as droppable
	for(var a = 8; a <= 11;a++)
		$("#stack"+a).droppable({greedy: true,accept: acceptDrop,drop: dropCard})
	/*
		dealer means pack in witch all the other cards are held
		dealer 2 is the second pack in witch player turns cards from original dealer to be used in game
	*/
	$("#dealer").css({"top:":"10px", "left":"10px"}).click(function(){
		//add click event to dealer
		//dealer got no cards at all, meaning every card has been moved and rotated 
		if($(this).find('.card-container').length == 0)
		{
			//while the rotated cards pack still has cards
			while($('#dealer2').find(".card-container").length)
			{
				//get the last card on every line, first rotate it back to 0 deg
				$('#dealer2').find(".card-container").last().children(".card").css({
					"-ms-transform":"rotateY(0deg)",
					"-webkit-transform":"rotateY(0deg)",
					"transform":"rotateY(0deg)"})
				$('#dealer2').find(".card-container").last().animate().stop() //then stop all animation, needed if player rages threw pack and happened just to start rotating this card
				$('#dealer2').find(".card-container").last().css({"top":10,"left":10}) // fix position
				$('#dealer2').find(".card-container").last().detach().appendTo("#dealer"); //append pack to dealer
			}
			
		}else //else there is still cards in dealer
		{	//move 3 cards
			var a = 3
			//but if there is less then 3 cards to move, move less...
			if($("#dealer").find(".card-container").length < 3) a = $("#dealer").find(".card-container").length
			for(var i=0;i<a;i++)
			{
				//find the last card in pack
				var card = $("#dealer").find(".card-container").last();
				card.css({"top":0,"left":-200}) //move it a bit
				$(card).detach().appendTo("#dealer2")//append it to rotated cards pack
				//delay each animation a tad more and when ready, flip the card
				$(card).delay(200*i).animate({left: 20*i, top:0}, 150, function() 
				{
					$(this).children(".card").css({
"					-ms-transform":"rotateY(180deg)",
					"-webkit-transform":"rotateY(180deg)",
					"transform":"rotateY(180deg)"}) // rotate it 180		
				}) //animate it for awesome move effect
					
			}
		}
		//after click event, update cards
		updateCards();
		
	})
	//update dealer 2 with double click event, for comments check stack dblclick event
	$('#dealer2').dblclick(function(event){
			$("content").find("card-container").each(function(){$(this).animate.stop()})
			/*even though this event has been assigned only to dealer2 div, in some browsers its called when user double clicks dealer1
			so add test if you are clicking front side of the card, so it doesnt matter if you are clicking wrong dealer*/
			if($(event.currentTarget).find(".card-container").length > 0 && $(event.currentTarget).attr("id") == "dealer2" && $(event.toElement).hasClass('front'))
			{
				var card = $(event.currentTarget).find(".card-container").last().attr("id").split("-")
	
				for(var i = 8; i <= 11; i++)
				{
					if($("#stack"+i).find(".card-container").length>0)
					{
						
						var id = $("#stack"+i).find(".card-container").last().attr("id").split("-")
						if((id[1] == card[1] && card[2]==parseInt(id[2])+1))
						{
							$(event.currentTarget).find(".card-container").last().detach().appendTo($("#stack"+i).find(".card-container").last())
							updateCards();
							return true
						}
					}
					else if(card[2] == "1"){
						$(event.currentTarget).find(".card-container").last().detach().appendTo($("#stack"+i))
						updateCards();
						return true
					}
				}	
			}
		});	
	//create cards
	for(var i=1;i<=4;i++)	//4 suits
	{
		for(var a=1; a<=13; a++) // each with 13 cards
		{
			//each cards has id as card-'suit'-'cardnumber'
			var id = "card-"+i+"-"+parseInt(14-a)
			//append cards to dealer
			$("#dealer").append('\
			<div id='+id+' class="card-container" x_dir="5" y_vel="0">\
				<div class="card">\
					<div class="front">\
					</div>\
					<div class="back">\
					</div>\
				</div>\
			</div>\
			');
			//move card background so that each card has own picture on front, check spritesheet for ref
			$("#"+id+" .card .front").css({
				"backgroundPosition": a*100+"px "+i*150+"px",
				"z-index":a*i+a
			});
			//initialize every card as draggable, but disabled
			$("#"+id).draggable({
				disabled: false,
				helper:'clone',
				containment:"document",
				start: onCardDragStart,
				drag:  onCardDrag,
				stop:  onCardDragStop,
				revert: "invalid",
				scroll: false,
				cursorAt: {top:75,left:50},
				zIndex: 100
			});
		}
	}
	//init dialog.
	$('#dialog').dialog({ draggable: false, resizable: false, width: 350, height: 300,
		buttons: {"PLAY" : dialogClick, "REPROT": function() {window.location='./README.html'}}	
	});
	//make second button float right...
	$(".ui-dialog-buttonset button:nth-child(2)").css("float", "right")
	//hide dialog titlebar, i find it ugly
	$(".ui-dialog-titlebar").hide();
	//start game update loop, run each 60 msec
	setInterval(update,60)
	//game init func
	$('#content').fadeOut('fast', function(){initGame();});
	//add on keypress for enter when entering new player name
	$(document).on("keypress", function(event){
		
		if($("#input").is(':focus') && event.keyCode == 13){
			dialogClick()
		}
	})
})
/*
	INIT GAME, is to be used whenever player starts new game
*/
function initGame()
{
	//load top list from storage
	loadStorage();
	//find all the cards, init
	$(document.body).find('.card-container').each(function(){
		$(this).css({"position":"absolute"})						//set position absolute, for some cards it changes
		$(this).children(".card").css({
		"-ms-transform":"rotateY(0deg)",
		"-webkit-transform":"rotateY(0deg)",
		"transform":"rotateY(0deg)"
		})	//make sure all cards are turned same way
		$(this).detach().appendTo("#dealer")						//append all back to dealer
		$(this).draggable({disabled:true})							//make sure all are disabled
	})
	$("#dealer").randomize(".card-container");						//thx stackoverflow, all cards are in random order
	//put cards in init positions
	for(var i = 1; i <= 7; i++)	//7 stacks
	{	
		for(var a = 7; a >= i; a--) //every stack has 1 more cards then previous
		{
			//just figure out where to append, if stack already has cards then we append to last card-container
			if($("#stack"+a).find(".card-container").length)
				$("#dealer").find(".card-container").last().detach().appendTo($("#stack"+a).find(".card-container").last())
			else $("#dealer").find(".card-container").last().detach().appendTo($("#stack"+a))
			$("#stack"+a).find(".card-container").last().css({"top":20,"left":0})
		}
		//rotate last card to face front up
		$("#stack"+i).find(".card-container").last().children(".card").css("transform","rotateY(180deg)")
		//add draggable to last card
		$("#stack"+i).find(".card-container").last().draggable({
				disabled: false,
				helper:'clone',
				appendTo: 'body',
				containment:"document",
				start: onCardDragStart,
				drag:  onCardDrag,
				stop:  onCardDragStop,
				revert: "invalid",
				scroll: false,
				cursorAt: {top:75,left:50},
				zIndex: 100
			})
	}
	//updat ecards
	updateCards();
	//document variables
	document.running = true;
	document.clock = 0;
	document.player = ""
	document.win = false;
}
/*
	Game update loop
*/
function update()
{
	//if player name has not been defined
	if(document.player == "")
	{
		//fade out the game and pop up the dialog
		$("#content").fadeOut();
		$('#dialog').parent().fadeTo('fast',1);
		//pause the game
		document.running = false
	}
	//if game is running
	if(document.running)
	{
		//add 0.06 to game clock (update is called every 0.06 secs)
		document.clock += 0.06;
		//for rounding up the float:
		//http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript
		$("#clock").html("<h3>time: "+parseFloat(document.clock).toFixed(1)+" s</h3><br>\
			Player:<h1>"+document.player+"</h1>")
	}

	if(document.win)
	{
		//if we won, pause the game
		document.running = false;	
		winscreen();
	}
}
/*
	UPDATE CARDS.
	most intresting function here, when using jQuery draggable and droppable,
	things dont sometimes (read usually) go as you would think. So manually 
	loop threw all cards whenever one is moved and check if they still act as they should
*/
function updateCards()
{
	//for all cards in dealer 1, disable draggable. also fix position to mach divs
	$("#dealer").find('.card-container').each(function(){
		$(this).draggable({disabled:true})
		$(this).css({"top":$("#dealer").offset().top+2,"left":$("#dealer").offset().left+2})
	})
	//for each card in dealer 2, disable dragging.
	$("#dealer2").find('.card-container').each(function(){
		$(this).draggable({disabled:true})
	})
	//for last card in dealer 2 enable dragging
	$("#dealer2").find(".card-container").last().draggable({
				disabled: false,
				helper:'clone',
				appendTo: 'body',
				containment:"document",
				start: onCardDragStart,
				drag:  onCardDrag,
				stop:  onCardDragStop,
				revert: "invalid",
				scroll: false,
				cursorAt: {top:75,left:50},
				zIndex: 100
			});
	//LOOP THREW STACKS
	$(".stack").each(function() {
		//calculate offset for each stack so that it covers all cards in it
		var offset = $(this).find('.card-container').length*20
		//FOR ALL STACKS 8-11
		if(parseInt($(this).attr("id").substring(5,$(this).attr("id").length))>7)
		{
			offset = 0;
			//all cards in these stacks should be positioned right above each other, so that you can move only highest card
			$(this).find(".card-container").each(function(){
				$(this).css({"top":0,"left":0,"position":"relative"})
				//also make sure that they are facing front up
				$(this).children(".card").css({
					"-ms-transform":"rotateY(180deg)",
					"-webkit-transform":"rotateY(180deg)",
					"transform": "rotateY(180deg)"
					})
			})
			$(this).css({"height": 150})
		}
		//FOR ALL STACKS 1-7 
		else 
		{
			//for each card in these stacks, position is relative and they are 20 pixels lower than their parent
			$(this).find('.card-container').each(function(){
				$(this).css({"position":"relative", "left":0,"top":20})
			})
			//for these stacks, update heights
			$(this).css({"height": 150+offset})
		}
		//for all stacks, find last card and make sure its facing front to top
		$(this).find(".card-container").last().children(".card").css({
			"-ms-transform":"rotateY(180deg)",
			"-webkit-transform":"rotateY(180deg)",
			"transform":"rotateY(180deg)"})
		//and make the last card draggable if not yet
		$(this).find(".card-container").last().draggable({
				disabled: false,
				helper:'clone',
				appendTo: 'body',
				containment:"document",
				start: onCardDragStart,
				drag:  onCardDrag,
				stop:  onCardDragStop,
				revert: "invalid",
				scroll: false,
				cursorAt: {top:75,left:50},
				zIndex: 100
			});
		$(this).children('.card-container').css({"top":0})
	})
	//finish game automatically if can (in case all card have been played)
	if($("#dealer").find(".card-container").length == 0 
		&& $("#dealer2").find(".card-container").length == 0
		&& allCardsTurned())
		autoMove();
	//else console.log("false")
	//and check for win condition
	if(!document.win)
		checkWin()
}
//loop threw cards and check if all cards have been turned
function allCardsTurned()
{
	var legit = true;
	$(document).find(".card").each(function()
	{
		if($(this).css("transform") == rot0)
			legit = false

	})
	return legit
}

//check win condition
function checkWin()
{
	var win = 1;
	//if stacks 8-11 all have 13 cards, all cards have been moved there
	for(var i = 8; i <= 11; i++)
	{
		if( $("#stack"+i).find(".card-container").length<13)
			win = 0
	}
	if(win)
	{
		document.running = false;
		document.win = true;
		appendScore()
		loadStorage()
	}
}
var winscreen = function () 
{
	$("#content").find(".card-container").each(function(){

		
	})
}
/*
	Automatically move card from stacks 1-7 to 8-11.
*/
var autoMove = function ()
{
	//for each stack
	$(".stack").each(function(){
		//if stack id is 1-7
		if(parseInt($(this).attr("id").substring(5,$(this).attr("id").length))<8)
		{	//if this stack still has cards
			if($(this).find(".card-container").length > 0)
			{	//find out the card id
				var card = $(this).find(".card-container").last().attr("id").split("-")
				//test for each stack 8-11
				for(var i = 8; i <= 11; i++)
				{	//if stack has cards in it
					if( $("#stack"+i).find(".card-container").length>0)
					{	//split the target cards id and test it
						var id = $("#stack"+i).find(".card-container").last().attr("id").split("-")
						if((id[1] == card[1] && card[2]==parseInt(id[2])+1))
						{
							if($("#dealer").find(".card-container").length == 0 && $("#dealer2").find(".card-container").length == 0)
							{
								$(this).find(".card-container").last().detach().appendTo($("#stack"+i).find(".card-container").last())
								updateCards();
								autoMove()
							}
						}
					}
				}	
			}
		}
	})
}
/*
Accept drop, this function checks if droppable is acceptable by draggable. 
if yes, automatically trigger dropCard
*/
function acceptDrop(event,ui)
{
	var cardID = $(event).attr("id")
	var name = cardID.split("-");
	//check that we are not trying to drop it to current parent (if in list of this objects parents is current events target)
	if($.inArray($(this).context, event.parents()) === -1)
	{
		var stackID = ($(this).attr("id")).substring(5, $(this).attr("id").length)
		var targetID = $(this).find('.card-container').last().attr("id")
		var cardID = $(event.context).attr("id").split("-")
		//if we are trying to drop to stacks 1-7
		if(stackID < 8)
		{	
			//if the stack we are dropping to has cards in it
			if(targetID)
			{
				//if we have target, split id (find out suit and number)
				targetID = targetID.split("-")
				//check if we are trying to drop black to red or red to black. blacks are nr. 1 and 3, reds 2 and 4.
				if((cardID[1] % 2 != targetID[1] % 2) && (cardID[1] != targetID[1]))
				{
					//if we are dropping to just one number higher card
					if(cardID[2] == targetID[2]-1)
						return true;		
				}
			}else if(!targetID && parseInt(cardID[2]) == 13) //otherwise just test if we are trying to drop king to empty stack
				return true
		}
		//if we are dropping to stacks 8-11
		else
		{
			//if we are dropping ace to nothing
			if(!targetID && cardID[2] == 1) return true;
			//else if target id exists
			else if(targetID)
			{
				//find out if suit is same and number is one hihger than targets
				targetID = targetID.split("-")
				if((targetID[1] == cardID[1]) && (parseInt(targetID[2])+1 == parseInt(cardID[2]))) return true
				else return false
			}
		}
	}
	else return false
	updateCards();
}
function dropCard(drop,ui)
{
	//in case we accept droppable, check if it has card children. if not, append to it
	if($(this).find('.card-container').length == 0)
		ui.draggable.detach().appendTo($(this));
	//otherwise find last card container, meaning last card child, and append to it
	else ui.draggable.detach().appendTo($(this).find('.card-container').last());
	updateCards();
}
//we use clone helper on draggable, so we hide the original while we are dragging
//http://stackoverflow.com/questions/16756675/two-different-behaviors-with-draggable-ui-helper-clone-and-non-clone-whats-goi
function onCardDragStart(event,ui){ $(this).hide() }
function onCardDrag(event, ui) {}
function onCardDragStop(event,ui){$(this).show();}