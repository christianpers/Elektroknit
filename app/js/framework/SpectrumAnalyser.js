export default class SpectrumAnalyser{
	constructor(){

		this.node = null;
		this._parentEl = null;
		this._canvasObj = {};
		this._audioCtx = null;
		this._processArray = [];

		this._subbands = [];
				
		this.colorTheme = [];

		this._currMaxVal = 20;

		this.subbandWidthTable = [2,2,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12];
		this._currentSubbandTotWidth = 0;

		this.SUBBANDS = 64;
		this.HISTORY_SIZE = 43;
	}

	setup(ctx, audioCallback, callbackScope){

		this.node = ctx.createAnalyser();
		this.node.fftSize = 2048;
		this.node.maxDecibels = -30;
		this.node.minDecibels = -100;
		this._audioCtx = ctx;
		this._parentEl = parent;
		// this._canvasObj = this.createCanvasObj();
		this._processArray = new Uint8Array(this.node.frequencyBinCount);

		this.audioCallback = audioCallback;
		this.callbackScope = callbackScope;
	
	
		for (var i=0; i<this.SUBBANDS;i++){
			var historyArr = [];
			for (var k=0;k<this.HISTORY_SIZE;k++){
				var val = 0;
				historyArr.push(val);
			}

			var obj = {
				current:{
					sum: 0
				},
				history:{
					arr : historyArr,
					sum : 0 
				},
				idx:i
			};
			this._subbands.push(obj);
	
		}




		this._scriptNode = this._audioCtx.createScriptProcessor(this.node.frequencyBinCount,2,1);
	
		this._scriptNode.addEventListener('audioprocess', this._onAudioProcess.bind(this));

	};

	createCanvasObj(){

		var canvas = document.createElement('canvas');
		canvas.className = "waveformAnalyser";
		canvas.height = this._parentEl.clientHeight;
		canvas.width = this._parentEl.clientWidth;
		this._parentEl.appendChild(canvas);
		var context = canvas.getContext("2d");

		return {el: canvas, ctx: context};

	};

	_onAudioProcess(e){

		this.update();
		
		// this.render();
		this.createAudioData();
	};

	connect(node){

		node.connect(this.node);
		node.connect(this._scriptNode);

		this._scriptNode.connect(this._audioCtx.destination);

	};

	update(){

		// this.node.getFloatFrequencyData(this._processArray);
		this.node.getByteFrequencyData(this._processArray);
	
		// console.log(this._processArray);
		
	};

	createAudioData(){

		// var ret = new Float32Array(SpectrumAnalyser.SUBBANDS*3);
		var ret = [];

		this.calcSubbandEnergy();
		this.calcSubbandHistoryAverage();
		this.shiftHistory();

		var subbandRangeAverageSum = 0;
		var subbandRangeCurrentSum = 0;


		
		var currentRow = new Float32Array(this.SUBBANDS);
		for (var i=0;i<this._subbands.length;i++){
			
			var currentSum = this._subbands[i].current.sum;
			var averageSum = this._subbands[i].history.sum;

			// ret[i] = {};
			// ret[i].current = currentSum;
			currentRow[i] = currentSum;
			


		}

		ret.push(currentRow);

		// var historyRows = [];
		for (var i=0;i<11;i++){
			var historySubband = new Float32Array(this.SUBBANDS);
			for (var x=0;x<this._subbands.length;x++){
				historySubband[x] = this._subbands[x].history.arr[i]
			}
			ret.push(historySubband)
			// historyRows[i] = historySubband;
		}





		// debugger;
		// window.onAudioData(ret);

		this.audioCallback.call(this.callbackScope, ret);
	};

	getFreqFromFFTIdx(idx){

		var ret = false;

		if (idx < 512){
			ret = idx * this._audioCtx.sampleRate / this.node.frequencyBinCount;
		}

		return ret;
	};

	render(){

		var ctx = this._canvasObj.ctx;
		var canvas = this._canvasObj.el;

		this.calcSubbandEnergy();
		this.calcSubbandHistoryAverage();
		this.shiftHistory();

		var subbandWidth = canvas.width / this._subbands.length;

		ctx.clearRect(0,0,canvas.width, canvas.height);
		
		var subbandRangeAverageSum = 0;
		var subbandRangeCurrentSum = 0;

		var wHeight = window.innerHeight / 4;

		for (var i=0;i<this._subbands.length;i++){
			
			var currentSum = this._subbands[i].current.sum;
			var averageSum = this._subbands[i].history.sum;

			if (currentSum > this._currMaxVal)
				this._currMaxVal = currentSum;

			var relHeightCurrent = currentSum / this._currMaxVal;
			relHeightCurrent = relHeightCurrent * wHeight;

			var relHeightAverage = averageSum / this._currMaxVal;
			relHeightAverage = relHeightAverage * wHeight;

			ctx.font = '10px Arial';
			ctx.fillStyle = this.colorTheme[0];
			// ctx.fillText(i+1,subbandWidth*i+subbandWidth/4, 20);

			// debugger;
			

			ctx.fillStyle = this.colorTheme[2];
			ctx.fillRect(subbandWidth*i, canvas.height, subbandWidth, -relHeightAverage);

			ctx.fillStyle = this.colorTheme[1];
			ctx.fillRect(subbandWidth*i, canvas.height, subbandWidth, -relHeightCurrent);

		}

	};

	

	calcSubbandEnergy(){


		this._currentSubbandTotWidth = 0;



		for (var i=0;i<this._subbands.length;i++){

			var subbandSize = this.subbandWidthTable[i];

			var obj = this._subbands[i].current;
			obj.sum = 0;
			obj.width = subbandSize;

		
			var range = this._currentSubbandTotWidth;
			
			
			for (var k=range;k<range+subbandSize;k++){
				obj.sum += this._processArray[k];
				// console.log(k);
				
			}
			var startFreq = this.getFreqFromFFTIdx(range);
			var endFreq = this.getFreqFromFFTIdx(range+subbandSize);



			obj.sum *= subbandSize/(this.node.fftSize/2);
		
			this._currentSubbandTotWidth += obj.width;

		}
	};

	calcSubbandHistoryAverage(){

		for (var i=0;i<this._subbands.length;i++){

			var subbandHistory = this._subbands[i].history.arr;
			var subbandHistorySum = this._subbands[i].history.sum;
		
			for (var k=0;k<subbandHistory.length-1;k++){
				subbandHistorySum += subbandHistory[k];
				
			}
			subbandHistorySum *= 1/subbandHistory.length;

			this._subbands[i].history.sum = subbandHistorySum;

			

		}

	};


	shiftHistory(){

	
		var subbandTempArr = this._subbands.slice();

		for (var i=0;i<this._subbands.length;i++){
		
			var historyArr = this._subbands[i].history.arr;
			historyArr.unshift(subbandTempArr[i].current.sum);
			if (historyArr.length > this.HISTORY_SIZE)
				historyArr.pop();

			
		}
		

	};
}