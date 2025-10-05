function ptWording()
{
	this.btnpan;
	this.btnPatrol;
	this.btnstop;
	this.pan;
	this.tilt;
}
var g_idName = "PTControl2"; //default
var showPanPatrol = false;
var zoomCnt = 1;
function ptControl(fieldID,speedField, isSubPage, idName)
{	

	this.id = fieldID;
	this.speedFieldID = speedField;
	this.pt = new ptDir();
	this.ptword = new ptWording;
	this.prePath = "";
	if(isSubPage)
		this.prePath = "../";
	if(idName)
		g_idName = idName;
	

	this.init = function()
	{ 
		if( productoem != "D-Link" && productoem != "Trendnet")
			document.getElementById("ptObject").style.display = "";
		getPtWording(this.ptword);
		getPTImage(this.id, this.pt,this.ptword,this.prePath,this.idName);
		/*getFocusMode(this.speedFieldID,this.ptword);//speedFiedid should be change.*/
		getPanTileOption(this.speedFieldID,this.ptword);
		
		if(showPanPatrol)
			ptButton(this.id,this.ptword);
	}
	
	var getPTImage = function(id,pt,words, prePath, idName)
	{
		var temp = "";
		var field = document.createElement("div");
		temp = '<img name=\"'+g_idName+'\" id=\"'+g_idName+'\" class="ori" src="'+prePath+'images/dot.gif" border=\"0\" usemap=\"#MapMap2\" align=\"center\" />';
		temp += '<map name=\"MapMap2\" id=\"MapMap2\">';
		for(var i in pt)
		{
				temp += '<area shape=\"poly\" coords=\"'+pt[i][2]+'\" onmousedown=\"ptDown(\''+i+'\')\" onmouseup=\"ptUp(\''+i+'\','+pt[i][0]+' , '+ pt[i][1]+');\" onmouseover=\"ptOver(\''+i+'\')\" onmouseout=\"ptOut(\''+ i +'\')\" id=\"'+i+'\" alt=\"'+ wording[i].alt +'\" title=\"'+wording[i].alt+'\" />';	
				if(i=="home")
				{
						temp += '<area shape=\"circle\" coords=\"'+pt[i][2]+'\" onmousedown=\"ptDown(\''+i+'\')\" onmouseup=\"ptUp(\''+i+'\','+pt[i][0]+' , '+ pt[i][1]+');\" onmouseover=\"ptOver(\''+i+'\')\" onmouseout=\"ptOut(\''+ i +'\')\" id=\"'+i+'\" alt=\"'+ wording[i].alt +'\" title=\"'+wording[i].alt+'\" />';
				}
		}
		/*temp += "<area shape=\"circle\" coords=\"55,55,15\" onmousedown=\"ptDown('home')\" onmouseup=\"ptUp('home');\" onmouseover=\"ptOver('home')\" onmouseout=\"ptOut()\" id=\"pt_home\" alt=\""+wording['home'].alt+"\" title=\""+wording['home'].alt+"\" />";*/
		temp += '</map>';
		
		field.innerHTML = temp;
		document.getElementById(id).appendChild(field);
	}
	
	var getPanTileOption = function(id,words)
	{
		var field = document.createElement("div");
		var temp = "<div class='"+g_idName+"_pan'><div class='"+g_idName+"_pan_title'>";
		//pan
		temp += words.pan + "</div>";
		temp += '<div><select name="panSpeed" id="panSpeed">';
		for(var i = 1; i <= 9 ; i++)
				temp += '<option value="'+i+'">'+i+'</option>';
		temp += '<option value="10" selected="selected">10</option>';
		temp += '</select></div></div><div class="'+g_idName+'_tilt">';

		//tile
		temp += "<div class='"+g_idName+"_tilt_title'>" + words.tilt + "</div>";
		temp += '<div><select name="tiltSpeed" id="tiltSpeed">';
		for(var i = 1; i <= 9 ; i++)
				temp += '<option value="'+i+'">'+i+'</option>';
		temp += '<option value="10" selected="selected">10</option>';
		temp += '</select></div></div>';

		field.innerHTML = temp;
		document.getElementById(id).appendChild(field);
	}
	var ptButton = function(id,words)
	{
		var temp = "<br /><center>";
		var field = document.createElement("div");
		for(var i in words)
		{
			if(i.indexOf("btn") != -1)
			{
				temp += '<input type=\"button\" id=\"LiveView'+words[i]+'\" class="ptButtons" onclick="sendPatrol(\''+ i +'\');\" value=\"'+words[i]+'\" />';		
			}	
		}
		temp += "</center><br />";
		field.innerHTML = temp;
		document.getElementById(id).appendChild(field);
		
		
	}
}
var ptDown = function (type)
{
	document.getElementById(g_idName).className = type + "_d";
}
var ptOut = function (type)
{
	document.getElementById(g_idName).className = "ori";
	
}
var ptOver = function (type)
{
	document.getElementById(g_idName).className = type;
}
var ptUp  = function(type,x, y)
{//PT
	var ipAddress = getStandardIP();
	var hostname =  window.location.protocol  + "//" + ipAddress +  ":" + window.location.port;
	if(type =='Zoom_in')
	{
		if(navigator.appName == "Microsoft Internet Explorer" || navigator.userAgent.indexOf('Trident') != -1)
		{
			var dcscontrol1 = document.getElementById("dcscontrol1");
			var ratio = dcscontrol1.GetZoomRatio();
			if(ratio < 16)
			{
				ratio = ratio * 1.07;
				dcscontrol1.SetZoomRatio(ratio);
			}
			ptOver(type);
			return;
		}
		//if(navigator.appVersion.indexOf("Mac") == -1)//win + non-IE
		else
		{
			var player = document.getElementById("ncscontrol");
			if(usePPapi)
			{
				
				zoomCnt = zoomCnt*2;
				if(zoomCnt >8)
				{
					zoomCnt = 8;
					return;
				}
				player.postMessage(makeMessage('zoom', zoomCnt));
				return;
			}
			var localMulNum;
			localMulNum=player.GetZoomRatio();
			if(localMulNum<16)
			{
				localMulNum = localMulNum+1;
				player.SetZoomRatio(localMulNum);
			}
			ptOver(type);
			return;
		}
	}
	else if(type =='Zoom_out')
	{
		if(navigator.appName == "Microsoft Internet Explorer" || navigator.userAgent.indexOf('Trident') != -1)
		{
			var dcscontrol1 = document.getElementById("dcscontrol1");
			ptOver('zoon_out');
			var ratio = dcscontrol1.GetZoomRatio();
			if(ratio > 1){
			ratio = ratio/1.07;
			dcscontrol1.SetZoomRatio(ratio);
		}
			ptOver(type);
			return;
			
		}
		//if(navigator.appVersion.indexOf("Mac") == -1)//win + non-IE
		else
		{
			var player = document.getElementById("ncscontrol");
			if(usePPapi)
			{
				zoomCnt = zoomCnt/2;
				if(zoomCnt<1)
				{
					zoomCnt = 1;
					return;
				}
				player.postMessage(makeMessage('zoom', zoomCnt));
				return;
			}
			var localMulNum;
			localMulNum=player.GetZoomRatio();
			if(localMulNum>1)
			{
				localMulNum = localMulNum-1;
				player.SetZoomRatio(localMulNum);
			}
			ptOver(type);
			return;
		}
	}
	else
	{
		if(type != 'home')
		{
			var tilt = document.getElementById("tiltSpeed").value;
			var pan = document.getElementById("panSpeed").value;
			tilt *= y;	
			
			x = pan * x / g_zoom_lens; 
			y = tilt / g_zoom_lens;
			if(x <= 1 && x > 0)
				x = 1;
			if(y <= 1 && y > 0)
				y = 1;		
			hostname += "/cgi/ptdc.cgi?command=set_relative_pos&posX=" + x + "&posY=" + y + "&profile=" + nowprofile ;
		}
		else
			hostname += "/cgi/ptdc.cgi?command=go_home" + "&profile=" + nowprofile;
		ptOver(type);
		sendByAjax(hostname);
	}
}
var sendPatrol = function(type)
{
	var value;	
	if(type == "btnpan")
		value = "pan_patrol";
	else if(type == "btnPatrol")
		value = "user_patrol";
	else
		value = "stop" ;
	var ipAddress = getStandardIP();
	var hostname =  window.location.protocol  + "//" + ipAddress + ":" + window.location.port;
	var url = hostname +  '/cgi/ptdc.cgi?command=' + value + "&profile=" + nowprofile;
	sendByAjax(url);
}
function sendPTCommand(action)
{
	var data = "";
	switch(action)
	{
		case 'btnpan':	
			value = "pan_pan";
			break;
		case 'btnPatrol':	
			value = "user_patrol";
			break;
		case 'set_home':
			value = "set_home";
			break;
		case 'restore_home':
			value = 'restore_home';
			break;
		case 'goPreset':
			data = document.getElementById("presetName").value;
			if(data == 0)
				return 0;
			value = 'goto_preset_position&index=' + (data - 1);
			break;
		default:
			value = "stop"; 
			break;
	}
	var ipAddress = getStandardIP();
	var hostname =  window.location.protocol  + "//" + ipAddress + ":" + window.location.port;
	var url = hostname +  '/cgi/ptdc.cgi?command=' + value;	
	if(value=='restore_home'||value=='set_home')
		url = hostname +  '/cgi/ptdc.cgi?profile='+ nowprofile + "&command=" + value;
	if(action =='goPreset')
	{
		url = hostname +  '/cgi/ptdc.cgi?command=' + value + "&profile=" + nowprofile;
		url = encodeURI(url);
	}
	sendByAjax(url);		
}
var ptXMLDoc;
function sendByAjax(url)
{
	ptXMLDoc=null;
	new net.ContentLoader(url,ptReqCallback);
}
function sendPatrolRequest(command, hostname) {
	var urlXML = hostname + ":" + window.location.port + '/cgi/ptdc.cgi?command=' + command;
	var urlXSL = 'index.xsl';
	LoadXMLXSLTDocSendIndex(urlXML,urlXSL);
}
function ptReqCallback(){
	ptXMLDoc=this.req.responseXML;
}



