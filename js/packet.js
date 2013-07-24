//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

function Packet(x,y,targetX,targetY,scale,index,destName){
	this.relX = x;
	this.relY = y;
	this.scale = scale;
	this.targetRelX = targetX;
	this.targetRelY = targetY;
	this.stepAmount = 30;;
	this.currentStep = 0;
	this.arrived = false;

	this.index = index;

	this.destName = destName;

	this.xStep = (this.targetRelX-this.relX)/this.stepAmount;
	this.yStep = (this.targetRelY-this.relY)/this.stepAmount;
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

Packet.prototype.update = function(){
	//step it's position
	this.relX+=this.xStep;
	this.relY+=this.yStep;
	this.currentStep++;
	if(this.currentStep===this.stepAmount){
		this.arrived = true; //kill the packet, and tell the arrival screen it arrived
	}
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

Packet.prototype.paint = function(){

	var width = sections[this.index].width*this.scale;
	var height = sections[this.index].height*this.scale;
	var xPos = (this.relX*canvasActive.width)-(width/2);
	var yPos = (this.relY*canvasActive.height)-(height/2);

	contextActive.drawImage(sections[this.index],xPos,yPos,width,height);
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////