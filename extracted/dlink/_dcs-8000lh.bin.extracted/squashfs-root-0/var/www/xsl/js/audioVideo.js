function profile(codec, scale, fps,bps,quality,audio_codec,encode_method) //profile data object
{
	this.codec = codec;
	this.scale = scale;
	this.bps = bps;
	this.fps = fps;
	this.quality = quality;
	this.audio_codec = audio_codec;
	this.encode_method = encode_method;
}

var setResolutionByPfile = function(_id, _codec,_info,_sensor)
{
		var tmpid = this._id,codec = this._codec, info =this._info , sensor = this._sensor;
		var scaleNow = 0;
		var encodeMethod = "";
		if(!tmpid) //from function call
		{	
			tmpid = _id;
			codec = _codec;
			info = _info;	
			sensor = _sensor;
		}
		var pCodecNow, tempArr;
		if(!codec)
			pCodecNow = $("#codec"+ tmpid +" > option:selected").get(0).text;
		else
			pCodecNow = codec;
		
		try{ //for recover previous setting
		
			scaleNow = $("#optScale"+ tmpid +" > option:selected").get(0).value;
			encodeMethod = $("#encode_method"+ tmpid +" > option:selected").get(0).text;
			
		}
		catch(e)
		{//do nothing scaleNow will equal to 0
		}
		
		tempArr = handleSpecialCase(info[pCodecNow], pCodecNow, tmpid , sensor);
		if(tempArr[0])
			setddlForSpecial("optScale" + tmpid, tempArr[1], "" , true);
		else
			setddlForSpecial("optScale" + tmpid, tempArr[1], "" , true);

		$("#optScale"+ tmpid).val(scaleNow);

		//to decide whether bps or jpeg show
		if(tmpid > 3)
			return;
		changeBpsQuality(tmpid, pCodecNow, encodeMethod);
}
function setddlForSpecial(id,obj,num, seq)
{
	$("#" +id+num).empty();
	for(var j=0 ; j < obj.length ; j++)
	{
		$("#" +id+num).append($("<option value='" + obj[j][1] + "'>" + obj[j][0] + "</option>"  ));

	}	
}
var handleSpecialCase = function(arrtemp,pCodecNow , pCount , sensor)
{
	var datainfo = [false, arrtemp];
	if(sensor.specialScale)
	{
		for(var i in sensor.specialScale)
		{
			//alert("!!" +pCount + " " + sensor.specialScale[i][0]  + "  "+ pCodecNow + "  "+ sensor.specialScale[i][2])
			if(pCount == sensor.specialScale[i][0] )
			{
				//alert("hit" + i);
				datainfo[0] = true;
				datainfo[1] = sensor.specialScale[i][1];
				return datainfo;	
			}
			/*if((isHDTVorXGA ==1) && (pCount == 5) && (pCodecNow == sensor.specialScale[i][2]))
			{
				//alert(i);
				datainfo[0] = true;
				datainfo[1] = sensor.specialScale[i][1];
				return datainfo;	
			}*/
		}
	}
	else
		return datainfo;
	return datainfo;
}
var setFpsByResolution = function(_id,pinfo)
{//scale=rusolution
	if(_id == 2) 
	{// init profile 2 fps by resolution
		var scale = pinfo[1].scale;
		var fps = pinfo[1].fps;
		var obj = document.getElementById("optFps2");
		
		if((scale == 0)||(scale == 1))
		{// if profile 2 rusolution = 1280x720
			setDropList("optFps2",[5,1],""); 
			if(fps > 5)
				obj.value = 5;
			else
				obj.value = fps;
		}
		else
		{
			setDropList("optFps2",[30,20,15,7,5,1],"");
			obj.value = fps;
		}
	}

	if(this._id == 2) 
	{//profile 2 change resolution will change fps 
		var scale = $("#optScale"+ 2 +" > option:selected").get(0).value;
		var fps = document.getElementById("optFps2").value;
		var obj = document.getElementById("optFps2");
		//alert("scale="+scale+"//////fps="+fps);
		if((scale == 0)||(scale == 1))
		{// if profile 2 rusolution = 1280x720
			setDropList("optFps2",[5,1],""); 
			if(fps > 5)
				obj.value = 5;
			else
				obj.value = fps;
		}
		else
		{
			setDropList("optFps2",[30,20,15,7,5,1],"");
			obj.value = fps;
		}
	}
}
var setBpsQualityByEncodeMethod = function(_id, _codec, _encodeMethod)
{
	var tmpid = this._id;
	var pCodecNow = this._codec;
	var encodeMethod = this._encodeMethod;
	
	if(!tmpid){
		tmpid = _id;
		pCodecNow = _codec;
		encodeMethod = _encodeMethod;
	}else{
		//reset encodeMethod value when Encode Method onChanged;  
		encodeMethod = $("#encode_method"+ tmpid +" > option:selected").get(0).text;
		//reset pCodecNow value when Encode Method onChanged;
		if(tmpid < 3){
			pCodecNow = $("#codec"+ tmpid +" > option:selected").get(0).text;	
		}else{
			if(tmpid == 3) pCodecNow = "H.264";
			if(tmpid == 4) pCodecNow = "H.264";
			if(tmpid == 5) pCodecNow = "JPEG";
		}
	}
	
	changeBpsQuality(tmpid, pCodecNow, encodeMethod);
}

