var mode,factory;
var xmlDoc;
var ssid = new Array();
var bssid = new Array();
var signal = new Array();
var type = new Array();
var channel = new Array();
var encrypt = new Array();
var auth = new Array();
var defaultSecurity;

function setChannelOpt(region)
{
	switch(region)
	{
		case '0':
			AddOptionByNumber('channel',1,11,1,1);
		break;
		case '1':
			AddOptionByNumber('channel',1,13,1,1);
		break;
		case '2':
			AddOptionByNumber('channel',10,11,1,1);
		break;
		case '3':
			AddOptionByNumber('channel',10,13,1,1);
		break;
		case '4':
			AddOptionByNumber('channel',14,14,1,1);
		break;
		case '5':
			AddOptionByNumber('channel',1,14,1,1);
		break;
		case '6':
			AddOptionByNumber('channel',3,9,1,1);
		break;
		case '7':
			AddOptionByNumber('channel',5,13,1,1);
		break;
	}
}
function setEnc_Security(auth,encrypt)
{
	var encryption;
	var security;
	
	var objSec = document.getElementById("optSecurity");
	//var objEnc = document.getElementById("optEncryption"); //option has setted by ui tools
	var Enc = document.getElementById("encryption"); // set default value
	switch(auth)
	{
		case 'OPEN':
			$("#keyGroup").hide(500, function(){resize();});
			$("#wepGroup").hide(500, function(){resize();});
			if(encrypt == 'NONE')
			{
				objSec.value = 0;
				Enc.value = 0;
			}
			else if(encrypt == 'WEP')
			{
				$("#keyGroup").show(500, function(){resize();});
				$("#wepGroup").show(500, function(){resize();});
				objSec.value = 6;
				Enc.value = 1;
			}
			$("#encGroup").hide(500, function(){resize();});
			break;
		case 'SHARE':
			$("#keyGroup").hide(500, function(){resize();});
			objSec.value = 6;
			Enc.value = 1;
			$("#encGroup").hide(500, function(){
				resize();								  
			});
			break;
		case 'WEP':
		case 'WEBAUTO':	
			$("#keyGroup").show(500, function(){resize();});
			objSec.value = 6;
			Enc.value = 3;
			$("#wepGroup").show(500, function(){
				resize();								  
			});
			$("#encGroup").hide(500, function(){
				resize();								  
			});
			break;
		case 'WPA-PSK':
			$("#keyGroup").show(500, function(){resize();});
			$("#wepGroup").hide(500, function(){resize();});
			if (document.form1.mode.value != 1) // not Ad-Hoc
				objSec.value = 2;
			if(encrypt == 'TKIP')
				Enc.value = 2;
			else if(encrypt == 'AES')
				Enc.value = 3;
			if (document.form1.mode.value != 1) // not Ad-Hoc
				$("#encGroup").show(500, function(){resize();});
			break;
		case 'WPA2-PSK':
			$("#keyGroup").show(500, function(){resize();});
			$("#wepGroup").hide(500, function(){resize();});
			if (document.form1.mode.value != 1) // not Ad-Hoc
				objSec.value = 5;
			if(encrypt == 'TKIP')
				Enc.value = 2;
			else if(encrypt == 'AES')
				Enc.value = 3;
			if (document.form1.mode.value != 1) // not Ad-Hoc
				$("#encGroup").show(500, function(){resize();});
			break;
		default:
			$("#keyGroup").hide(500, function(){resize();});
			break;
	}

}
function changeMode(obj)
{	var temp = ""; 
	for( var i in mode)
	{
		if(mode[i].value == obj.value)
		{	
			setDropListByTwoObj('optSecurity',mode[i].security);
			temp = i;
			mode[i].action();
			break;
		}
	}
	var listSSID = document.form1.listSSID.value;
	setEnc_Security(auth[listSSID],encrypt[listSSID]);
	return;

}

