var currentBatter = 1;
var inning = 1;
var outs = 0;
var homeScore = 0;
var awayScore = 0;
var onFirst = "Nobody on";
var onSecond = "Nobody on";
var onThird = "Nobody on";
baseToSteal=0;

$(document).ready(function() {
	$(function() {
		hitDialog = $( "#hitDialog" ).dialog({
			autoOpen: false,
			height: 300,
			width: 350,
			modal: true,
			buttons: {
				Okay: function() {
				HitBall();
				$(this).dialog("close");
				NextBatter();
			},
				Cancel: function() {
					$(this).dialog( "close" );
				}
			},
		});
		
		stealDialog = $( "#stealDialog" ).dialog({
			autoOpen: false,
			height: 300,
			width: 350,
			modal: true,
			buttons: {
				Okay: function() {
				debugger;
				StealBase();
				$(this).dialog("close");
				UpdatePlayersOnBase();
			},
				Cancel: function() {
					$(this).dialog( "close" );
				}
			},
		});
		
		
		$("#actionButton").on("click", function() {
			var $clickedOption = $("input[name=batterAction]:checked");
			if ($clickedOption.val() == "strikeout"){
				RecordOut();
				NextBatter()
			}
			
			else if($clickedOption.val() == "walk"){
				WalkBatter();
				NextBatter();
			}
			
			else if($clickedOption.val() == "hit"){
				hitDialog.dialog("open");
			}
		});
		
		$("#oneToTwo").on("click", function(){
			baseToSteal=2;
			stealDialog.dialog("open");
		});
		
		$("#twoToThree").on("click", function(){
			baseToSteal=3;
			stealDialog.dialog("open");
		});
		
		$("#threeToFour").on("click", function(){
			baseToSteal=4;
			stealDialog.dialog("open");
		});
	});
});



function NextBatter(){
	var $clickedOption = $("input[name=batterAction]:checked");
	var id = $clickedOption.attr('id');
	document.getElementById(id).checked=false;
	document.getElementById("ball1").checked=false;
	document.getElementById("ball2").checked=false;
	document.getElementById("ball3").checked=false;
	document.getElementById("strike1").checked=false;
	document.getElementById("strike2").checked=false;
	UpdatePlayersOnBase();
	currentBatter++;
	document.getElementById("playerName").innerText = "Player " + currentBatter;
}

function StealBase(){
	var $clickedOption = $("input[name=stealOutcome]:checked");
	var id = $clickedOption.attr('id');
	if(id == "safe"){
		if(baseToSteal==2){
			onSecond = onFirst;
			EmptyBase(1);
			document.getElementById("secondBase").src = "occupied.jpg";
		}
		else if(baseToSteal ==3){
			onThird = onSecond;
			EmptyBase(2);
			document.getElementById("thirdBase").src = "occupied.jpg";
		}
		
		else if(baseToSteal == 4){
			onThird = "Nobody on";
			EmptyBase(3);
			homeScore++;
		}
	}
	
	else if(id == "gotOut"){
		EmptyBase(1);
		RecordOut();
		UpdatePlayersOnBase();
	}
}

function HitBall(){
	var $clickedOption = $("input[name=hitOutcome]:checked");
	var id = $clickedOption.attr('id');
	if(id == "single"){
		document.getElementById("firstBase").src = "occupied.jpg";
		onFirst = document.getElementById("playerName").innerText;
	}
	
	else if (id == "double"){
		document.getElementById("secondBase").src = "occupied.jpg";
		onSecond = document.getElementById("playerName").innerText;
	}
	
	else if (id == "triple"){
		document.getElementById("thirdBase").src = "occupied.jpg";
		onThird = document.getElementById("playerName").innerText;
	}
	
	else if (id == "homerun"){
		homeScore++;
	}
	
	else if (id == "gotOut"){
		RecordOut();
	}
}

function EmptyBase(base){
	if(base == 1){
		document.getElementById("firstBase").src = "emptyBase.jpg";
		onFirst = "Nobody on";
	}
	
	else if(base == 2){
		document.getElementById("secondBase").src = "emptyBase.jpg";
		onSecond = "Nobody on";
	}
	
	else if(base == 3){
		document.getElementById("thirdBase").src = "emptyBase.jpg";
		onThird="Nobody on";
	}
}

function RecordOut(){
	outs++;
	if (outs==3){
		NewInning();
	}
	else{
		document.getElementById("out" + outs).checked=true;
	}
}

function NewInning(){
	inning++;
	document.getElementById("out1").checked=false;
	document.getElementById("out2").checked=false;
	document.getElementById("ball1").checked=false;
	document.getElementById("ball2").checked=false;
	document.getElementById("ball3").checked=false;
	document.getElementById("strike1").checked=false;
	document.getElementById("strike2").checked=false;
	EmptyBase(1);
	EmptyBase(2);
	EmptyBase(3);
	outs=0;
}

function WalkBatter(){
	//debugger;
	var src = document.getElementById("firstBase").src;
	src = GetFileName(src);
	
	if(src == "emptyBase.jpg"){
		document.getElementById("firstBase").src = "occupied.jpg";
		onFirst = document.getElementById("playerName").innerText;
		return;
	}
	
	src = document.getElementById("secondBase").src;
	src = GetFileName(src);
	
	if(src == "emptyBase.jpg"){
		document.getElementById("secondBase").src = "occupied.jpg";
		onSecond = onFirst;
		onFirst = document.getElementById("playerName").innerText;
		return;
	}
	
	src = document.getElementById("thirdBase").src;
	src = GetFileName(src);
	
	if(src == "emptyBase.jpg"){
		document.getElementById("thirdBase").src = "occupied.jpg";
		onThird = onSecond;
		onSecond = onFirst;
		onFirst = document.getElementById("playerName").innerText;
		return;
	}
	
	homeScore++;
	onThird = onSecond;
	onSecond = onFirst;
	onFirst = document.getElementById("playerName").innerText;
}

function UpdatePlayersOnBase(){
	document.getElementById("firstBase").title = onFirst;
	document.getElementById("secondBase").title = onSecond;
	document.getElementById("thirdBase").title = onThird;

	if (onThird != "Nobody on"){
		document.getElementById("threeToFour").style.visibility = "visible";
		document.getElementById("oneToTwo").style.visibility = "hidden";
		document.getElementById("twoToThree").style.visibility = "hidden";
	}
	
	else if (onSecond != "Nobody on"){
		document.getElementById("twoToThree").style.visibility = "visible";
		document.getElementById("oneToTwo").style.visibility = "hidden";
		document.getElementById("threeToFour").style.visibility = "hidden";
	}
	else if (onFirst != "Nobody on"){
		document.getElementById("oneToTwo").style.visibility = "visible";
		document.getElementById("twoToThree").style.visibility = "hidden";
		document.getElementById("threeToFour").style.visibility = "hidden";
	}
	
	else{
		document.getElementById("oneToTwo").style.visibility = "hidden";
		document.getElementById("twoToThree").style.visibility = "hidden";
		document.getElementById("threeToFour").style.visibility = "hidden";	
	}
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

