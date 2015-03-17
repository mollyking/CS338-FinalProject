Molly King
CS338 - Final Project

Running the project
    - Open "index.html" in a browser (preferably GoogleChrome)
    - There is a popup welcome dialog, so you may need to enable popups
	
Why program is necessary
    In a normal softball game, scorekeepers use 2 10x10 grids (1 for each team) to keep track of the game. Every player (up to 10) has a grid square for every inning (up to 10). As a scenario, say that a batter gets walked to first base. You record in their grid that they got to 1st by walking. Then, the next player hits the ball. You have to record where the person on 1st went in their grid, and where the batter went on their grid. So, in one play, you can be keeping track of four different grids, which can get confusing. My program allows you to keep track of the game in real time with one interface, and then will translate what happened to the "score book". This is important because, although the grids are confusing during the game, they are easy to read when you are reviewing the game after it's over. It will save this summary so you can go back at any time and review it easily.

Crash course in softball
    When a player comes up to bat, one of 3 things can happen: they can get walked, strikeout, or hit the ball. A walk is when the pitcher throws four balls not in the strike zone. They automatically go to first base, while anyone on first base automatically goes to second base, etc. A strikeout is when the pitcher throws three strikes in the strike zone. The batter is  out and the next batter is up. When the player hits the ball, they go to 1st (single), 2nd (double), 3rd (triple), or home (homerun). They can also be out. The game is divided into innings. 7 innings are played, and an inning is over when 3 outs are recorded. When on base, a batter can steal, which means running to the next base after the pitcher releases the ball. They can either be safe or out, depending on if the opposing team tags them with the ball in time. If the last out is a failed steal, the current batter will be the first batter in the next inning. In the program, you can steal a base by clicking the arrow in between the two bases. If you cannot steal, then there will be no arrow.

What to expect from each action:
	- Walk: 1st base is colored (player goes to that base), if player is on first, move to second
	- Strikeout: Out is recorded. 
	- Hit: Dialog should appear choosing Single (1st base), Double (2nd base), Triple (3rd base), Homerun (home plate, score is incremented by however many players were on base including the batter), Out (out recorded)
		- If anyone is on base, dialog should appear asking where the players are with the base options and out option
	- Balls/Strikes: don't do anything, they are for record purposes only
	- Clicking on an arrow between bases: dialog gives option to steal the base. 
		- If safe, goes to the next base (if next base is home, score is incremented by 1). 
		- If out, out is checked. If it's the third out, inning is incremented and batter stays the same.
	- Outs: Update when a strikeout occurs, hit out, or stolen base. When there are 3 outs, inning is incremented by 1 and the next batter bats (except if the 3rd out was a stolen base, in which case the batter currently batting is up to bat again with balls/strikes back to 0)
	- Away score can be changed manually, but does not do anything
	- Home score incremented automatically
    
Not implemented
    - There is no backend, so if the page refreshes, all the information you enter will disappear
        - This also means that the file dialog on the welcome screen does nothing, as well as saving every 60 seconds does not work
    - This program only tracks the home team stats, you can enter the away team score manually.
    - You cannot submit a roster, the default is Player 1 - Player 9.
    - Program does not check if multiple people on base advance to the same base at the same time. Also doesn't check to see if a player behind someone on base advances in front of them.
    - Does not handle a batter batting twice in one inning, or more than 7 innings
    - Balls and Strikes are not mandatory. This was done purposefully because many coaches do not care about keeping track of balls and strikes. 