function sendWireless(key)
{
	var urlXML =  window.location.href + "?wireless=" + key;
	xmlDoc = null;
	new net.ContentLoader(urlXML,showMessge);

} 
function showMessge()
{
	xmlDoc = this.req.responseXML;
	if (xmlDoc==null)
		return false;
	showResult(xmlDoc.getElementsByTagName('code')[0].firstChild.nodeValue, xmlDoc.getElementsByTagName('countdown')[0].firstChild.nodeValue);
	
}
function showResult(result, sec)
{
	$('.statusMessage').show();
	document.getElementById("messageTitle").style.cssText = "display:block;";
	$("#fail").hide();$("#notChanged").hide();$("#ok").hide();$("#fail").hide();
	switch(result)
	{
		case 'invalidHttpPort':
		case 'invalidRTPPort':
		case 'invalidtype': 
		case 'invalidpolicy': 
		case 'invalidMode': 
		case 'invalidChannel': 
		case 'invalidTXRate': 
			$("#fail").show();
		break;
		case 'notChanged':
			$("#notChanged").show();
		break;
		case 'ok':
			$("#ok").show();
			$(".gText input").attr( "disabled"  , "disabled" );
			var IP_ADDR = window.location.hostname;
			if(eth0Ipv4Address == IP_ADDR)//current eth0 ipv4 == current url ip, start old process, auto reconnect.
			{
				$("#manreconnectmessage").hide();
				$("#countdownmessage").show();//show countdownmessage message
				needCountDown('ap_client.cgi',sec, "leavetime", false);
			}
			else//start new porcess, only show result, and user manual reconnect.
			{
				$("#countdownmessage").hide();
				$("#manreconnectmessage").show();//show man reconnect
			}
		break;
		default:
			$("#fail").show();
		break;
	}
	resize();
}

function siteSurvay()
{
	$("#loding").show();
	var urlXML = "siteSurvey.cgi";
	var urlXSL = 'adv_wireless.xsl';
	xmlDoc=null;
	new net.ContentLoader(urlXML,wirelessDoXSLT);
}
function wirelessDoXSLT()
{
	xmlDoc=this.req.responseXML;
	if (xmlDoc==null)
		return false; 

	var listNumber = xmlDoc.getElementsByTagName('totalCount')[0].firstChild.nodeValue

	for (var i=1;;i++)
	{
		if(listNumber == 0)
			break;
		ssid[i] = xmlDoc.getElementsByTagName('ssid')[i-1].firstChild.nodeValue;
		bssid[i] = xmlDoc.getElementsByTagName('bssid')[i-1].firstChild.nodeValue;
		signal[i] = xmlDoc.getElementsByTagName('signal')[i-1].firstChild.nodeValue;
		type[i] = xmlDoc.getElementsByTagName('type')[i-1].firstChild.nodeValue;
		channel[i] = xmlDoc.getElementsByTagName('channel')[i-1].firstChild.nodeValue;
		encrypt[i] = xmlDoc.getElementsByTagName('encrypt')[i-1].firstChild.nodeValue;
		auth[i] = xmlDoc.getElementsByTagName('auth')[i-1].firstChild.nodeValue;
		if(i == listNumber)
			break;	
	}
	
	var chooser = document.form1.listSSID;
	var ssidDB = new Object();
    var newElem;

    var where = (navigator.appName == "Microsoft Internet Explorer") ? -1 : null;
    var cityChooser = chooser.form.elements["listSSID"];
    while (cityChooser.options.length)
        cityChooser.remove(0);
		
	for (var i = 0;; i++)
	{
		newElem = document.createElement("option");
		if(i==0)
			newElem.text = ssidname;
		else{
			if(navigator.userAgent.indexOf("Firefox")>0 || isIE9() || navigator.userAgent.indexOf("Chrome")>0 || navigator.userAgent.indexOf("Safari")>0) {
				var ssidstr = "";
				for (var j = 0; j < ssid[i].length; j++) {
					if (ssid[i].charAt(j) == ' ')
						ssidstr += "&nbsp;";
					else
						ssidstr += ssid[i].charAt(j);
				}
				newElem.innerHTML = ssidstr;//ssid[i];
			} 
			else 
				newElem.text = ssid[i];
		}
		
		newElem.value = i;
		cityChooser.add(newElem, where);
		if(i == listNumber)
			break;
	}

	$("#loding").hide();
}
function changeSSID()
{
	var i = document.form1.listSSID.value;
	var security;
	var encryption;
	
	if(!ssid[i])
		return;
	document.form1.ssid.value = ssid[i];
	document.form1.key.value="";
	document.form1.channel.value = channel[i];
	if (encrypt[i]=="NONE")  
			encrypt[i] = "TKIP";
	$("#optEncryption").val(encrypt[i]);

	if(type[i] == "Infra")
			document.form1.mode.value = 0;
		else
			document.form1.mode.value = 1;
		
	changeMode(document.getElementById("mode"));

}

