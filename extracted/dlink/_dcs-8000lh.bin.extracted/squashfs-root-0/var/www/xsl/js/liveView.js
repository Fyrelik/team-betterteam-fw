
var charTable = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

var p = new Array(); //profile1-4 info
var camData = new Array(); // the other data
var clientObj; // java or activeX
var btn; //control button
var StatusNow = new pageStatus(); //switch status
var initProfile, initAudio;
var pt; //pt object
var fflag = false; //fullscreen for non-IE

function pageStatus() //liveview status now, param: 0 1 no:not support
{
	this.audio = ["no" , "listenButton"];
	this.stream = ["no" , "streamoutButton"];
	this.ir = ["no" , "irButton"];
	this.led = ["no" , "ledButton"];
	this.gpOut = ["no" , "gpOutputButton"];
	this.gpIn = ["no" , "ledButton"];
	this.full = ["0","fullScreenButton"];
	this.record = ["0","recordButton"];//hind record!
	this.shot = ["0","snapshotButton"];
	this.path = ["0","pathButton"];
	//this.onlyP3 = ["1","profile3"]; //true, false
}
function initForm() //entry
{
	showProductregistration();
	getServerInfo(); //get p, camData from xml
	getPageStatus(); //get StatusNow from xml
	setLangOpt();
	if(usePPapi)
	{

		StatusNow['path'][0] = "no";
		if(StatusNow['stream'][0] == "0")
		{//set talk function by HTML5 API, only available on https
			StatusNow['stream'][0] = useHTTPS?"0":"no";
		}

		StatusNow['stream'][0] == "0"?showDOMById("talkwarn"):hideDOMById("talkwarn");
		hideDOMById("liveviewImg");
		showDOMById("nacl_status");
		processNP();

		clientObj = new NaCl("ncscontrol",initProfile, p,camData,true,StatusNow);
		var load_nacl=window.setInterval(function(){
			if(clientObj.load())
			{

				window.clearInterval(load_nacl); 
				load_nacl = null;

				try{
					initProfile = clientObj.init();
					clientObj.initZoom(zoomInOut);
				}
				catch(e){
					window.onerror = function(){	
						return true;
					}
				}

				window.setTimeout(function(){//wait a second for a stable env
					clientObj.run();

					btn = new btnControl();
					btn.init(initProfile);
					btn.showEnableBtn(clientObj,StatusNow);

					//check listen
					if(StatusNow["audio"][0] == 0 || StatusNow["audio"][0] == "no")
						audio = false;
					else
						audio = true;

					clientObj.setAudio(audio);
					flushIconStatus();
				}, 1000);
			}
		}, 100);
		return;
	}
	if(camData.isIE == "false")
	{
		//check NP
		processNP();
		//clientObj = new nonIE("mypluginobj3",initProfile, p,camData);
		clientObj = new PlugIn("ncscontrol",initProfile, p,camData,true,StatusNow);
		window.onresize = function(){
			if(fflag)
				clientObj.fullscreen();
		}
		// add to check java version;
		//clientObj.newSpaceForJre();
		//clientObj.eventfield.innerHTML = clientObj.embbedEventApplet(clientObj.camData.auth, clientObj.port);
		//setTimeout("checkJre()",6000);
	}
	else
		clientObj = new PlugIn("dcscontrol1",initProfile, p,camData,true,StatusNow);
		
	//clientObj.setAuthType(pageInfo);
		
	if(!typeof(privacy) || typeof(privacy) == 'boolean')
	{	
		try{
			clientObj.privacy();
		}catch(e){
			window.onerror = function(){return true;}
		}
		return;
	}
	if(camData.pt == "1" )
	{
		showPanPatrol = true; //PTControl.js
		pt = new ptControl("ptField","ptSpeedField");
		pt.init();
	}
	
	clientObj.setZoom(zoomInOut);
	try{
		initProfile = clientObj.init();
	}catch(e){
			window.onerror = function(){return true;}
		}
	clientObj.run();
	
	btn = new btnControl();
	btn.init(initProfile);
	btn.showEnableBtn(clientObj,StatusNow);
	
	//check listen
	if(StatusNow["audio"][0] == 0 || StatusNow["audio"][0] == "no")
		audio = false;
	else
		audio = true;

	clientObj.setAudio(audio);
	if(camData.isIE == "false")
		clientObj.StartNotification();
	flushIconStatus();
}
function flushIconStatus()
{
	var word = "" , inActive = false;
	for(var i in StatusNow)
	{
		try{
			
			if(StatusNow[i][0] == 0)
			{
				word = wording[i].off;
				inActive = false;
			}
			else
			{
				word = wording[i].on;
				inActive = true;
			}
			btn.clickOnOff(document.getElementById(StatusNow[i][1]), inActive);
			btn.setTitle(document.getElementById(StatusNow[i][1]), word);
		}
		catch(e)
		{
			//ignore	
		}
	}
}
function checkJre()
{
	var javanotify = document.getElementById("testApplet");
	try
	{
		if(document.getElementById("EventApplet").testInstalledJRE() != 1)	
		{
				
			javanotify.style.display = "";
			return false;
			}
	}
	catch(err)
	{
			
			javanotify.style.display = "";
			return false;
	}
		return true;
}