var changeBpsQuality = function(tmpid, pCodecNow, encodeMethod)
{
	if(pCodecNow == 'JPEGa')
		{
			$("#encode_method" + tmpid).val("1");
			$("#encode_method" + tmpid).attr("disabled", true);
			$(".b" + tmpid+ "Group").hide();
			$(".q" + tmpid+ "Group").fadeIn(500);
		}
		else
		{
			$("#encode_method" + tmpid).attr("disabled", false);
			if(encodeMethod == "CBR"){
				
				$(".q" + tmpid+ "Group").hide();
				$(".b" + tmpid+ "Group").fadeIn(500);
				
			}else{
				
				$(".q" + tmpid+ "Group").fadeIn(500);
				$(".b" + tmpid+ "Group").hide();
				
			}
			
		}	
}

function AVAction(type,Pinfo,bpsOpt,qulityOpt,encodeMethodOpt)
{

	//var info;
	var pinfo = Pinfo;
	var info = AVData[type];
	this.init = function()
	{
		init(info,pinfo,bpsOpt,qulityOpt,encodeMethodOpt);	
	}
	this.changePfile = function()
	{
		setFPS(info.fps,pinfo);
		setCodec(info.codec,pinfo);
		setResolution(info.codec,pinfo);
		
	}
	var init = function(info,pinfo,bpsOpt,qulityOpt,encodeMethodOpt)
	{
		setFPS(info.fps,pinfo);
		setCodec(info.codec,pinfo,info);
		setResolution(info.codec,pinfo,info);
		setBps(bpsOpt,pinfo);
		setQulity(qulityOpt,pinfo);
		setEncodeMethod(encodeMethodOpt,pinfo);
	}

	var setCodec = function(info, pinfo, sensor)
	{
		for(var i = 1; i<= 3;i++)
		{
			if(i == 3) continue;
			if(isHDTVorXGA == 0)
			{
				if(i == 1)
					setDroplistBySeq("codec" + i, info, 0);
				else
					setDroplistBySeq("codec" + i, info, 0, "JPEG");
			}
			else//ov9710
				setDroplistBySeq("codec" + i, info, 0);
			
			if(pinfo)
				//document.getElementById("codec" + i).value = pinfo[i - 1].codec;
				$("#codec" + i).val(pinfo[i - 1].codec);
			var codec = document.getElementById("codec" + i);
			codec.onchange = setResolutionByPfile;
			codec._id = i;
			codec._codec = null;
			codec._info = info;
			codec._pinfo = pinfo;
			codec._sensor = sensor;
		}
	}
	
	var setResolution = function(info,pinfo, sensor)
	{	
		var pCodecNow, temp;
		for(var i = 1; i<= 3;i++)
		{
			if(i != 3){
				setResolutionByPfile(i,"",info , sensor);
			}  
			else{
				setResolutionByPfile(3,"H.264",info, sensor);
			}
		}
		
		if(pinfo)
		{
			for(var i = 1; i <= 3; i++)
			{
				if(pinfo)
				{
					//document.getElementById("optScale" + i).value = pinfo[i - 1].scale;
					$("#optScale" + i).val(pinfo[i - 1].scale);
				}
				
				if(isHDTVorXGA == 1)//for ov9710 and hm1375
				{
					var obj = document.getElementById("optScale" + i);
					obj._id = i;
					obj.onchange = setFpsByResolution;
					setFpsByResolution(i,pinfo);
				}
			}	
				//$("#optScale"+ i)[0].selectedIndex =pinfo[i - 1].scale;
		}
	}
	
	
	var setQulity = function(qulityOpt,pinfo)
	{
		for(var i = 1; i<= 3;i++)
		{
			setDropListByTwoObj("quality" + i,qulityOpt);
			var obj = document.getElementById("quality" + i);
			if(!obj)
				continue;
			if(pinfo)
			{
				//$("#quality" + i)[0].selectedIndex =pinfo[i - 1].quality;
				obj.value = pinfo[i - 1].quality;
			}
		}	
		
	}
	
	var setEncodeMethod = function(encodeMethodOpt,pinfo)
	{
		var codecNow = "";
		var encodeMethod = "";
		
		for(var i = 1; i<=3; i++)
		{
			setDropListByTwoObj("encode_method" + i,encodeMethodOpt);
			var obj = document.getElementById("encode_method" + i);
			if(!obj)
				continue;
			
			if(pinfo)
			{
				obj.value = pinfo[i - 1].encode_method;
			}
			
			try{
				
				if(i < 3){
					codecNow = $("#codec"+ i +" > option:selected").get(0).text;
				}
				else{
					if(i == 3)	codecNow = "H.264";
					if(i == 4)	codecNow = "H.264";
					if(i == 5)	codecNow = "JPEG";
				}
				
				encodeMethod = $("#encode_method"+ i +" > option:selected").get(0).text;
				
				}catch(e){
						//here do nothing;
						//codecNow/encodeMethod will default null;
					}
			obj.onchange = setBpsQualityByEncodeMethod;
			obj._id = i;
			obj._codec = codecNow;
			obj._encodeMethod = null;
			$("#encode_method" + i).css("width", "80px");
			
			setBpsQualityByEncodeMethod(i, codecNow, encodeMethod);
		}
	}
	
	var setBps = function(bpsOpt,pinfo)
	{
		for(var i = 1; i<= 3;i++)
		{
			if(i>1)
				setDropListByTwoObj("bps" + i,bpsOpt_800p);
			else
				setDropListByTwoObj("bps" + i,bpsOpt);
			
			var obj = document.getElementById("bps" + i);
			if(!obj)
				continue;
			if(pinfo)
				obj.value = pinfo[i - 1].bps;
		}	
		
	}
	
	var setFPS = function(info, pinfo)
	{
		for(var i = 1; i<= 3;i++)
		{
				
			/*if((isHDTVorXGA==1) && (i==3) && (pinfo[i-1].scale==0))
			{	
				setDropList("optFps" + i,[5,3,2,1],"");
			}
			else if(i ==5)
			{
				setDropList("optFps" + i,[5,3,2,1],"");
			}
			else*/
				setDropList("optFps" + i,info,"");
			
			var obj = document.getElementById("optFps" + i);
			if(!obj)
				continue;
			document.getElementById("optFps" + i).style.cssText = "width:50px";
			if(pinfo)
			{
				obj.value = pinfo[i - 1].fps;
			}
		}
	}

}
function setScaleDroplist(id,type,start,times,fromDroplist,toDroplist)
{
	var temp=0;
	for(var i=fromDroplist; i<= toDroplist;i++)
	{
		temp = start;
		var dropitem = document.getElementById(id+i);
		dropitem.options.length = 0;
		for(var j=0 ; j < eval(type).length ; j++)
		{
			var varItem = new Option(eval(type)[j],  temp);  
			dropitem.options.add(varItem); 
			temp += times;
		}
	}
}