function send_request()
{
	//if(isEnable != 'off') //won't need check
		if(!document.form1.wirelessBox.checked)
		{
			sendWireless('off');
			return;	
		}
		
		factory.setupCheckbox();
		if(document.form1.wirelessBox.checked)	
		{
			var ssid = document.getElementById("ssid").value;
			var objEnc = document.getElementById("encryption");
			var encrypt = $("#optEncryption").val();
			if (ssid == "")
			{
				alert(ssidError);
				document.form1.ssid.select();
				return false;
			}
			if(trimSSID(ssid) == "")
			{
				alert(ssidError1);
				document.form1.ssid.select();
				return false;
			}
			//alert($('select#optSecurity option:selected').text());
			if($('select#optSecurity option:selected').text().indexOf("WPA") != -1)
			{
				if(checkpresharedkey(keyError3,keyError4,keyError5,keyError6) == false)
					return false;
				if(encrypt == 'TKIP')
					objEnc.value = 2;
				else if(encrypt == 'AES')
					objEnc.value = 3;
			}
			else if($('select#optSecurity option:selected').text().indexOf("WEP") != -1)
			{
				
				if(checkwepkey(keyError1,keyError2) == false)
					return false;
				objEnc.value = 1; //WEP	
			}
			else if($('select#optSecurity option:selected').text().indexOf("None") != -1)
			{
				objEnc.value = 0;
			}
			document.form1.security.value = document.form1.optSecurity.value;
			document.form1.wepKeyIndex.value = document.form1.optwepKeyIndex.value;
		}
		//alert(document.form1.security.value + "  " + document.getElementById("encryption").value);
		var checkProduct = new RegExp("^D-Link");
		if(checkProduct.test(oem)==true)
		{
			var ssidSelected = $('#listSSID option:selected').val();

			if(ssidSelected == 0)
			{
				document.form1.channel.value = 0;
			}
			
			var ssidSelectedValue = $("#listSSID").find("option:selected").text();
			if((ssidSelected != 0)&&(ssidSelectedValue != document.form1.ssid.value))
			{
				document.form1.channel.value = 0;
			}
		}
		send_submit("form1");

			
	

}
function checkwepkey(keyError1,keyError2)
{
	var key = document.getElementById("key").value;
	
	if(key.length!=5 && key.length!=10 && key.length!=13 && key.length!=26)
	{
		alertAndSelect("key",keyError1);
		return false;
	}
	if(key.length==10 || key.length==26)
	{
		for (var j = 0; j < key.length; j++)
		{
			if (!check_hex(key.substring(j, j+1)))
			{
				alertAndSelect("key",keyError2);
				return false;
			}
		}
	}

	return true;
}
function checkpresharedkey(keyError3,keyError4,keyError5,keyError6)
{
	var presharedkey = document.getElementById("key").value;
		
	if (presharedkey == "")
	{
		alertAndSelect("key",keyError3);
		return false;
	}

	if(presharedkey.length<8)
	{
		alertAndSelect("key",keyError4);
		return false;
	}
    	if(presharedkey.length>64)
	{
		alertAndSelect("key",keyError6);
		return false;
	}
	if(presharedkey.length==64)
	{
		for (var j = 0; j < presharedkey.length; j++)
		{
			if (!check_hex(presharedkey.substring(j, j+1)))
			{
				alertAndSelect("key",keyError5);
				return false;
			}
		}
	}
			
	return true;
}
function check_hex(data)
{	
	data = data.toUpperCase();
	if (!(data >= 'A' && data <= 'F') && !(data >= '0' && data <= '9'))
		return false;	
	return true;
}
var temp;
function show()
{
	var obj = document.getElementById("key");
	var newO=document.createElement('input');
	//temp = obj.value;
	if(document.getElementById("showpw").checked)
	{
		newO.setAttribute('type','text');
		if(obj.value == "*a!_-/6^P$")
		{
			temp = "*a!_-/6^P$";
			newO.setAttribute('value', "");
		}
		else
		{
			temp = obj.value;
			newO.setAttribute('value',obj.value);
		}
	}
	else
	{
		newO.setAttribute('type','password');
		if(obj.value == "" && temp == "*a!_-/6^P$")
			newO.setAttribute('value',"*a!_-/6^P$");
		else
			newO.setAttribute('value',obj.value);
	}
	newO.setAttribute('size',obj.getAttribute('size')); 	
	newO.setAttribute('name',obj.getAttribute('name'));
	//newO.setAttribute('value',obj.value);
	newO.setAttribute('id',obj.getAttribute('id'));
	obj.parentNode.replaceChild(newO,obj);
	newO.focus();	
}

