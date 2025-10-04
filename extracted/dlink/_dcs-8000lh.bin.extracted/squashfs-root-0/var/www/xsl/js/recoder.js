function disableAll(disabled)
{
	disableControler('recHide',1,10,'input',disabled);
	disableControler('event',0,7,'input',disabled);
	disableControler('option',1,5,'input',disabled);
	disableControler('samba',0,8,'input',disabled);
	disableControler('samba',1,1,'select',disabled);
	disableControler('option',1,1,'select',disabled);
	disableControler('sdCard',0,1,'input',disabled);
}

function checkNameLimit(id,errorMsg,errorMsg1)
{
	data = document.getElementById(id);
	if(data.value == "")
	{
		alertAndSelect(id,errorMsg);
		return false;
	}
	var result;
	for (var i=0; i<data.value.length; i++)
	{
		result = data.value.charCodeAt(i); 
		if (result < 33 ||result > 126 || result == 34 || result == 39 || result == 47 || (result < 65 && result > 58) || (result < 94 && result > 90) || result == 43 || result == 44  || result == 42  || result == 124){
			alert(errorMsg1 + "/ \\ \" \' [ ] = | < > + = ; , ? * @");
			data.select();
			return false;
		}
	}
}
function checkPasswordLimit(id,errorMsg)
{
	data = document.getElementById(id);
	var result; 
	for (var i=0; i<data.value.length; i++)
	{
		result = data.value.charCodeAt(i); 
		if (result < 33 ||result > 126 || result == 34 || result == 38 || result == 39 || result == 60 || result == 62 ){
			alert(errorMsg+"& < > \' \"");
			data.select();
			return false;
		}
	}
}
function checkShareFolder(id,shareFolderError)
{
	var data = document.getElementById(id);
	if(data.value == "")
	{
		alertAndSelect(id,shareFolderError);
		return false;
	}
	var result;
	for (var i=0; i<data.value.length; i++)
	{
		result = data.value.charCodeAt(i); 
		if (result < 45 || result > 122 || (result > 57 && result < 65) || (result > 90 && result < 95) || result == 46 || result == 96){
			alert(shareFolderError)
			data.select();
			return false;
		}
	}
}
function sendSambaTest(usernameError,passwordError,confimError,testmsg)
{
	if(checkServer("server",serverError)==false)
		return false;
	if(checkShareFolder("shareFolder",shareFolderError)==false)
		return false;
	
	if(document.form1.anonymous[0].selected)
	{
		if(document.form1.user.value == "")
		{
			alertAndSelect('user',usernameError);
			return false;
		}
		if(document.form1.password.value == "")
		{
			alertAndSelect('password',passwordError);
			return false;
		}
		if(document.form1.password.value != document.form1.passwordConfim.value)
		{
			alertAndSelect('passwordConfim',confimError);
			return false;
		}
		
		var urlXMLSamba = document.form1.hostname.value + ":" + window.location.port + "/cgi/admin/recorder_test.cgi?server=" + document.form1.server.value + "&shareFolder=" + document.form1.shareFolder.value + "&anonymous=" + document.form1.anonymous.value + "&user=" + document.form1.user.value + "&password=" + document.form1.password.value;
	}
	else
		var urlXMLSamba = document.form1.hostname.value + ":" + window.location.port + "/cgi/admin/recorder_test.cgi?server=" + document.form1.server.value + "&shareFolder=" + document.form1.shareFolder.value + "&anonymous=" + document.form1.anonymous.value;
	
	document.getElementById("sambaStatusResult").innerHTML = testmsg;

	disableButton(1);
	var urlXSLSamba = 'adv_recording.xsl';
	
	LoadXMLXSLTDocSambaTest(urlXMLSamba,urlXSLSamba);
}
function disableButton(index)
{
	if(document.form1.recordCheckBox.checked)
	{
		if (index == 1)
		{
			disableFlag = 1;
			document.form1.sambaTest.disabled=true;
			document.form1.sambaStatusButton.disabled=true;
			document.form1.sdCardStatusButton.disabled=true;
		}
		else
		{
			if(document.form1.storage[1].checked)
			{
				document.form1.sambaTest.disabled=false;
				document.form1.sambaStatusButton.disabled=false;
				document.form1.sdCardStatusButton.disabled=true;
			}
			else
			{
				document.form1.sambaTest.disabled=true;
				document.form1.sambaStatusButton.disabled=true;
				document.form1.sdCardStatusButton.disabled=false;
			}
		}
	}
}
function SDCardStatusTest()
{
	var urlXML = document.form1.hostname.value + ":" + window.location.port + "/cgi/admin/recorder_status.cgi"+"?device=usb";
	var urlXSL = 'adv_recording.xsl';

	statusFlag = 2;
	document.getElementById("sdCardStatus").innerHTML = Testing;
	disableButton(1);
	LoadXMLXSLTDoc(urlXML,urlXSL);
}
function sambaStatusTest()
{
	var urlXML = document.form1.hostname.value + ":" + window.location.port + "/cgi/admin/recorder_status.cgi";
	var urlXSL = 'adv_recording.xsl';

	statusFlag = 1;
	document.getElementById("sambaStatus").innerHTML = Testing;
	disableButton(1);
	LoadXMLXSLTDoc(urlXML,urlXSL);
}
function SDCardStatusTest()
{
	var urlXML = document.form1.hostname.value + ":" + window.location.port + "/cgi/admin/recorder_status.cgi"+"?device=usb";
	var urlXSL = 'adv_recording.xsl';

	statusFlag = 2;
	document.getElementById("sdCardStatus").innerHTML = Testing;
	disableButton(1);
	LoadXMLXSLTDoc(urlXML,urlXSL);
}
function RecordingStatusMsg(ID,status)
{
	document.getElementById(ID).innerHTML = status;
}
function sendStatus()
{
	var urlXML = document.form1.hostname.value + ":" + window.location.port + "/cgi/admin/recorder_status.cgi";
	var urlXSL = 'adv_recording.xsl';
	statusFlag = 0;
	LoadXMLXSLTDoc(urlXML,urlXSL);
}

