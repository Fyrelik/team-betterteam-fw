function checkDeviceName(id,errorCode1,errorCode2,errorCode3){
	data = document.getElementById(id);
	var result;
	var i=0 ;
	if(data.value == "")
	{
		alert(errorCode1);
		return false;
	}	
	for (i=0; i<data.value.length; i++){
		result = data.value.charCodeAt(i); 
			if (result == 47 || result == 92 || result == 58 || result == 42 || result == 63 || result == 34 || result == 62  || result == 124 || result == 60){
				alert(errorCode3);
				data.select();
				return false;
			}
			if (result == 32){//check for the blank
				alert(errorCode2);
				data.select();
				return false;
			}
			if((result < 48 || result > 57)&&(result < 97 || result > 122)&&(result < 65 || result > 90)&&(result != 45)){
				//alert(errorCode3 + "! @ # $ % ^ & * ( ) { } [] - + ");
				alert(errorCode3);
				data.select();
				return false;
			}
	}
}

function checkAddUser(userNameError1,errorCode1,errorCode2)
{
	var userName = document.form2.user;
	if (userName.value == "")
	{
		alert(userNameError1);
		userName.select();
		return false;
	}

	var result;
	for (var i=0; i<userName.value.length; i++){
		result = userName.value.charCodeAt(i); 
		if (result < 45 || result > 122 || (result > 57 && result < 65) || (result > 90 && result < 95) || result == 47 || result == 96 ){
			alert(errorCode1);
			userName.select();
			return false;
		}
	}
	
	if(checkName('password2',errorCode2) == false)
		return false;
}
function checkAddUsername(userlist,index,newadd,errCode1,errCode2)
{
	if(newadd == adminUserName)
	{
		alert(errCode2);
		return false;
	}
	for(var i=0;i<index;i++)
	{
		if(newadd == userlist[i]){
			alert(errCode1);
			return false;
		}
		
	}
	document.form2.user.select();
}
function checkAdminUser(userNameError1,errorCode1,errorCode2,userlist,index,newadd)
{
	var userName = document.form1.newAdmin;
	if (userName.value == "")
	{
		alert(userNameError1);
		userName.select();
		return false;
	}

	var result;
	for (var i=0; i<userName.value.length; i++){
		result = userName.value.charCodeAt(i); 
		if (result < 45 || result > 122 || (result > 57 && result < 65) || (result > 90 && result < 95) || result == 47 || result == 96 ){
			alert(errorCode1);
			userName.select();
			return false;
		}
	}
	
	for(var i=0;i<index;i++)
	{
		if(newadd == userlist[i]){
			alert(errorCode2);
			return false;
		}
	}
	//if(checkName('password2',errorCode2) == false)
		//return false;
	
}
function compareNum(num1,num2)
{	
	if (num1 == num2)
		return 0;
	else if (num1 > num2)
		return 1;
	else
		return -1;		
}
function sendCalibration(){	
	var hostname =  window.location.protocol  + "//" + window.location.hostname +  ":" + window.location.port;
	var urlXML = "tools_admin.cgi?action=calibration";
	var urlXSL = 'calibration.xsl';
	LoadXMLXSLTDoc(urlXML,urlXSL);
}
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
	document.getElementById("messageTitle").style.cssText = "display:block;";
	$('.statusMessage').show();
	$("#calibrationMsg").show(0,function(){
			resize();						   
	});
	
}