function clearPassword()
{
	document.form1.key.value="";
}
function trimSSID(data)
{
	return data.replace(/^\s+|\s+$/g, "");	
}

function checkAP_WEP_Key(error)
{
	var key = document.getElementById("sharePwd").value;
	
	if(key.length!=5 && key.length!=13)
	{
		alertAndSelect("sharePwd",error);
		return false;
	}
	
	return true;
}

function checkAP_WPA_Key(keyError3,keyError4,keyError5,keyError6)
{
	var key = document.getElementById("sharePwd").value;
		
	if(key == "")
	{
		alertAndSelect("sharePwd",keyError3);
		return false;
	}

	if(key.length<8)
	{
		alertAndSelect("sharePwd",keyError4);
		return false;
	}
    
	if(key.length>64)
	{
		alertAndSelect("sharePwd",keyError6);
		return false;
	}
	
	if(key.length==64)
	{
		for(var j = 0; j < key.length; j++)
		{
			if (!check_hex(key.substring(j, j+1)))
			{
				alertAndSelect("sharePwd",keyError5);
				return false;
			}
		}
	}
			
	return true;
}
function checkAP()
{
	var apSSID = document.getElementById("apSSID").value;
	if (apSSID == ""){
		alert(apSSIDError);
		document.form1.apSSID.select();
		return false;
	}
	if(trimSSID(apSSID) == ""){
		alert(apSSIDError1);
		document.form1.apSSID.select();
		return false;
	}
	if($('select#optApAuthMode option:selected').text().indexOf("WPA") != -1){
		if(checkAPPasswd(apPassWDErr1,apPassWDErr2,apPassWDErr3,apPassWDErr4) == false)
			return false;
	}
	return true;
}
function checkAPPasswd(keyError1,keyError2,keyError3,keyError4)
{
	var presharedkey = document.getElementById("apPW").value;
		
	if (presharedkey == "")
	{
		alertAndSelect("apPW",keyError1);
		return false;
	}

	if(presharedkey.length<8)
	{
		alertAndSelect("apPW",keyError2);
		return false;
	}
    	if(presharedkey.length>64)
	{
		alertAndSelect("apPW",keyError4);
		return false;
	}
	if(presharedkey.length==64)
	{
		for (var j = 0; j < presharedkey.length; j++)
		{
			if (!check_hex(presharedkey.substring(j, j+1)))
			{
				alertAndSelect("apPW",keyError3);
				return false;
			}
		}
	}
			
	return true;
}
