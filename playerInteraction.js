var currentBatter = 1;
var inning = 1;
var outs = 0;
var homeScore = 0;
var awayScore = 0;

function onActionButtonClicked(){
	var $clickedOption = $("input[name=batterAction]:checked");
	if ($clickedOption.val() == "strikeout"){
		outs++;
		document.getElementById("out" + outs).checked=true;
	}
	
	else if($clickedOption.val() == "walk"){
		WalkBatter();
	}
	
	var id = $clickedOption.attr('id');
	document.getElementById(id).checked=false;
	currentBatter++;
	document.getElementById("playerName").innerText = "Player " + currentBatter;
}


function WalkBatter(){
	debugger;
	var src = document.getElementById("firstBase").src;
	src = GetFileName(src);
	
	if(src == "emptyBase.jpg"){
		document.getElementById("firstBase").src = "occupied.jpg";
		return;
	}
	
	src = document.getElementById("secondBase").src;
	src = GetFileName(src);
	
	if(src == "emptyBase.jpg"){
		document.getElementById("secondBase").src = "occupied.jpg";
		return;
	}
	
	src = document.getElementById("thirdBase").src;
	src = GetFileName(src);
	
	if(src == "emptyBase.jpg"){
		document.getElementById("thirdBase").src = "occupied.jpg";
		return;
	}
	
	homeScore++;
	document.getElementById("homeScore").innerText = homeScore;
}

function GetFileName(filePath){
	if(filePath.indexOf('/') >= 0) {
		var name = filePath.substring(filePath.lastIndexOf('/')+1);
	}
	return name;
}				
/*$(document).ready(function(){
	$( "button.actionButton" ).on( "click", function() {
		document.getElementById("out1").checked=true;
});
});*/

