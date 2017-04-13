var c = 0;
var aiPos = 0;
var walls = 0;
var avoided = 0;
var crash = 0;

function tick()
{
	c++;
	document.getElementById('stepsDone').value = c;
	moveWall(); // Move wall to left 
	checkCollision();
	experience();
}

var tickInterval;

function runSim(state)
{
	if(state==1)//run simulation
	{
		if (c>100) 
		{
			runSim('0'); //force stop
		}
		else
		{
			tickInterval = setInterval("tick();",15);
		}
	}
	else
	{
		//stop simulation
		clearInterval(tickInterval);
		c = 0;
		document.getElementById('stepsDone').value = c;
		document.getElementById('wall').style.left = null;
		document.getElementById('wall').style.right = '0px';
		document.getElementById('ai').style.marginTop = '50px';
		aiPos = 0;
		walls = 0;
		avoided = 0;
		crash = 0;

	}
}

function moveWall()
{
	var getWallX = document.getElementById('wall').offsetLeft;
	var getWallY = document.getElementById('wall').offsetTop;
	//remove
	document.getElementById('debugTextarea').innerHTML += "["+c+"] Wall posX: "+getWallX+" | Wall posY: "+getWallY+"\n";
	document.getElementById('debugTextarea').scrollTop = document.getElementById('debugTextarea').scrollHeight;
	//
	var getAIX = document.getElementById('sensor2').offsetLeft+500;
	var getAIY = document.getElementById('ai').offsetTop;

	var successRate = Math.floor((avoided/(avoided+crash)*100));


	document.getElementById('topDebug').innerHTML = "&nbsp;["+c+"]<br/>&nbsp;Wall ("+getWallX+", "+getWallY+")<br/>&nbsp;AI("+getAIX+", "+getAIY+")<br/>&nbsp;Walls:"+walls+" Avoided: "+avoided+" Crashed: "+crash+" Success Rate: "+successRate+"%";
	
	if(getWallX <= 0)
	{
		walls++;
	}
	else
	{
		getWallX = getWallX - 20;
		document.getElementById('wall').style.left = getWallX+'px';
	}
}

function moveCar(direction)
{
	if (aiPos<50) {aiPos = 50;}
	if (aiPos>200) {aiPos = 200;}

	if (direction == 'down')
	 {
	 	aiPos = aiPos +10;
	 }
	 else
	 {
	 	aiPos = aiPos -10;
	 }
	document.getElementById('ai').style.marginTop = aiPos+"px";
	
}

function checkCollision()
{
	var getWallX = document.getElementById('wall').offsetLeft;
	var getWallY = document.getElementById('wall').offsetTop+100;
	var getAIX = document.getElementById('sensor2').offsetLeft+500;
	var getAIY = document.getElementById('ai').offsetTop;

	if(getWallX<getAIX && getAIY>=getWallY-100 && getAIY<getWallY||getWallX<getAIX && getWallY-100>getAIY && getWallY-100<getAIY+50) 
	{
		//moveCar('down');
		document.getElementById('sensor2').style.backgroundColor = 'red';
		if (getWallX<100) {crash++;}
	}
	else
	{
		document.getElementById('sensor2').style.backgroundColor = 'white';
		if (getWallX<100) {avoided++;}
	}
	
}

var lastWallCount = 0;
var lastAvoided = 0;
var lastCrash = 0;
var tryzone = 0;

function experience()
{
	var aizone;
	var wallzone;
	var getWallY = document.getElementById('wall').offsetTop;
	var getAIY = document.getElementById('ai').offsetTop;

	var getWallCenter = (getWallY-100)+50;

	if (getWallCenter <= 150) 
	{
		document.getElementById('t_wall_zone').innerHTML = "0";
		wallzone = "0";
	}
	else
	{
		document.getElementById('t_wall_zone').innerHTML = "1";
		wallzone = "1";	
	}

	var getAICenter = (getAIY-100)+25;

	if (getAICenter  <= 150) 
	{
		document.getElementById('t_ai_zone').innerHTML = "0";
		aizone = "0";
	}
	else
	{
		document.getElementById('t_ai_zone').innerHTML = "1";
		aizone = "1";
	}
	//trying
	
	document.getElementById('t_try').innerHTML = tryzone;

	var buildvar = aizone+wallzone+tryzone;
	var experience00 = document.getElementById('succ_'+buildvar).innerHTML;

	//read and decide
	if (tryzone == 0) 
	{
		buildvarOther = aizone+wallzone+1;
		experience00Other = document.getElementById('succ_'+buildvarOther).innerHTML;
		if (parseInt(experience00Other)>parseInt(experience00)+parseInt(10)) 
		{
			buildvar = buildvarOther;
			experience00 = document.getElementById('succ_'+buildvar).innerHTML;
			tryzone = 1;
		}
	}
	if (tryzone == 1) 
	{
		buildvarOther = aizone+wallzone+0;
		experience00Other = document.getElementById('succ_'+buildvarOther).innerHTML;
		if (parseInt(experience00Other)>parseInt(experience00)+parseInt(10)) 
		{
			buildvar = buildvarOther;
			experience00 = document.getElementById('succ_'+buildvar).innerHTML;
			tryzone = 0;
		}
	}

	//move AI
	if (tryzone == 0)
	{
		moveCar('up');
	}
	else
	{
		moveCar('down');
	}

	if (lastWallCount != walls)
	{
		if (lastAvoided != avoided) 
		{
			experience00 = parseInt(experience00)+parseInt(1);
			document.getElementById('succ_'+buildvar).innerHTML = experience00;
			lastAvoided = avoided;
		}

		if (lastCrash != crash) 
		{
			experience00 = parseInt(experience00)-parseInt(1);
			document.getElementById('succ_'+buildvar).innerHTML = experience00;
			lastCrash = crash;
		}

		lastWallCount = walls;
		tryzone = Math.floor(Math.random()*2);//0-1

		var randomWallYPos = Math.floor(Math.random()*(200+1)+0);
		document.getElementById('wall').style.marginTop = randomWallYPos+"px";

		document.getElementById('wall').style.left = null;
		document.getElementById('wall').style.right = '0px';
	}
}