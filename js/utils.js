/*
	*UTILITY FUNCTIONS*
*/
//dialog button click for entering player name
function dialogClick()
{
	var legit = true;
	$('#error').html(''); //empty error messages
	//error check on input1
	var list = inputCheck($('#input').val())	//get value and get errors
	//if error list exists
	if(list.length > 0){//print errors for user
		for(var a = 0; a < list.length; a++)
			$('#error').append(list[a])
		legit = false;	//and name is not legit
	}	
	//if there were no errors => name is legit
	if(legit)
	{	//hide dialog and start game
		$("#dialog").parent().css("display","none");
		document.player = $('#input').val();
		document.running = true
		$('#content').fadeTo('fast',1)
		updateCards()
	}
}
//checks name for errors
function inputCheck(val)
{
	error = []			//if we find error in string we append error in this list
	if(val.length < 1)
	{
		error.push('<p>Entered value not valid or long enough</p>');
		return error;
	}
	if(val.length > 8)
		error.push('<p>Entered value is too long (over 8 char)</p>')
	//these are reqular expressions
	re = /(^\w+$)/;
	if(!re.test(val))
		error.push('<p>Entered value must contain only alphabets (no symbols or whitespace)</p>')
	re = /[0-9]/;
	if(re.test(val))
		error.push('<p>Entered value must contain only alphabets (no numbers)</p>')
	return error;//send error list for user
}
//http://stackoverflow.com/questions/3357553/how-to-store-an-array-in-localstorage
//opens localstorage and puts top10 list to its div
function loadStorage()
{
	//localStorage["toplist"] = JSON.stringify([ [400, "Lassi"]])
	//if storage exists, import
	if(localStorage["toplist"])
	{
		//use JSON parser to load arrays
		var array = JSON.parse(localStorage["toplist"])
		array = array.sort(); //sort array
		$("#top10").children("table").html(""); //empty the top10 list
		for (var i = 0; i < array.length; i++)
		{
			if(i==10) break; //if we already imported 10, break
			$("#top10").children("table").append("<tr><td>"+array[i][0]+"</td><td>"+array[i][1]+"</td></tr>")
		}
	}
}
//appends score to localstorage
function appendScore()
{
	//array variable
	var array = [];
	//if localstorage exists for toplist, import old
	if(localStorage["toplist"])
		array = JSON.parse(localStorage["toplist"])
	//create new array for score and push it to array
	var score = [parseInt(document.clock), document.player]
	array.push(score)
	//create json database from array and store it to localstorage
	localStorage["toplist"] = JSON.stringify(array)
}
//http://stackoverflow.com/questions/1533910/randomize-a-sequence-of-div-elements-with-jquery#11766418
$.fn.randomize = function(selector){
    (selector ? this.find(selector) : this).parent().each(function(){
        $(this).children(selector).sort(function(){
            return Math.random() - 0.5;
        }).detach().appendTo(this);
    });

    return this;
};