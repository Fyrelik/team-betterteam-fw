var charTable = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function checkSenseRange(value)
{
	if(value == " " || value == "  " || value == "   " || value == "-0" || value == "-00" || value == "-0 " || value == " -0")
		return false;
}
function checkSense(numberError,rangeError)
{
	var sense = document.form1.percent;
	if(isNaN(sense.value)){
		alert(numberError);
		sense.select();
		return false;
	}
	if(checkSenseRange(sense.value) == false)
	{
		alert(rangeError);
		sense.select();
		return false;
	}
	if(range(sense.value,0,100) == false)
	{
		alert(rangeError);
		sense.select();
		return false;
	}
	if(isPosInt(sense.value)==false)
	{
		alert(numberError);
		sense.select();
		return false;
	}
}
function checkthreshold(numberError,rangeError)
{
	var sense = document.form1.sense;
	if(isNaN(sense.value)){
		alert(numberError);
		sense.select();
		return false;
	}
	if(checkSenseRange(sense.value) == false)
	{
		alert(rangeError);
		sense.select();
		return false;
	}
	if(range(sense.value,0,100) == false)
	{
		alert(rangeError);
		sense.select();
		return false;
	}
	if(isPosInt(sense.value)==false)
	{
		alert(numberError);
		sense.select();
		return false;
	}
}
function getFitProfile(p)
{
	var width = p[4].width;
	var profileNum = 4;
	for(var i = 2; 0 < i;i--)
	{
		if(p[i].codec == 'mp4')
		{
			if(numCheck(p[i].width - width) == 0)
			{
				width = p[i].width;	
				profileNum = i;
			}	
		}
	}
	return profileNum;
}
function SetState(isWizard)
{
	if(usePPapi)
	{
		M_UI_CLASS = (document.form1.dwMode[0].checked?'ui-selected-sel':'ui-selected-none');
		return;
	}
	/*if(typeof(camData.isIE) != 'undefined' && camData.isIE == 'false')
	{
		if(navigator.appVersion.indexOf("Mac") == -1)
			client = document.getElementById("ncscontrol");	
		else
			client = document.getElementById("MDApplet");
	}*/
	if(document.form1.dwMode[0].checked)
		client.SetMDMouseState(0);
	else
		client.SetMDMouseState(1);
}
function clearMotion()
{
	if(typeof(motionType) != "undefined" && motionType == '1')
	{
		if(usePPapi)
		{
			for(var i = 1;i<=totoalWindows;i++)
			{
				$("#MdArea_"+i).remove();
				$("#area"+i).remove(); 
				clearWindowMotion(i);
			}
			return;
		}

		for(var i=0; i<totoalWindows; i++)
		{
			client.SetMDCoordinate(640,480,0,0,i,i,1);
			clearWindowMotion(i+1);
		}
	}
	else
	{
		if(usePPapi)
		{
			var m_box = $("#divembeddNP .motion_box")[0];
			$('.ui-selected-sel', m_box).each(function(){
				$(this).removeClass('ui-selected-sel').addClass('ui-selected-none');
			});
			
			return;
		}

		client.ClearAllMDMatrix();
	}
}
function ReloadBG()
{
	client = document.getElementById("MDApplet");	
	client.ReloadBG();
}

function setProtocolRuleReverse(sur,tar)
{
	//init check
	if($("#"+ sur).attr("checked"))
		$("#" + tar).attr("disabled" , false);
	else
		$("#"+ tar).attr("disabled" , true);
	
	//add event
	$("#" + sur).change(function(){
		if($("#"+ sur).attr("checked"))
			$("#" + tar).attr("disabled" , false);
		else
			$("#"+ tar).attr("disabled" , true);
	});

}

function setWindowProtocolRuleReverse(sur, idx, tarFunc)
{
	if(typeof(tarFunc) !== "function")
		return false;

	$("#" + sur).change(function(){
		var _idx = this.id.split('_motion_')[1];
		if($(this).attr("checked"))
			tarFunc(_idx, true);
		else
			tarFunc(_idx, false);
	});

}