function setLangOpt()
{
	var lang = readCookie('language');
	if(lang != "null")
		document.getElementById('lang').value = lang;
	else
	{
		var temp = location.pathname.substr("1",location.pathname.lastIndexOf("/") -1);
		if(lang != temp)
			document.getElementById('lang').value = temp;		
	}
}


// control button interface
function iconDown(target)
{
	btn.downIcon(target);
}
function dragIcon(target)
{
	btn.dragIcon(target);
}
function pressImage(target)
{
	btn.downIcon(target);
}
// button interface
function setProfile(id,target) //type:init for initform()
{	
	nowprofile = id;
	btn.clickProfile(target);	
	clientObj.setProfile(id);
	clientObj.run();
	if((!usePPapi) && clientObj.isOnRecord)
		clientObj.recording(clientObj.isOnRecord);
	createCookie('profile', id , '365' );
}
function setPath(target)
{
	btn.oneClick(target);
	var sLocalPath = readCookie("savePath");
	sLocalPath = clientObj.setPath(sLocalPath);
	createCookie('savePath', sLocalPath, '365');
}
function savePath_java(pathstring){
	var path = pathstring;
	createCookie('savePath', path, '365');
}
function snapshot(target)
{
	btn.oneClick(target);
	clientObj.snapshot();
}
function fullScreen(target)
{
	btn.oneClick(target);
	clientObj.fullscreen();
	if(navigator.appVersion.indexOf("Mac") != -1)
		fflag = true;
}
function camAction(type,target)
{
	var enable, now, text,revertNow;
	if(StatusNow[type][0] == "0")
	{
		enable = true;
		now = "1";
		text = wording[type].on;
		revertNow = "0";
	}
	else{
		enable = false;
		now = "0";
		text = wording[type].off;
		revertNow = "1";
	}
	//alert(StatusNow[type][0] + "  " + type+ "  " +enable)
	btn.clickOnOff(target, enable);
	StatusNow[type][0] = now; 
	btn.setTitle(target, text);	
	switch(type)
	{
		case "record":
			clientObj.recording(enable);break;
		case "stream":
			clientObj.talk(enable);break;
		case "gpOut":
			clientObj.gpOut(now);break;
		case "ir":
			clientObj.ir(now);break;
		case "led":
			clientObj.led(now);break;
		case "audio":
			clientObj.setAudio(enable);
			createCookie( 'flagListen', now, '365' );	
			break;
		default:
			break;
	}
}

function setLangPage(value)
{
	createCookie( 'language', value, '365' );
	window.location = "/" + value + '/mainFrame.cgi?nav=Setup';
	return true;	
}
function closeForm()
{
	try
	{
		clientObj.closeClient();
	}
	catch(e)
	{
		//alert("error");
	}
}
// the other stuff