//sending data
var xmlDoc;
var xslDoc;
function LoadXMLXSLTDoc(urlXML,urlXSL)
{
	xmlDoc=null;
	xslDoc=null;
	new net.ContentLoader(urlXML,onXMLLoad);
}

function onXMLLoad()
{
	xmlDoc=this.req.responseXML;
	doXSLT();
}

function onXSLLoad()
{
	xslDoc=this.req.responseXML;
	doXSLT();
}

//Samba Test
var xmlDocSambaTest;
var xslDocSambaTest;
function doXSLTSambaTest()
{
	if (xmlDocSambaTest==null)
	return false;
	var status =  xmlDocSambaTest.getElementsByTagName('code')[0].firstChild.nodeValue;
	document.getElementById("sambaStatusResult").innerHTML = status;	
	disableButton(0);
	disableFlag = 0;
}
function LoadXMLXSLTDocSambaTest(urlXMLSambaTest,urlXSLSambaTest)
{
	xmlDocSambaTest=null;
	xslDocSambaTest=null;
	new net.ContentLoader(urlXMLSambaTest,onXMLLoadSambaTest);
}

function onXMLLoadSambaTest(){
	xmlDocSambaTest=this.req.responseXML;
	doXSLTSambaTest();
}

function onXSLLoadSambaTest()
{
	xslDocSambaTest=this.req.responseXML;
	doXSLTSambaTest();
}
function doXSLT()
{
	if (xmlDoc==null)
		return false; 
	
	if(statusFlag == 1)
		RecordingStatusMsg("sambaStatus",xmlDoc.getElementsByTagName('toSamba')[0].firstChild.nodeValue);
	else if(statusFlag == 2)
		RecordingStatusMsg("sdCardStatus",xmlDoc.getElementsByTagName('usb')[0].firstChild.nodeValue);
	else 
	{
		RecordingStatusMsg("sambaStatus",xmlDoc.getElementsByTagName('toSamba')[0].firstChild.nodeValue);
		RecordingStatusMsg("sdCardStatus",xmlDoc.getElementsByTagName('usb')[0].firstChild.nodeValue);
	}

	disableButton(0);
	disableFlag = 0;
}


function begin_count()
{
	timeoutID = window.setInterval("ShowRealTime()", 1000)
}
function ShowRealTime()
{
	if(count==-1)
	{
		count = 6;
		sendStatus();
		window.clearInterval(timeoutID);
		begin_count();
	}
	if(count==0)
	{
		if (document.getElementById("sambaStatus").innerHTML == "Initializing")
		{
			count = 6;
			sendStatus();
			window.clearInterval(timeoutID);
			begin_count();
		}
		else if (document.getElementById("sdCardStatus").innerHTML == "Initializing")
		{
			count = 6;
			sendStatus();
			window.clearInterval(timeoutID);
			begin_count();
		}
		else
			window.clearTimeout(timeoutID);
	}
	count--;
}