function setFpsDroplist(id,type,fromDroplist,toDroplist)
{
	for(var i=fromDroplist; i<= toDroplist;i++)
		setDropList(id,type,i);
}

function checkOptExistValue(id,targetValue)
{
	var opt = document.getElementById(id);
	for(var i=0; i<opt.options.length;i++)
	{
		if (opt.options[i].value == targetValue)     
			return true;           
	}
	return false;
}

function setOption(scale,type) //use for scale and fps
{
	var temp = scale.split(' ');
	for(var i=1;i <= temp.length ; i++)
	{
		document.getElementById(type+i).value = temp[(i-1)];
	}

}
function checkScale(input) //check inputSize checkbox the same with xml:inputSize setting
{
	for(var i= 0 ; i< 4 ; i++)
	{
		if(document.form1.inputSize[i].checked)
		{
			if(((i == 2) &&  input == '1') || ((i == 1) &&  input == '5') || ((i == 3) &&  input == '2') || ((i == 4) &&  input == '3') || ((i == 0) &&  input == '0'))
				return true;
				
		}
			
	}
	return false;

}

function checkRTSPUrl(Errmsg1,Errmsg2,Errmsg3,Errmsg4)
{
	var url1, url2;
	var stdurl=/^[a-zA-Z0-9._-]+$/;
	for(var i = 1; i <= 3 ;i++)
    {
		url1 = document.getElementById("url" + i).value;
		if(null == url1.match(stdurl))
		{
			alert(Errmsg4);
			$("#url" + i).select();
			return false;
		}
		for(var j = 1; j <= 3 ;j++)
		{
			if(i!=j)
			{
				url1 = $("#url" + i).val();
				url2 = $("#url" + j).val();
				//if(url1.toUpperCase() == url2.toUpperCase())
				if(url1 == url2)
				{
					alert(Errmsg1 + i + Errmsg2 + j + Errmsg3);
					return false;
				}
	         }
        }
    }
	return true;
}

