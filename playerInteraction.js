var currentBatter = 1;
var inning = 1;
var currentDataIndex=0;
var outs = 0;
var homeScore = 0;
var awayScore = 0;
var onFirst = -1;
var onSecond = -1;
var onThird = -1;
var tempHitBase = 0;
var tempOtherDialogBase = 0;
baseToSteal=0;
var atBatStats = [];

$(document).ready(function() {
	$(function() {
		//$( "#tabs" ).tabs();
		$("#tabs").tabs().css({
			'min-height': '620px',
			'overflow': 'auto',
			'z-index': '999'
		});
		hitDialog = $( "#hitDialog" ).dialog({
			autoOpen: false,
			height: 310,
			width: 350,
			modal: true,
			buttons: {
				Okay: function() {
				HitBall();
				$(this).dialog("close");
				GetOtherBases();
			},
				Cancel: function() {
					$(this).dialog( "close" );
				}
			},
		});
		
		stealDialog = $( "#stealDialog" ).dialog({
			autoOpen: false,
			height: 250,
			width: 400,
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
		
		otherRunnerDialog = $("#otherRunnerDialog").dialog({
			autoOpen: false,
			height: 310,
			width: 350,
			modal: true,
			buttons:{
				Okay: function(){
					$(this).dialog("close");
					OtherRunnerResults();
					NextBatter();
				},
				Cancel: function(){
					$(this).dialog("close");
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
	if(tempHitBase == 1){
		onFirst = currentDataIndex;
	}
	
	else if(tempHitBase == 2){
		onSecond = currentDataIndex;
	}
	
	else if(tempHitBase == 3){
		onThird = currentDataIndex;
	}
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
	AddSummary(currentDataIndex);
	AddSummary(onFirst);
	AddSummary(onSecond);
	AddSummary(onThird);
	currentBatter++;
	currentDataIndex++;
	if(currentBatter > 9){
		currentBatter = 1;
		currentDataIndex = currentDataIndex-9;
	}
	document.getElementById("playerName").innerText = "Player " + currentBatter;
	tempHitBase = 0;
	tempOtherDialogBase = 0;
	if(outs == 3){
		outs = 0;
		NewInning();
	}
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
			AddSummary(playerStealing);
			onSecond = onFirst;
			EmptyBase(1);
			document.getElementById("secondBase").src = "occupied.jpg";
		}
		else if(baseToSteal ==3){
			atBatStats[playerStealing].onThird = "SB";
			AddSummary(playerStealing);
			onThird = onSecond;
			EmptyBase(2);
			document.getElementById("thirdBase").src = "occupied.jpg";
		}
		
		else if(baseToSteal == 4){
			atBatStats[playerStealing].scored = "SB";
			AddSummary(playerStealing);
			onThird = -1;
			EmptyBase(3);
			homeScore++;
		}
	}
	
	else if(id == "gotOut"){
		atBatStats[playerStealing].out = "SB"+baseToSteal;
		AddSummary(playerStealing);
		EmptyBase(baseToSteal-1);
		UpdatePlayersOnBase();
		RecordOut();
		if(outs == 3){
			outs = 0;
			NewInning();
		}
	}
}

function EnableAllOptions(){
	var thirdRunner = document.getElementById("3rdOptions");
	var secondRunner = document.getElementById("2ndOptions");
	var firstRunner = document.getElementById("1stOptions");
	thirdRunner.options[0].disabled = false;
	thirdRunner.options[1].disabled = false;
	thirdRunner.options[2].disabled = false;
	secondRunner.options[0].disabled = false;
	secondRunner.options[1].disabled = false;
	secondRunner.options[2].disabled = false;
	secondRunner.options[3].disabled = false;
	firstRunner.options[0].disabled = false;
	firstRunner.options[1].disabled = false;
	firstRunner.options[2].disabled = false;
	firstRunner.options[3].disabled = false;
	firstRunner.options[4].disabled = false;
}

function GetOtherBases(){
	EnableAllOptions();
	var countHidden=0;
	var thirdRunner = document.getElementById("3rdRunner");
	var secondRunner = document.getElementById("2ndRunner");
	var firstRunner = document.getElementById("1stRunner");
	thirdRunner.style.display="block";
	secondRunner.style.display="block";
	firstRunner.style.display="block";
	
	if(onThird==-1){
		thirdRunner.style.display="none";
		countHidden++;
	}
	if(onSecond==-1){
		secondRunner.style.display="none";
		countHidden++;
	}
	if(onFirst==-1){
		firstRunner.style.display="none";
		countHidden++;
	}
	
	thirdRunner = document.getElementById("3rdOptions");
	secondRunner = document.getElementById("2ndOptions");
	firstRunner = document.getElementById("1stOptions");
	
	if(tempHitBase == 3){
		thirdRunner.options[0].disabled = true;
		secondRunner.options[0].disabled = true;
		secondRunner.options[1].disabled = true;
		firstRunner.options[0].disabled = true;
		firstRunner.options[1].disabled = true;
		firstRunner.options[2].disabled = true;
	}
	
	else if (tempHitBase == 2){
		secondRunner.options[0].disabled = true;
		firstRunner.options[0].disabled = true;
		firstRunner.options[1].disabled = true;
	}
	
	else if (tempHitBase == 1){
		firstRunner.options[0].disabled = true;
	}
	
	if(countHidden!=3){
		otherRunnerDialog.dialog("open");
	}
	
	else{
		NextBatter();
	}
}

function OtherRunnerResults(){
	if(document.getElementById("3rdRunner").style.display!="none"){
		var thirdBase = document.getElementById("3rdOptions");
		var thirdNewBase = thirdBase.options[thirdBase.selectedIndex].value;
		UpdateBase(thirdNewBase, 3, onThird);
	}
	
	if(document.getElementById("2ndRunner").style.display!="none"){
		var secondBase = document.getElementById("2ndOptions");
		var secondNewBase = secondBase.options[secondBase.selectedIndex].value;
		UpdateBase(secondNewBase, 2, onSecond);
	}
	
	if(document.getElementById("1stRunner").style.display!="none"){
		var firstBase = document.getElementById("1stOptions");
		var firstNewBase = firstBase.options[firstBase.selectedIndex].value;
		UpdateBase(firstNewBase, 1, onFirst);
	}
}

function UpdateBase(selected, base, onBase){
	if(selected == 0){
		atBatStats[onBase].out = atBatStats[currentDataIndex].playerId;
		AddSummary(onBase);
		EmptyBase(base);
		RecordOut();
	}
	
	else if(selected == 2){
		if (atBatStats[onBase].onSecond == ""){
			atBatStats[onBase].onSecond = atBatStats[currentDataIndex].playerId;
			AddSummary(onBase);
			onSecond = onBase;
			EmptyBase(base);
		}
	}
	else if(selected == 3){
		if (atBatStats[onBase].onThird == ""){
			atBatStats[onBase].onThird = atBatStats[currentDataIndex].playerId;
			AddSummary(onBase);
			onThird = onBase;
			EmptyBase(base);
		}
	}
	else if(selected == 4){
		ScoreRun(onBase);
	}
}

function HitBall(){
	var $clickedOption = $("input[name=hitOutcome]:checked");
	var id = $clickedOption.attr('id');
	if(id == "single"){
		document.getElementById("firstBase").src = "occupied.jpg";
		tempHitBase = 1;
		atBatStats[currentDataIndex].onFirst = "S";
		//onFirst = currentDataIndex;
	}
	
	else if (id == "double"){
		document.getElementById("secondBase").src = "occupied.jpg";
		tempHitBase = 2;
		atBatStats[currentDataIndex].onSecond = "D";
		//onSecond = currentDataIndex;
	}
	
	else if (id == "triple"){
		document.getElementById("thirdBase").src = "occupied.jpg";
		tempHitBase = 3;
		atBatStats[currentDataIndex].onThird = "T";
		//onThird = currentDataIndex;
	}
	
	else if (id == "homerun"){
		if(onThird != -1){
			ScoreRun(onThird);
		}
		
		if(onSecond != -1){
			ScoreRun(onSecond);
		}
		
		if(onFirst != -1){
			ScoreRun(onFirst);
		}
		
		atBatStats[currentDataIndex].scored = "HR";
		homeScore++;
	}
	
	else if (id == "gotOut"){
		atBatStats[currentDataIndex].out = "H";
		RecordOut();
	}
}

function ScoreRun(fromBase){
	atBatStats[fromBase].scored = atBatStats[currentDataIndex].playerId;
	homeScore++;
	AddSummary(fromBase);
	if(fromBase == onFirst){
		EmptyBase(1);
	}
	
	else if(fromBase == onSecond){
		EmptyBase(2);
	}
	
	else if(fromBase == onThird){
		EmptyBase(3);
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
	if (outs!=3){
		document.getElementById("out" + outs).checked=true;
	}
}

function NewInning(){
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
	for (i=0; i<9; i++){
		name = document.getElementById("playerName").innerText
		data = {playerId:currentDataIndex%9, playerName: "Player "+currentDataIndex%9, inning: inning, balls:0, strikes:0, out:"", onFirst:"", onSecond:"", onThird:"", scored:""};
		atBatStats.push(data);
		currentDataIndex++;
	}
	inning++;
	document.getElementById("inning").innerText = inning;
	UpdatePlayersOnBase();
}

function WalkBatter(){
	debugger;
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
		atBatStats[onSecond].onSecond = atBatStats[currentDataIndex].playerId;
		onFirst = currentDataIndex;
		return;
	}
	
	src = document.getElementById("thirdBase").src;
	src = GetFileName(src);
	
	if(src == "emptyBase.jpg"){
		document.getElementById("thirdBase").src = "occupied.jpg";
		onThird = onSecond;
		onSecond = onFirst;
		atBatStats[onSecond].onSecond = atBatStats[currentDataIndex].playerId;
		atBatStats[onThird].onThird = atBatStats[currentDataIndex].playerId;
		onFirst = currentDataIndex;
		return;
	}
	
	homeScore++;
	onThird = onSecond;
	onSecond = onFirst;
	atBatStats[onSecond].onSecond = atBatStats[currentDataIndex].playerId;
	atBatStats[onThird].onThird = atBatStats[currentDataIndex].playerId;
	onFirst = currentDataIndex;
}

function UpdatePlayersOnBase(){
	if (onFirst == -1){
		document.getElementById("firstBase").title = "Nobody on";
		document.getElementById("firstBase").src = "emptyBase.jpg";
	}
	else{
		document.getElementById("firstBase").title = atBatStats[onFirst].playerName;
		document.getElementById("firstBase").src = "occupied.jpg";
	}
	if (onSecond == -1){
		document.getElementById("secondBase").title = "Nobody on";
		document.getElementById("secondBase").src = "emptyBase.jpg";
	}
	else{
		document.getElementById("secondBase").title = atBatStats[onSecond].playerName;
		document.getElementById("secondBase").src = "occupied.jpg";
	}
	if (onThird == -1){
		document.getElementById("thirdBase").title = "Nobody on";
		document.getElementById("thirdBase").src = "emptyBase.jpg";
	}
	else{
		document.getElementById("thirdBase").title = atBatStats[onThird].playerName;
		document.getElementById("thirdBase").src = "occupied.jpg";
	}

	if (onThird != -1 && onFirst != -1){
		document.getElementById("threeToFour").style.visibility = "visible";
		document.getElementById("oneToTwo").style.visibility = "visible";
		document.getElementById("twoToThree").style.visibility = "hidden";
	}
	
	else if (onThird != -1){
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
	if(playerEntryIndex != -1){
		var newEntry = atBatStats[playerEntryIndex];
		
		if(newEntry.scored != ""){
			$('#data' + playerEntryIndex).html("<img class='summaryField' src='onHome.jpg'>");
		}
		
		else if(newEntry.onThird != ""){
			$('#data' + playerEntryIndex).html("<img class='summaryField' src='onThird.jpg'>");
		}
		
		else if(newEntry.onSecond != ""){
			$('#data' + playerEntryIndex).html("<img class='summaryField' src='onSecond.jpg'>");
		}
		
		else if(newEntry.onFirst != ""){
			$('#data' + playerEntryIndex).html("<img class='summaryField' src='onFirst.jpg'>");
		}
		
		else{
			$('#data' + playerEntryIndex).html("<img class='summaryField' src='fieldSummary.jpg'>");
		}
		$('#data'+ playerEntryIndex).append("<div>Balls: "+ newEntry.balls +"</div>");
		$('#data'+ playerEntryIndex).append("<div>Strikes: "+ newEntry.strikes +"</div>");
		$('#data'+ playerEntryIndex).append("<label class='outLabel'>" + newEntry.out + "</label>");
		$('#data'+ playerEntryIndex).append("<label class='toFirstLabel'>" + newEntry.onFirst + "</label>");
		$('#data'+ playerEntryIndex).append("<label class='toSecondLabel'>" + newEntry.onSecond + "</label>");
		$('#data'+ playerEntryIndex).append("<label class='toThirdLabel'>" + newEntry.onThird + "</label>");
		$('#data'+ playerEntryIndex).append("<label class='toHomeLabel'>" + newEntry.scored + "</label>");
	}
}