function checkWindowSense(senseid,numberError,rangeError)
{ 
	if(isNaN(senseid.value)){
		alert(numberError);
		sense.select();
		return false;
	}
	if(checkSenseRange(senseid.value) == false)
	{
		alert(rangeError);
		senseid.select();
		return false;
	}
	if(range(senseid.value,0,100) == false)
	{
		alert(rangeError);
		senseid.select();
		return false;
	}
	if(isPosInt(senseid.value)==false)
	{
		alert(numberError);
		senseid.select();
		return false;
	}
	
}
 
function checkWindowthreshold(percentid,numberError,rangeError)
{ 
	if(isNaN(percentid.value)){
		alert(numberError);
		percentid.select();
		return false;
	}
	if(checkSenseRange(percentid.value) == false)
	{
		alert(rangeError);
		percentid.select();
		return false;
	}
	if(range(percentid.value,0,100) == false)
	{
		alert(rangeError);
		percentid.select();
		return false;
	}
	if(isPosInt(percentid.value)==false)
	{
		alert(numberError);
		percentid.select();
		return false;
	}
}

function enrollWindowEvent(index){
	var eleID = "valid_motion_"+(index+1);
	
	$("#"+eleID).change(function(){
		if($("#"+eleID).attr("checked")){
			client.SetMDCoordinate(parseInt((drawAreas[index].x)*baseW/nativeW), (drawAreas[index].y)*baseH/nativeH, parseInt((drawAreas[index].w)*baseW/nativeW), (drawAreas[index].h)*baseH/nativeH, index, index, 1);
		}else{
			client.SetMDCoordinate(640, 480, 0, 0, index, index, 1);
		}
	});
}

function setWindowState(sur,tar1,tar2)
{
	
	$("#" + sur).change(function(){
		if($("#"+ sur).attr("checked"))
		{
			 console.log("window object is "+$("#"+tar1));
			$("#"+tar1).css("display","");
			$("#"+tar2).css("display",""); 
		
		}
		else
		{
			$("#"+tar1).css("display","none");
			$("#"+tar2).css("display","none"); 
		}
	});
}
function checkDrawWindow(winIdx,areaError)
{
	var x,y,w,h;

	if(document.getElementById("MdArea_"+winIdx) ==undefined)
	{
		if(document.getElementById("area"+winIdx) ==undefined)
		{
			alert(areaError);
			return false;
		}
		else
			return true;	
	}
	else
		return true;
}
function coverCooridate(curRect,coverMode,navW,navH,winIdx)
{
	var varStr,x,y,w,h;
	

	if(coverMode == 1)
	{
		x = parseInt($("#area"+winIdx).css('left'));
		y = parseInt($("#area"+winIdx).css('top'));
		w = parseInt($("#area"+winIdx).css('width'));
		h = parseInt($("#area"+winIdx).css('height'));
	//	alert("cover before:x"+x+" y:"+y+" w:"+w+" h:"+h);
		if(navW>w&&navH>h)
		{
			scaleW = navW/480;
			scaleH = navH/360; 
		}
		else
		{
			scaleW = 480/navW;
			scaleH =  360/navH;
		}		
	}
	else
	{
		x = curRect.x;
		y = curRect.y;
		w = curRect.w;
		h = curRect.h;

		
		if(parseInt(navW,10)<w&&parseInt(navH,10)<h)
		{
			scaleW = navW/480;
			scaleH = navH/360; 
		}
		else
		{
			scaleW = 480/navW;
			scaleH =  360/navH;
		}
		
	}	 
	
	varStr = parseInt(scaleW*x)+","+parseInt(scaleH*y)+","+parseInt(scaleW*w)+","+parseInt(scaleH*h);
	//var rect = new Array();
//rect=varStr.split(",");
//	console.log("coverMode:"+coverMode+" cover x:"+rect[0]+" y:"+rect[1]+" w:"+rect[2]+" h:"+rect[3]);
	return varStr;
}