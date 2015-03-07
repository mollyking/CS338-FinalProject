var currentBatter = 1;
var inning = 1;
var currentDataIndex=0;
var outs = 0;
var homeScore = 0;
var awayScore = 0;
var onFirst = -1;
var onSecond = -1;
var onThird = -1;
baseToSteal=0;
var atBatStats = [];

$(document).ready(function() {
	$(function() {
		$( "#tabs" ).tabs();
		
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
			name = document.getElementById("playerName").innerText
			data = {playerId:currentBatter, playerName: name, inning: inning, balls:0, strikes:0, out:"", onFirst:"", onSecond:"", onThird:"", scored:""};
			atBatStats.push(data);
			var $clickedOption = $("input[name=batterAction]:checked");
			if ($clickedOption.val() == "strikeout"){
				atBatStats[currentDataIndex].out = "K";
				RecordOut();
				NextBatter()
			}
			
			else if($clickedOption.val() == "walk"){
				atBatStats[currentDataIndex].onFirst = "BB";
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
	atBatStats[currentDataIndex].strikes = NumberOfStrikes();
	atBatStats[currentDataIndex].balls = NumberOfBalls();
	document.getElementById(id).checked=false;
	document.getElementById("ball1").checked=false;
	document.getElementById("ball2").checked=false;
	document.getElementById("ball3").checked=false;
	document.getElementById("strike1").checked=false;
	document.getElementById("strike2").checked=false;
	UpdatePlayersOnBase();
	currentBatter++;
	currentDataIndex++;
	document.getElementById("playerName").innerText = "Player " + currentBatter;
	AddSummary(0);
}

function NumberOfBalls(){
	var ballCount = 0;
	if(document.getElementById("ball1").checked==true){
		ballCount++;
	}
	if(document.getElementById("ball2").checked==true){
		ballCount++;
	}
	if(document.getElementById("ball3").checked==true){
		ballCount++;
	}
	return ballCount;
}

function NumberOfStrikes(){
	var strikeCount = 0;
	if(document.getElementById("strike1").checked==true){
		strikeCount++;
	}
	if(document.getElementById("strike2").checked==true){
		strikeCount++;
	}
	return strikeCount;
}

function StealBase(){
	var $clickedOption = $("input[name=stealOutcome]:checked");
	var id = $clickedOption.attr('id');
	var playerStealing;
	if (baseToSteal==2){
		playerStealing = onFirst;
	}
	else if(baseToSteal==3){
		playerStealing = onSecond;
	}
	else if(baseToSteal==4){
		playerStealing = onThird;
	}
	
	if(id == "safe"){
		if(baseToSteal==2){
			atBatStats[playerStealing].onSecond = "SB";
			onSecond = onFirst;
			EmptyBase(1);
			document.getElementById("secondBase").src = "occupied.jpg";
		}
		else if(baseToSteal ==3){
			atBatStats[playerStealing].onThird = "SB";
			onThird = onSecond;
			EmptyBase(2);
			document.getElementById("thirdBase").src = "occupied.jpg";
		}
		
		else if(baseToSteal == 4){
			atBatStats[playerStealing].scored = "SB";
			onThird = -1;
			EmptyBase(3);
			homeScore++;
		}
	}
	
	else if(id == "gotOut"){
		atBatStats[playerStealing].out = "SB"+baseToSteal;
		EmptyBase(baseToSteal-1);
		RecordOut();
		UpdatePlayersOnBase();
	}
}

function HitBall(){
	var $clickedOption = $("input[name=hitOutcome]:checked");
	var id = $clickedOption.attr('id');
	if(id == "single"){
		document.getElementById("firstBase").src = "occupied.jpg";
		onFirst = currentDataIndex;
	}
	
	else if (id == "double"){
		document.getElementById("secondBase").src = "occupied.jpg";
		onSecond = currentDataIndex;
	}
	
	else if (id == "triple"){
		document.getElementById("thirdBase").src = "occupied.jpg";
		onThird = currentDataIndex;
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
		onFirst = -1;
	}
	
	else if(base == 2){
		document.getElementById("secondBase").src = "emptyBase.jpg";
		onSecond = -1;
	}
	
	else if(base == 3){
		document.getElementById("thirdBase").src = "emptyBase.jpg";
		onThird= -1;
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
	var src = document.getElementById("firstBase").src;
	src = GetFileName(src);
	
	if(src == "emptyBase.jpg"){
		document.getElementById("firstBase").src = "occupied.jpg";
		onFirst = currentDataIndex;
		return;
	}
	
	src = document.getElementById("secondBase").src;
	src = GetFileName(src);
	
	if(src == "emptyBase.jpg"){
		document.getElementById("secondBase").src = "occupied.jpg";
		onSecond = onFirst;
		onFirst = currentDataIndex;
		return;
	}
	
	src = document.getElementById("thirdBase").src;
	src = GetFileName(src);
	
	if(src == "emptyBase.jpg"){
		document.getElementById("thirdBase").src = "occupied.jpg";
		onThird = onSecond;
		onSecond = onFirst;
		onFirst = currentDataIndex;
		return;
	}
	
	homeScore++;
	onThird = onSecond;
	onSecond = onFirst;
	onFirst = currentDataIndex;
}

function UpdatePlayersOnBase(){
	if (onFirst == -1){
		document.getElementById("firstBase").title = "Nobody on";
	}
	else{
		document.getElementById("firstBase").title = atBatStats[onFirst].playerName;
	}
	if (onSecond == -1){
		document.getElementById("secondBase").title = "Nobody on";
	}
	else{
		document.getElementById("secondBase").title = atBatStats[onSecond].playerName;
	}
	if (onThird == -1){
		document.getElementById("thirdBase").title = "Nobody on";
	}
	else{
		document.getElementById("thirdBase").title = atBatStats[onThird].playerName;
	}

	if (onThird != -1){
		document.getElementById("threeToFour").style.visibility = "visible";
		document.getElementById("oneToTwo").style.visibility = "hidden";
		document.getElementById("twoToThree").style.visibility = "hidden";
	}
	
	else if (onSecond != -1){
		document.getElementById("twoToThree").style.visibility = "visible";
		document.getElementById("oneToTwo").style.visibility = "hidden";
		document.getElementById("threeToFour").style.visibility = "hidden";
	}
	else if (onFirst != -1){
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

function AddSummary(playerEntryIndex){
	var newEntry = atBatStats[playerEntryIndex];
	
	$('#data' + playerEntryIndex).html("<img class='summaryField' src='fieldSummary.jpg'>");
	//$('#data0').append($('<div/>',{innerText: newEntry.balls}));
	$('#data'+ playerEntryIndex).append("<div>Balls: "+ newEntry.balls +"</div>");
	$('#data'+ playerEntryIndex).append("<div>Strikes: "+ newEntry.strikes +"</div>");
	$('#data'+ playerEntryIndex).append("<label class='outLabel'>" + newEntry.out + "</label>");
	/*var tableRows = document.getElementById("inningSummary").rows;
	var newEntry = atBatStats[playerEntryIndex];
	
	var tableCells = tableRows[0].cells;
	var cell = tableCells[0];
	
	//var field = document.createElement("img");
	//field.src = "summaryField.jpg";
	
	var batterBalls = document.createElement("div");
	batterBalls.innerText = "Balls: " + newEntry.balls;
	
	var batterStrikes = document.createElement("div");
	batterStrikes.innerText = "Strikes: " + newEntry.strikes;
	
//	cell.appendChild(field);
	cell.appendChild(batterBalls);
	cell.appendChild(batterStrikes);
	document.getElementById("inningSummary").appendChild(cell);
	debugger;*/
}