function readCookie(name)
{
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	var i = 0;
	while (true)
	{
			if (i  >= ca.length)
					break;
			var theChar = ca[i];
			while (theChar.charAt(0)==' ')
					theChar = theChar.substring(1,theChar.length);
			if (theChar.indexOf(nameEQ) == 0)
					return theChar.substring(nameEQ.length,theChar.length);
			i++;
	}
	return 'null';
}
function createCookie(name,value,days)
{
	if (days) 
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = '; expires='+date.toGMTString();
	}
	else 
		var expires = '';

	document.cookie = name+'='+value+expires+'; path=/';
}
//

function redirect(site)
{
	if(site == 'Live')
		location.href = "liveView.cgi?nav="+site;
	else
	{
		location.href = "mainFrame.cgi?nav="+site;
		closeForm();
	}
}
function goAdmin(nav, side)
{
	location.href = "mainFrame.cgi?nav="+nav+"&side="+side;
}

function showLocale(objD) 
{
	 var dn, str;
    var hh = objD.getHours();
    var mm = objD.getMinutes();
    var ss = objD.getSeconds();
	if(hh<10)
	{
		hh = '0' + hh;
	}
	if(mm<10) 
	{
		mm = '0' + mm;
	}
	if(ss<10) 
	{	
		ss = '0' + ss;
	}
    str = objD.getYear() + "." + (objD.getMonth() + 1) + "." + objD.getDate()+" | " +"&nbsp;";
	str += " " + hh + ":" + mm + ":" + ss + "|";
    return(str);
}

var gp_input1_counter = 0;
var gp_input2_counter = 0;

function checkGPInputAndSetImage(index, isOn)
{
	var iconSrc = "";
	var iconPath = "images/";
	iconSrc = document.gpInputIcon.src;

	if (isOn == 1)
	{
		if (index == 1)
			gp_input1_counter++;
		else if (index == 2)
			gp_input2_counter++;

		if (gp_input1_counter == 1 || gp_input2_counter == 1)
			iconSrc.src = iconPath+"digital_input_on.gif";
	}
	else
	{
		if (index == 1)
		{
			if (gp_input1_counter != 0)
				gp_input1_counter--;
		}
		else if (index == 2)
		{
			if (gp_input2_counter != 0)
				gp_input2_counter--;
		}

		if (gp_input1_counter == 0)
		{
			if (gp_input2_counter == 0)
				iconSrc.src = iconPath+"digital_input_off.gif";
		}
	}
}

