//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

function Screen(_x,_y,_scale,_full,_name){
	this.relX = _x;
	this.relY = _y;
	this.scale = _scale;

	this.name = _name;

	this.gotten = []; //the sections that've arrived
	this.coming = []; //the sections sent from peers

	this.gottenCount = 0;
	this.comingCount = 0;

	this.done = _full;

	for(var i=0;i<xDim*yDim;i++){
		this.gotten[i] = _full;
		this.coming[i] = _full;
	}
	var totalWidth = imgBuffer.width*this.scale;
	var totalHeight = imgBuffer.height*this.scale;
	var xPos = (this.relX*canvasActive.width)-totalWidth/2;
	var yPos = (this.relY*canvasActive.height)-totalHeight/2;
	if(_full){
		this.gottenCount=this.gotten.length;
		this.comingCount=this.coming.length;
		contextStatic.drawImage(imgBuffer,xPos,yPos,totalWidth,totalHeight);
	}
	else{
		contextStatic.drawImage(torrent,xPos,yPos,totalWidth,totalHeight);
	}
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

Screen.prototype.update = function(){
	//if not done, grab a needed section from a peer, and pull it
	if(!this.done && this.comingCount<this.coming.length){

		for(var i=0;i<screens.length;i++){

			if(screens[i].name!=this.name && screens[i].gottenCount>0 && Math.random()<.1){

				var rIndex = Math.floor(Math.random()*this.coming.length);
				var count=1;
				while((this.coming[rIndex]===true || screens[i].gotten[rIndex]===false) && count<this.coming.length){
					rIndex=(rIndex+1)%this.coming.length;
					count++;
				}
				if(count<this.coming.length){

					this.coming[rIndex] = true;

					var totalWidth = imgBuffer.width*this.scale;
					var totalHeight = imgBuffer.height*this.scale;
					var destScreenX = (this.relX*canvasActive.width)-totalWidth/2;
					var destScreenY = (this.relY*canvasActive.height)-totalHeight/2;
					var startScreenX = (screens[i].relX*canvasActive.width)-totalWidth/2;
					var startScreenY = (screens[i].relY*canvasActive.height)-totalHeight/2;

					var xIndex = Math.floor(rIndex%xDim);
					var yIndex = Math.floor(rIndex/xDim);

					var destSectionX = ((xIndex*sections[rIndex].width*this.scale)+destScreenX)/canvasActive.width;
					var destSectionY = ((yIndex*sections[rIndex].height*this.scale)+destScreenY)/canvasActive.height;
					var startSectionX = ((xIndex*sections[rIndex].width*this.scale)+startScreenX)/canvasActive.width;
					var startSectionY = ((yIndex*sections[rIndex].height*this.scale)+startScreenY)/canvasActive.height;

					var tempPacket = new Packet(startSectionX,startSectionY,destSectionX,destSectionY,this.scale,rIndex,this.name);
					packets.push(tempPacket);
					this.comingCount++;
				}
			}
		}
	}
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

Screen.prototype.addPacket = function(index){
	this.gotten[index] = true;
	this.gottenCount++;

	var totalWidth = imgBuffer.width*this.scale;
	var totalHeight = imgBuffer.height*this.scale;
	var xPos = (this.relX*canvasActive.width)-totalWidth/2;
	var yPos = (this.relY*canvasActive.height)-totalHeight/2;

	if(this.gottenCount===xDim*yDim){
		this.done = true;
		contextStatic.drawImage(imgBuffer,xPos,yPos,totalWidth,totalHeight);
	}
	else{

		var x = Math.floor(index%xDim);
		var y = Math.floor(index/xDim);

		var sectionX = (x*sections[index].width*this.scale)+xPos;
		var sectionY = (y*sections[index].height*this.scale)+yPos;
		var width = sections[index].width*this.scale;
		var height = sections[index].height*this.scale;

		contextStatic.drawImage(sections[index],sectionX,sectionY,width,height);
	}
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////