var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
function setDuration(pre,itemPre, sizePre)//
{
	var itemSize = 1;
	var sHour = $("#ssHour").val();
	var sMin = $("#ssMin").val();
	var eHour = $("#seHour").val();
	var eMin = $("#seMin").val();
	var overDay = false;
	if(parseInt(sHour, 10) > parseInt(eHour, 10))	
		overDay = true;
	else if(parseInt(sHour, 10) == parseInt(eHour, 10) && parseInt(sMin, 10) >= parseInt(eMin, 10) )
		overDay = true;
	var now, next;	
	for(var i = 1 ; i <= 7 ; i++)
	{
		now = (i-1) % 7;
		if($("#s" + days[ (i - 1) % 7]).attr("checked"))
		{	
			if(!overDay)
				next = (i-1) % 7;
			else
				next = (i) % 7;
			$("#" + itemPre + "item0" + itemSize).val(now + "," + sHour  +","+ sMin +"," +next +","+ eHour +","+ eMin);
			//alert("#" + itemPre + "item0" + itemSize + "  " + now + "," + sHour  +","+ sMin +"," +next +","+ eHour +","+ eMin);
			itemSize++;
		}
	}
	if(sizePre)
		$("#" + sizePre + "itemSize").val(--itemSize);
	else
		$("#itemSize").val(--itemSize);
}

function dateCheck(hourid,minid, hourErr, minErr)
{
	var _hour = document.getElementById(hourid).value;
	var _min = document.getElementById(minid).value;
	
	if(isPosInt(_hour) == false || _hour > 23)
	{
		alertAndSelect(hourid,hourErr);
		return false;
	}
	if(isPosInt(_min) == false || _min > 59)
	{
		alertAndSelect(minid,minErr);
		return false;
	}
	return true;
}


function setlightSensorOption(numHigh, numMedian, numLow, strHigh, strMedian, strLow, numSelect )
{
	$("#lightSensorLevel").empty();
	
	$("#lightSensorLevel").append($("<option value='" + numHigh + "'>" + strHigh + "</option>"));
	
	for (var i = numHigh - 5; i > numLow; i -= 5)
	{
		if(numMedian == i)
		{
			$("#lightSensorLevel").append($("<option value='" + i + "'>" + strMedian + "</option>"));
		}
		else if( i > numMedian)
			$("#lightSensorLevel").append($("<option value='" + i + "'>+" + ((i - numMedian) / 5) + "</option>"));	
		else
			$("#lightSensorLevel").append($("<option value='" + i + "'>-" + ((numMedian - i) / 5) + "</option>"));	
		
	}

	$("#lightSensorLevel").append($("<option value='" + numLow + "'>" + strLow + "</option>"));

	$("#lightSensorLevel")[0].selectedIndex = (numHigh - numSelect) / 5;
}

function setlightSensorOptionDlink(numHigh, numMedian, numLow, strHigh, strMedian, strLow, numSelect )
{
	$("#lightSensorLevel").empty();
	
	$("#lightSensorLevel").append($("<option value='" + numHigh + "'>" + strHigh + "</option>"));
	
	$("#lightSensorLevel").append($("<option value='" + numMedian + "'>" + strMedian + "</option>"));

	$("#lightSensorLevel").append($("<option value='" + numLow + "'>" + strLow + "</option>"));
	
	if(numSelect == numHigh)
		$("#lightSensorLevel")[0].selectedIndex = 0;
	else if(numSelect == numMedian)
		$("#lightSensorLevel")[0].selectedIndex = 1;
	else if(numSelect == numLow)
		$("#lightSensorLevel")[0].selectedIndex = 2;
}