function event_hadler(index, value) //2 param
{
	switch(index)
	{
		case 'sysinfo_changed':
			location.href = "liveView.cgi";
			break;
		case 'gp_input_0':
			if(value == "on" || value == "1")
				swapGPIN(1);
			else
				swapGPIN(0);
			break;
		case 'in_recording':
			if(value == "fail")
				document.recordIcon.src = "images/server_recorde_error.gif";
			break;
		case 'audio_detected':
			if(value == "1")
				swapImageAudio(1);
			else
				swapImageAudio(0);
			break;
		case 'irled':
			if(productoem == "Trendnet")
			{
				if(hasIR == "1")
				{
					if(value == "1")
					{
						document.getElementById("IRfilteron").style.display = "";
						document.getElementById("IRfilteroff").style.display = "none";
					}
					else
					{
						document.getElementById("IRfilteron").style.display = "none";
						document.getElementById("IRfilteroff").style.display = "";	
					}
				}
			}
			break;
		default:
		break;
	}
}
function OnFullScreenNotify(lResult)
{
	if (lResult == 0)//// recover full screen
    {	
		fflag = false;
		document.getElementById("fullScreen").style.display = "";
		document.getElementById("header").style.display = "";
		if(largeLiveVedio == false)
			document.getElementById("banner").style.display = "";
		document.getElementById("navBar").style.display = "";
		document.getElementById("sideBar").style.display = "";
		document.getElementById("title").style.display = "";
		document.getElementById("gHeader").style.display = "";
		document.getElementById("liveviewImg").style.display = "";
		document.getElementById("divZoom").style.display = "";
		document.getElementById("footbar").style.display = "";
		document.getElementById("gFooter").style.display = "";
		document.getElementById("copyright").style.display = "";
		document.getElementById("ncscontrol").width = p[clientObj.onPfile].width + "px";
		document.getElementById("ncscontrol").height = p[clientObj.onPfile].height + "px";
		document.getElementById("group").style.background = "";
		document.getElementById("main").style.background = "";
		document.getElementById("mainBlockFrame").style.background = "";
		document.getElementById("mainFrame").style.background = "";
		document.getElementById("contentBorder").style.background = "";
		document.getElementById("contentBlock").style.background = "";
		document.getElementById("mainpage").style.background = "";
		document.getElementById("group").style.border = "";
		document.getElementById("frameimage1").style.display = "";
		document.getElementById("frameimage2").style.display = "";
		document.getElementById("frameimage3").style.display = "";
		document.getElementById("frameimage4").style.display = "";
		document.body.style.background = "";
		document.getElementById("contentBlock").style.height = "";
		document.getElementById("contentBlock").style.width = "";
		document.getElementById("contentBlock").style.marginLeft = "";
		document.getElementById("contentBorder").style.width = "";
		document.getElementById("contentBorder").style.height = "";
		document.getElementById("mainpage").style.width = "";
		document.getElementById("mainpage").style.height = "";
		document.getElementById("main").style.minHeight = "";
		document.getElementById("group").style.height = "";
		document.getElementById("mainBlockFrame").style.marginLeft = "";
		document.getElementById("mainBlockFrame").style.width = "";;
		document.getElementById("ncscontrol").style.marginTop = "";
		document.getElementById("mainBlockFrame").style.minHeight = "";
		document.getElementById("contentBorder").style.marginLeft = "";
		document.getElementById("mainFrame").style.marginLeft = "";
	}
    else if (lResult == 1)//// set full screen
    {	
		fflag = true;
		var curProFlie = readCookie("profile");
		if(p[clientObj.onPfile].width > 800)
			largeLiveVedio = true;
		else
			largeLiveVedio = false;
		var a;
		var b;
		if(window.innerWidth > window.innerHeight && (window.innerWidth/window.innerHeight) > (p[clientObj.onPfile].width/p[clientObj.onPfile].height))
		{
			a = window.innerHeight / p[clientObj.onPfile].height;
			b =1;	
		}
		else
		{
			a = window.innerWidth / p[clientObj.onPfile].width;
			b = 0;
		}
		a -= 0.05;
		document.getElementById("fullScreen").style.display = "none";
		document.getElementById("header").style.display = "none";
		document.getElementById("banner").style.display = "none";
		document.getElementById("navBar").style.display = "none";
		document.getElementById("sideBar").style.display = "none";
		document.getElementById("title").style.display = "none";
		document.getElementById("gHeader").style.display = "none";
		document.getElementById("liveviewImg").style.display = "none";
		document.getElementById("divZoom").style.display = "none";
		document.getElementById("footbar").style.display = "none";
		document.getElementById("gFooter").style.display = "none";
		document.getElementById("copyright").style.display = "none";
		document.getElementById("ncscontrol").width = p[clientObj.onPfile].width * a + "px";
		document.getElementById("ncscontrol").height = p[clientObj.onPfile].height * a + "px";
		document.getElementById("frameimage1").style.display = "none";
		document.getElementById("frameimage2").style.display = "none";
		document.getElementById("frameimage3").style.display = "none";
		document.getElementById("frameimage4").style.display = "none";
		document.body.style.background = "#000000";
		document.getElementById("group").style.background = "#000000";
		document.getElementById("main").style.background = "#000000";
		document.getElementById("group").style.border = "0px solid #000000";
		document.getElementById("mainBlockFrame").style.background = "#000000";
		document.getElementById("mainFrame").style.background = "#000000";
		document.getElementById("contentBorder").style.background = "#000000";
		document.getElementById("mainFrame").style.background = "#000000";
		document.getElementById("contentBorder").style.background = "#000000";
		document.getElementById("contentBlock").style.background = "#000000";
		document.getElementById("mainpage").style.background = "#000000";
		if(productoem == "D-Link")
		{
			document.getElementById("contentBorder").style.width = 0 +"px";
			document.getElementById("contentBorder").style.height = 0 +"px";
		}
		document.getElementById("contentBorder").style.marginLeft = 0 + "px";
		document.getElementById("contentBlock").style.marginLeft = 0 + "px";
		document.getElementById("mainFrame").style.marginLeft = 0 + "px";
		if(b==1)
		{
			document.getElementById("mainpage").style.width = document.getElementById("ncscontrol").width;
			document.getElementById("mainpage").style.height = document.getElementById("ncscontrol").height;
			document.getElementById("main").style.minHeight = document.getElementById("ncscontrol").height;
			document.getElementById("group").style.height = document.getElementById("ncscontrol").height;
			var c = window.innerWidth - document.getElementById("mainBlockFrame").offsetWidth;
			document.getElementById("mainBlockFrame").style.marginLeft = c/2 + "px";
			document.getElementById("mainBlockFrame").style.minHeight = document.getElementById("ncscontrol").height;
		}
		else
		{
			document.getElementById("mainBlockFrame").style.width = document.getElementById("ncscontrol").width;
			var c = window.innerHeight - document.getElementById("ncscontrol").offsetHeight;
			document.getElementById("ncscontrol").style.marginTop = c/2 + "px";
			document.getElementById("contentBlock").style.width = document.getElementById("ncscontrol").width;
		}
	}
}
function OnNotifyInRecording(lParam)
{
	swapImageNotifyRecord(lParam);
}
function OnNotifyMotionDetection(lFlag, lParam)
{
	swapImageMotion(lParam);
}
function OnNotifyGPInput(lFlag, lParam)
{
	checkGPInputAndSetImage(lFlag,lParam);
}
function OnNotify(szTag, szValue)
{
	if(szTag == 'audio_detected')
	{
		if(szValue == "1")
			swapImageAudio(1);
		else
			swapImageAudio(0);
	}
	
	if(szTag == 'sysinfo_changed')
		location.href = "liveView.cgi";
	
	if(szTag == 'gp_input_0')
	{
		if(szValue == "1")
			swapGPIN(1);
		else
			swapGPIN(0);
	}
	if (szTag == 'irled')
	{
		if(productoem == "Trendnet")
		{
			if(hasIR == "1")
			{
				if(szValue == "1")
				{
					document.getElementById("IRfilteron").style.display = "";
					document.getElementById("IRfilteroff").style.display = "none";
				}
				else
				{
					document.getElementById("IRfilteron").style.display = "none";
					document.getElementById("IRfilteroff").style.display = "";	
				}
			}
		}
	}
}
function toregister(auth,registerMessage)
{
	//var authdecode = base64decode(auth);//auth=YWRtaW46YWRtaW4=
	//var getauth = authdecode.split(":"); 
	//var username = getauth[0];
	
	if(auth == "administrators")
	{
		var url = "http://www.trendnet.com/register";
		window.open(url,"newwindow");
	}
	else
		alert(registerMessage);
		
}
function showProductregistration()
{
	if(extraModules.indexOf('device1_2') == -1)//no cloud  //device1_2
	{
		//$("#pcloud").hide();
		$("#ProductRegistration1").hide();
		//$("#productbar").hide();
		$("#mode").hide();
	}
	/*else
	{
		$("#product").hide();
	}*/
}

function base64decode(str) 
{
	var c1, c2, c3, c4;
		var i, len, out;
	
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
		 	/* c1 */
		 	do {
			 c1 = charTable[str.charCodeAt(i++) & 0xff];
		 } while(i < len && c1 == -1);
		 if(c1 == -1)
			 break;
		
		 /* c2 */
		 do {
			 c2 = charTable[str.charCodeAt(i++) & 0xff];
		 } while(i < len && c2 == -1);
		 if(c2 == -1)
			 break;
		
		 out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
		
		 /* c3 */
		 do {
			 c3 = str.charCodeAt(i++) & 0xff;
			 if(c3 == 61)
		  return out;
			 c3 = charTable[c3];
		 } while(i < len && c3 == -1);
		 if(c3 == -1)
			 break;
		
		 out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
		
		 /* c4 */
		 do {
			 c4 = str.charCodeAt(i++) & 0xff;
			 if(c4 == 61)
		  return out;
			 c4 = charTable[c4];
		 } while(i < len && c4 == -1);
		 if(c4 == -1)
			 break;
		 out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
			return out;
}
