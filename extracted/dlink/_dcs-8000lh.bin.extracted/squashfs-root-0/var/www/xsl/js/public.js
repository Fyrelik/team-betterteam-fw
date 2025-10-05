//
function commonFactory(infoData)
{
	//constructor
	for(var i in infoData.radio)
	{
		var obj = document.getElementById(i);
		if(obj == null)
			continue;
		if(infoData.radio[i][0] == 1)
			obj.checked = true;
		obj.onclick = radioCheck ;
		obj.group = infoData.radio[i][1];
		obj.id = i;
		obj.data = infoData.radio;
		radioCheck(i,infoData.radio[i][1],infoData.radio );
	}
	for(var i in infoData.checkbox)
	{
		var obj = document.getElementById(i);
		if(obj == null)
			continue;
		
		obj.onclick = checkboxcheck;
		
		obj.id = i;
		obj.group = infoData.checkbox[i][1];
		if(infoData.checkbox[i][0] == "1")
		{
			obj.checked = true;
			
		}	
		checkboxcheck(i,infoData.checkbox[i][1]);

	}
	for(var i in infoData.ddl)
	{
		var obj = document.getElementById(i);
		if(obj == null)
			continue;
		obj.value = infoData.ddl[i][0];
		
	}
	for(var i in infoData.checkboxTypeddl)
	{
		if(i.indexOf("init") > 0)
			continue;
		var obj = document.getElementById(i);
		if(obj == null)
			continue;
		var IsSelected=false;
		var target = infoData.checkboxTypeddl[i];
		var selected = infoData.checkboxTypeddl[i+"init"];
		$("#"+ i).empty();
		for(var j in target)
		{
			if(selected != j)
				$("#"+ i).append($("<option value='" + j + "'>" + target[j][0] + "</option>"));
			else
				$("#"+ i).append($("<option value='" + j + "' selected='selected'>" + target[j][0] + "</option>"));	
		}
		if(navigator.userAgent.indexOf('Trident') != -1)
		{
			if(obj!=null && selected != null)
			{
				for(k=0;k<obj.options.length;k++)
				{
					if(obj.options[k].value==selected)
						obj.options[k].selected="selected";
				} 	
				
			}
		}
		$("#" + i).change(checkboxTypecheck);
		//obj.onchange = checkboxTypecheck;
		obj.info = target;
		obj.id = i;
		checkboxTypecheck(i,target,selected);
	}
	//***
	
	this.countDown = 60; 
	this.infoData = infoData;
	
	//for send_request
	this.setupCheckbox = function()
	{
		var tar;
		for(var i in infoData.checkbox)
		{
			tar = document.getElementById(i);
			if(!tar)
				return;
			if(!document.getElementById(infoData.checkbox[i][2]))
				continue;
			if(tar.checked)
				document.getElementById(infoData.checkbox[i][2]).value = '1';
			else
				document.getElementById(infoData.checkbox[i][2]).value = '0';
		}
	
	}
	
	this.getUrl = function(protocol,port,ip,url,mainParm,side)
	{
		var lang = "eng";
		/*var lang = readCookie('language');
		if (lang != "eng")
		{
			if( lang != "cht")
			{
				if( navigator.userLanguage == "zh-tw" || navigator.language =="zh-TW" || navigator.language =="zh-tw")
					lang = "cht";
				else
					lang = "eng";
			}
		}*/
		var start = location.href.indexOf(location.host) + location.host.length + 1;
		var end = location.href.indexOf("/admin/");
		var lang = location.href.substring(start, end);
		var url =  protocol+"://" + ip + ":" + port + "/" + lang + "/"+url + "?" + "nav=" + mainParm;
		if(side)
			url += "&side="+side ;
		return url;
	}
	//private
	
	
	function hideGroup(target, isTrue)
	{
		if(!target)
			return;
		
		if(isTrue)
		{
			$("#" + target).hide(200, function(){
				//resize();
				setTimeout(resize, 300);
			});
			$("." + target).hide(200);	
		}
		else
		{
			$("#" + target).show(200, function(){
				//resize();
				setTimeout(resize, 300);
			});	
			$("." + target).show(200);	
		}
		
	}
	
	

	function disableGroup(target, isTrue)
	{
		if(!target)
			return;
		var tarObj = document.getElementById(target).getElementsByTagName('input');
		for(var j = 0 ;tarObj.length > j; j++)
		{		
			tarObj[j].disabled = isTrue;
		}
		tarObj = document.getElementById(target).getElementsByTagName('select');
		for(var j = 0 ;tarObj.length > j; j++)
		{		
			tarObj[j].disabled = isTrue;
		}
		
	}
	function checkboxTypecheck(id,info,init)
	{
		var tmpID = this.id , tmpInfo = this.info , selected = init; 
		if(!tmpID)
			tmpID = id;
		if(!tmpInfo)	
			tmpInfo = info;

		var obj = document.getElementById(tmpID);
		
		if(selected)
			selected = tmpInfo[selected][1];
		else
			selected = tmpInfo[obj.value][1];
		for(var i in tmpInfo)
			hideGroup(tmpInfo[i][1], true);
		if(selected == "null")
			return;
		hideGroup(selected, false);	

	}
	function checkboxcheck(id,group)
	{
		var tmpID = this.id , tmpGroup = this.group; 
		if(!tmpID)
			tmpID = id;
		if(!tmpGroup)	
			tmpGroup = group;
		var obj = document.getElementById(tmpID);
		
		if(obj.checked)
		{
			hideGroup(tmpGroup, false);
			//disableGroup(tmpGroup, false);	
		}
		else
		{
			hideGroup(tmpGroup, true);
			//disableGroup(tmpGroup, true);	
		}
		
	}
	function radioCheck(id,group, data)
	{
		var tmpID = this.id , tmpGroup = this.group; tmpData = this.data;
		if(!tmpID)
			tmpID = id;
		if(!tmpGroup)
			tmpGroup = group;
		if(!tmpData)
			tmpData = data;
	
		var obj = document.getElementsByName(tmpGroup);
		for(var j = 0; j < obj.length ; j++)
		{
			if( document.getElementById(obj[j].id).checked)
			{
				hideGroup(tmpData[obj[j].id][2], false);
			}
			else
			{
				hideGroup(tmpData[obj[j].id][2], true);
			}
		}
		//checkHeight();
	}
}
var gCount, interval;

function setEnableSavaBtn(flag)//disable group name saveButtonGroup inputs
{
	var group = document.getElementById("SavebuttomGroup1");
	if(group == null)
		return;
	var tar1 = group.getElementsByTagName('input');
	for(var j = 0;tar1.length > j; j++)
	{
		tar1[j].disabled = true;
		document.getElementById("SavebuttomGroup2").getElementsByTagName('input')[j].disabled = !flag;
	}
}

var needCountDown = function(url, count, textID, parentUrl)
{
	setEnableSavaBtn(false);
	gCount = count;
	interval = window.setInterval("this.showCountDownTime('"+url+"', '"+ textID+"','"+parentUrl+"')", 1000);
	document.getElementById(textID).innerHTML = count + " ";
	
}
this.showCountDownTime = function(url, textID,parentUrl)
{
	gCount--;
	document.getElementById(textID).innerHTML = gCount + " ";
	if(gCount==0)
	{
		window.clearInterval(interval);
		if(gCount == 0)
		{
			if(parentUrl != "false") {
				if (typeof(parReload)!='undefined' && parReload) {
					parent.location.reload(); //(parentUrl); //href=parentUrl;
				} else {
					if (typeof(parReload)!='undefined'){
						parent.location.href=parentUrl;
						}
					else{
						parent.location.href=url;
						}
				}
			} else {
				location.href=url;
			}
				
		}
	}
}
var defalutH;
function checkHeight()
{
	//alert(defalutH + " QQ " +document.getElementById("main").scrollHeight + " QQ " + document.getElementById("subFrameBody").scrollHeight);
	if(defalutH  < document.getElementById("main").scrollHeight)
	{
		sidebar.style.height = document.getElementById("main").scrollHeight;
		parent.document.getElementById(window.name).style.height = document.getElementById("main").scrollHeight;
		alert("ok");
		defalutH = document.getElementById("main").scrollHeight;
	}
	
}

//// check string functions
function CheckASCII(id,errMsg,selected)
{
	var obj = document.getElementById(id).value;
	for (i=0; i<obj.length; i++)
	{
			result = obj.charCodeAt(i); 
			if (result < 33 || result > 126)
			{
				alert(errMsg);
				if(selected)
					document.getElementById(id).select();
				return false;
			}
	}
	return true;
}

function checkEng(id,errMsg,selected)
{
	var obj = document.getElementById(id).value;
	for (i=0; i<obj.length; i++)
	{
			result = obj.charCodeAt(i); 
			if ((result < 91 && result > 64) || (result < 123 && result > 96))
			{
				alert(errMsg);
				if(selected)
					document.getElementById(id).select();
				return false;
			}
	}
}
function checkSyntax(id,errMsg,selected)
{
	var obj = document.getElementById(id).value;
	var arytags = syntax.split(" ");
	for(var i = 0 ; i < arytags.length ;i++)
	{
		if(obj.value.indexOf(arytags[i]) != (-1))	
		{
			alert(errMsg + syntax);
			if(selected)
				document.getElementById(id).select();
			return false;
		}
	}
}
//// check num functions
function isPosInt(num)
{
	re = /^\d+$/;
	if (!re.test(num)) 
		return false;
	return true;
}
function range(value,min,max)
{
	return ((value<min)||(value>max))?false:true;
}
function CheckNum(id,errMsg,selected)
{
	var obj = document.getElementById(id).value;
	for (i=0; i<obj.length; i++)
	{
			result = obj.charCodeAt(i); 
			if (!(result < 58 && result > 47))
			{
				if(selected)
					document.getElementById(id).select();
				alert(errMsg);
				return false;
			}
	}
	return true;
}
function numCheck(value)
{
	if(value<=0)
		return -1;
	else
		return 0;
}

function checkIntervalAndPosInt(id,errcode,from,to)
{
	var obj = document.getElementById(id);
	if(isPosInt(obj.value)==false || range(obj.value,from,to)==false)
	{
		alertAndSelect(id,errcode);
		return false;
	}
	return true;
	
}
function checkOSD(id,errMsg)
{
	var obj = document.getElementById(id).value;
	for (i=0; i<obj.length; i++)
	{
			result = obj.charCodeAt(i);
			if ((!(result < 91 && result > 64) || (result < 123 && result > 96)) && !(result < 58 && result > 47) && result != 45 )
			{
				document.getElementById(id).select();
				alert(errMsg);
				return false;
			}
	}
	return true;
	
}
////Dynamic active function
function disableControler(obj,form,to,type,disabled) //controlitem type 'type' in row id 'obj'+ "'form' to 'to'" is 'disabled'  
{
	for(var i= form ; i <= to ; i++)
	{
		for(var j = 0 ; j < document.getElementById(obj+i).getElementsByTagName(type).length; j++)
			document.getElementById(obj+i).getElementsByTagName(type)[j].disabled = disabled;										
	}
	
}
function displayControlerByRow(obj,form,to,displayed) //controlitem type 'type' in row id 'obj'+ "'form' to 'to'" is 'disabled'  
{
	for(var i= form ; i <= to ; i++)
			document.getElementById(obj+i).style.display = displayed;										
}
function AddOptionByArray(selectID,array,selected)
{	
	var IsSelected=false;
	$("#"+ selectID).empty();
	for(var i= 0 ; i <array.length ; i++)
	{
		if (array[i] == selected) 
		{
			$("#"+ selectID).append($("<option value='" + array[i] + "' selected='selected'>" + array[i] + "</option>"  ));
			 IsSelected = true;  
		}
		else
			$("#"+ selectID).append($("<option value='" + array[i] + "'>" + array[i] + "</option>"  ));	
	}
	return IsSelected;
}
function AddOptionByNumber(selectID,From,to,times,selected)
{	
	var IsSelected=false;
	$("#"+ selectID).empty();
	for(var i= From ; i <= to ; i+=times)
	{
		if (i == selected) 
		{
			$("#"+ selectID).append($("<option value='" + i + "' selected='selected'>" + i + "</option>"  ));
			 IsSelected = true;  
		}
		else
			$("#"+ selectID).append($("<option value='" + i + "'>" + i + "</option>"  ));	
	}
	var obj = document.getElementById(selectID);
	if(navigator.userAgent.indexOf('Trident') != -1)
	{
		for(k=0;k<obj.options.length;k++)
		{
			if(obj.options[k].value==selected)
				obj.options[k].selected="selected";
		} 
		if(obj.options[0].value==0 && selected=="" && to==0)
			obj.options[0].selected="selected";
	}
	return IsSelected;
}
function IsExistItem(id, objItemValue) 
{        
	var isExist = false;
	var objSelect = document.getElementById(id);
	for (var i = 0; i < objSelect.options.length; i++) 
	{        
		if (objSelect.options[i].value == objItemValue) 
		{        
			isExist = true;        
			break;        
		}        
	}        
	return isExist;        
}         

function IsOverItem(id,objItemValue)
{

        var isOver = -1;
        var objSelect = document.getElementById(id);
        for (var i = 0; i < objSelect.options.length; i++)
        {
                if (parseInt(objSelect.options[i].value) > parseInt(objItemValue))
                {
                        isOver = i;
                        break;
                }
        }
        return isOver;
}

function disableControlerByName(Name,disable)
{
	var objarr = document.getElementsByName(Name);
	for (var i =0;;i++ )
	{
		if( i == objarr.length )
		break;
		if(disable)
			objarr[i].disabled=true;
		else
			objarr[i].disabled=false;
	}
}
function displayControlerByName(Name,display)
{
	var objarr = document.getElementsByName(Name);
	for (var i =0;;i++ )
	{
		if( i == objarr.length )
		break;
		objarr[i].style.display = display;
	}
}

//
function setDDL(obj,id,start)
{
	var dropitem = document.getElementById(id);
	dropitem.options.length = 0;
	var index;
	
	var count = start;
	for(var j in obj)
	{
		var varItem = new Option( obj[j].name,  obj[j].value);  
		dropitem.options.add(varItem); 
		if(obj[j].enable)
		{
			index = j;
			obj[j].action();
			dropitem.selectedIndex=dropitem.length-1;
		}
		start++;	
	}
	return index;
}


function setDropList(id,obj,num, seq)
{
	$("#" +id+num).empty();
	for(var j=0 ; j < obj.length ; j++)
	{
		if(seq)
			$("#" +id+num).append($("<option value='" + j + "'>" + obj[j] + "</option>"  ));
		else
			$("#" +id+num).append($("<option value='" + obj[j] + "'>" + obj[j] + "</option>"  ));
	}	
}



function setDropListByTwoObj(id,obj)
{
	var dropitem = document.getElementById(id);
	if(dropitem == null)
		return;
	dropitem.options.length = 0;
	for(var j in obj)
	{
		var varItem = new Option(obj[j][1],  obj[j][0]);  
		dropitem.options.add(varItem); 	
	}	
}

function setDroplistBySeq(id,obj,start, nonItem)
{
	var dropitem = document.getElementById(id);
	dropitem.options.length = 0;
	var start = 0;
	for(var j in obj)
	{
		if(j != nonItem)
		{
			var varItem = new Option(j,  start);  
			dropitem.options.add(varItem); 
		}
		start++;	
	}
}
////doing something function
function alertAndSelect(obj,str)
{
	alert(str);
	focusById(obj);
}
function focusById(id)
{
	try{ //ie9 will be error here.
			document.getElementById(id).select();
		}
		catch(e)
		{//do nothing
		}
}

function getValue(id)
{
	return document.getElementById(id).value;
}
function depentChecked(id,value,depentValue,bcheck)
{
	if(value == depentValue)
		document.getElementById(id).checked = bcheck;
	else
		document.getElementById(id).checked = !(bcheck);
}
function checkNavbar(Type)
{
	if(Type == "enter" && !(parent.navbarDisplay))
	{
		parent.document.getElementById("navBar").style.display = "none";
		parent.document.getElementById("sideBar").style.display = "none";
		parent.document.getElementById("mainBlockFrame").className = "mainBlockFrameWizard";
		parent.document.getElementById("contentBlock").className = "contentBlockWizard";
		
	}
	else
	{
		parent.document.getElementById("navBar").style.display = "";
		parent.document.getElementById("sideBar").style.display = "";
		parent.document.getElementById("mainBlockFrame").className = 'mainBlockFrame';
		parent.document.getElementById("contentBlock").className = "contentBlock";
	}
		
}

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
//check format 
function checkName(id,errCode)
{
	data = document.getElementById(id);
	var result;
	var i=0   
	for (i=0; i<data.value.length; i++){
		result = data.value.charCodeAt(i); 
		if (result < 33 ||result > 126){
			alert(errCode);
			data.select();
			return false;
		}
	}
}
function checksmbName(id,errCode)
{
	data = document.getElementById(id);
	var result;
	var i=0   
	for (i=0; i<data.value.length; i++){
		result = data.value.charCodeAt(i); 
		if (result < 45 ||result > 122 ||(result > 57 && result < 65)||(result > 90 && result <95 )||result == 47 ||(result>95 && result<97)){
			alert(errCode);
			data.select();
			return false;
		}
	}
}
function checksmbPassword(id,errCode)
{
	data = document.getElementById(id);
	var result;
	var i=0   
	for (i=0; i<data.value.length; i++){
		result = data.value.charCodeAt(i);
		
		if (((result < 48)&&(result != 33)&&(result != 35)&&(result != 36)&&(result != 37))||result > 122 ||(result > 57 && result < 64)||(result > 90 && result <97 )){
			alert(errCode);
			data.select();
			return false;
		}
	}
}
function checksmbsubName(id,errCode)
{
	data = document.getElementById(id);
	var result;
	var i=0   
	for (i=0; i<data.value.length; i++){
		result = data.value.charCodeAt(i); 
		if (result < 45 ||result > 122 ||(result > 57 && result < 65)||(result > 90 && result <95 )||(result>95 && result<97)){
			alert(errCode);
			data.select();
			return false;
		}
	}
}

function checkcloudpasswd(id,Vmin,Vmax)
{
	data = document.getElementById(id);
	if(data.value.length > Vmax || data.value.length < Vmin)
	{
		data.select();
		return false;
	}
	var result;
	var i=0   
	for (i=0; i<data.value.length; i++)
	{
		result = data.value.charCodeAt(i); 
		if ((result < 33) || (result == 34) ||(result >37 && result < 48) || (result > 57 && result < 64) || (result > 90 && result <97 ) || result>122 )
		{
			//alert(errCode);
			data.select();
			return false;
		}
	}
}
function checkSmtpUser(id,idpassword,errorMsg)
{
	var smtpUser = document.getElementById(id);
	var smtpPass = document.getElementById(idpassword); 
	if (smtpUser.value == "")
	 { //  alert(smtpPass.value);
	     if(smtpPass.value != "")
	        {
			 alert(firAccountError);
			 return false;
			}
			
			else
		{//	document.form1.smtpPass.disabled=true;
			smtpUser.select();
	       return true;}
	}
	if(checkName(id,errorMsg) == false)
		return false;
	return true;
		
}
/*
function checkSmtpUser1(tar +"smtpPassid",errorMsg)
{
	var tar +"smtpUser" = document.getElementById(tar +"smtpPassid");
	
	if (tar +"smtpUser".value == "")
	{   if (tar +"smtpPass".value != "")
	     { alert("aaa");
			 }
			 else{
			document.form1.tar +"smtpPass".disabled=true;;
	       return true;}
	}
	
	if(checkName(tar +"smtpPass",errorMsg) == false)
		return false;
	return true;
		
}/*
function checkSmtpUser2(vclipsmtpPassid,errorMsg)
{
	var vclipsmtpUser = document.getElementById(vclipsmtpPassid);
	
	if (vclipsmtpUser.value == "")
	{   if (vclipsmtpPass.value != "")
	     { alert("bbb");
			 }
			 else{
			document.form1.vclipsmtpPass.disabled=true;;
	       return true;}
	}
	
	if(checkName(vclipsmtpPass,errorMsg) == false)
		return false;
	return true;
		
}*/
function checkport(which_port,num,PortError1,PortError2,PortError3)
{ 
	var port=document.getElementById(which_port);
	
	if (port.value == "")
	{
		alertAndSelect(which_port,num + PortError1);
		return false;
		
	}
	if (isNaN(port.value)||isPosInt(port.value)==false)
	{
		alertAndSelect(which_port,num + PortError2);
		return false;
	}
	if (numCheck(port.value) !=0 )
	{
		alertAndSelect(which_port,num + PortError3);
		return false;
	}
	if(port.id == "httpPort"||port.id == "httpExtPort")
	{
		if((range(port.value,1025,65535)==false)&&(port.value != 80))
		{
			alertAndSelect(which_port,num + PortError3);
			return false;
		}
	}
	else if(port.id == "rtspPort"||port.id == "rtspExtPort")
	{
		if((range(port.value,1025,65535)==false)&&(port.value != 554))
		{
			alertAndSelect(which_port,num + PortError3);
			return false;
		}
	}
	else if(port.id == "httpsPort"||port.id == "httpsExtPort")
	{
		if((range(port.value,1025,65535)==false)&&(port.value != 443))
		{
			alertAndSelect(which_port,num + PortError3);
			return false;
		}
	}
	else
	{
		if(range(port.value,1,65535)==false)
		{
			alertAndSelect(which_port,num + PortError3);
			return false;
		}
	}
	return true;
}
function checkport_new(which_port,num,PortError1,PortError2,PortError3)
{ 
	var port=document.getElementById(which_port);
	
	if (port.value == "")
	{
		alertAndSelect(which_port,num + PortError1);
		return false;
	}
	if (isNaN(port.value)||isPosInt(port.value)==false)
	{
		alertAndSelect(which_port,num + PortError2);
		return false;
	}
	if (numCheck(port.value) !=0 )
	{
		alertAndSelect(which_port,num + PortError3);
		return false;
	}
	if(range(port.value,1,65535)==false)
	{
		alertAndSelect(which_port,num + PortError3);
		return false;
	}
	return true;
}
function checkport_alpha(which_port,num,PortError1,PortError2,PortError3)
{
	var port=document.getElementById(which_port);
	
	if (port.value == "")
	{
		alertAndSelect(which_port,num + PortError1);
		return false;
		
	}
	if (isNaN(port.value)||isPosInt(port.value)==false)
	{
		alertAndSelect(which_port,num + PortError2);
		return false;
	}
	if (numCheck(port.value) !=0 )
	{
		alertAndSelect(which_port,num + PortError3);
		return false;
	}
	if(port.id == "httpPort"||port.id == "httpExtPort")
	{
		if((range(port.value,1,65535)==false)&&(port.value != 80))
		{
			alertAndSelect(which_port,num + PortError3);
			return false;
		}
	}
	else if(port.id == "rtspPort"||port.id == "rtspExtPort")
	{
		if((range(port.value,1,65535)==false)&&(port.value != 554))
		{
			alertAndSelect(which_port,num + PortError3);
			return false;
		}
	}
	else if(port.id == "httpsPort"||port.id == "httpsExtPort")
	{
		if((range(port.value,1,65535)==false)&&(port.value != 443))
		{
			alertAndSelect(which_port,num + PortError3);
			return false;
		}
	}
	else
	{
		if(range(port.value,1,65535)==false)
		{
			alertAndSelect(which_port,num + PortError3);
			return false;
		}
	}
	return true;
}
function checkServer(obj,serverError)
{
	var data = document.getElementById(obj);
	if(data.value == "")
	{
		alert(serverError)
		data.select();
		return false;
	}
	var result;
	for (var i=0; i< data.value.length; i++){
		result = data.value.charCodeAt(i); 
		if (result < 45 || result > 122 || (result > 57 && result < 65) || (result > 90 && result < 95) || result == 47 || result == 96){
			alert(serverError)
			data.select();
			return false;
		}
		if(result == 46)
		{
			result = data.value.charCodeAt(i+1); 
			if((1 == data.value.length) || (result == 46))
			{
				alert(serverError)
				data.select();
				return false;
			}
		}
	}
}
function legalTimeCheck(id1,id2,id3,id4,errcode)
{
	var obj1 = document.getElementById(id1);
	var obj2 = document.getElementById(id2);
	var obj3 = document.getElementById(id3);
	var obj4 = document.getElementById(id4);
	
	var start = parseInt(obj1.value*100) + parseInt(obj2.value);
	var end = parseInt(obj3.value*100) + parseInt(obj4.value);

	if(start >= end)
	{
		alertAndSelect(id1,errcode);
		return false;
	}
	return true;
}
function timeCheckHoursFull(id1,id2,errcode1,errcode2)
{
	var obj1 = document.getElementById(id1);
	var obj2 = document.getElementById(id2);
	
	if(checkIntervalAndPosInt(id1,errcode1,0,24) == false)
		return false;

	if(obj1.value==24 && obj2.value>0)
	{
		alertAndSelect(id2,errcode2);
		return false;
	}
	return true;
}
//submit
function send_submit(formName, msg)
{
	if(typeof(doMask) == 'function')
      doMask(true, msg);

	document.getElementById(formName).submit();
}
//if need to add other wording as "downloading","doing",please add msg value in fuction doMask,e.g.(else if(msg == "doing") $(document).mask(parent.doing);),and define "index" as msg in send_request in xsl file,e.g.(send_request("doing")),and in send_request(),change send_submit(form1) as send_submit(form,"doing"),also plz add define lang in MainFrame.xsl,and add language in lang file.
function doMask(isMask, msg)
{   
	if(!$(document).mask)
		return;
	if(isMask)
	{   
	    if(msg == "test") 
	   	$(document).mask(parent.test);
	    else if(msg == "testSmtp")
	      	$(document).mask(parent.test);
	   else if(msg == "testFtp")
	      	$(document).mask(parent.test);
	    else if(msg == "testSnapSmtp")
	      	$(document).mask(parent.test);
	   else if(msg == "testSnapFtp")
	      	$(document).mask(parent.test);
	    else if(msg == "load")
	      	$(document).mask(parent.loading);
	    else if(msg == "process")
	      	$(document).mask(parent.processing);
    	    else if(msg&&msg.length>20)
		$(document).mask(msg);
	    else
		$(document).mask(parent.save);
	}
	else
		$(document).unmask();
}
//setting (tool_admin,snapshot,recoder)
function setItemDayAndTime(splitDate)
{
	var week;
	var netxWeekNum;
	var date = parseFloat(splitDate[0]);
	switch(date)
	{
		case 0:
			week = 'sun';
		break;
		case 1:
			week = 'mon';
		break;
		case 2:
			week = 'tue';
		break;
		case 3:
			week = 'wed';
		break;
		case 4:
			week = 'thu';
		break;
		case 5:
			week = 'fri';
		break;
		case 6:
			week = 'sat';
		break;
		default: 
			return false;
	
	}
	if(splitDate[0] != 6)
		netxWeekNum = date +1 ;
	else
		netxWeekNum = 0;

	document.getElementById(week).checked=true;
	document.getElementById(week+"H1").value = splitDate[1];
	document.getElementById(week+"M1").value = splitDate[2];

	if (splitDate[3] == netxWeekNum)
		document.getElementById(week+"H2").value ='24';
	else
		document.getElementById(week+"H2").value =splitDate[4];
		
	document.getElementById(week+"M2").value = splitDate[5];
	
}
//count down function
var countdown;
var countFrequency;
var flag;
function count_down(url,count)
{
	countdown = count;
	window.setInterval("ShowCountDownTime('"+url+"')", 1000);
	document.getElementById("leavetime").innerHTML = countdown + " ";
}
function ShowCountDownTime(url) 
{
	countdown--;
	document.getElementById("leavetime").innerHTML = countdown + " ";
	if(countdown==0)
	{
		countdown = 1;
		location.href=url;
	}
}
function count_down(url,count,frequency)
{
	flag = true;
	countdown = count;
	countFrequency = frequency;
	window.setInterval("ShowCountDownTime('"+url+"','"+frequency+"')", 1000);
	document.getElementById("leavetime").innerHTML = countdown + " ";
}
function ShowCountDownTime(url,frequency) 
{
	countdown--;
	document.getElementById("leavetime").innerHTML = countdown + " ";
	if(countdown==0)
	{
		if(flag)
		{
			flag = false;
			location.href=url;
		}
		countFrequency--;
		countdown = 1;
		if(countFrequency == 0)
		{
			countFrequency = frequency;
			location.href=url;
		}
	}
}

function goUrl(url)
{
	parent.sideBarNavOnClick(parent.document.getElementById(url));
}

var xmlDocSendData;
var xslDocSendData;
function LoadXMLXSLTDocSendData(urlXMLSendData,urlXSLSendDData)
{
	xmlDocSendData=null;
	xslDocSendData=null;
	new net.ContentLoader(urlXMLSendData,onXMLLoadSendData);
}

function onXMLLoadSendData()
{
	xmlDocSendData = this.req.responseXML;
	
}

function onXSLLoadSendData()
{
	xslDocSendData = this.req.responseXML;
}

function intervalCheck(id,integerErr, intervalErr, form, to)
{
	var Interval=document.getElementById(id); 
	if(isPosInt(Interval.value)==false)
	{
		alertAndSelect(id,integerErr);
		return false;
	}
	if(range(Interval.value,form,to)==false)
	{
		alertAndSelect(id,intervalErr);
		return false;
	}
	return true;
}
function isIE9() 
{ 
	var browserMsg = navigator.userAgent.toLowerCase(); 
	//      alert(browserMsg); 
	if (navigator.appName == "Microsoft Internet Explorer")
		if(browserMsg.match(/msie ([\d.]+)/)[1] == '9.0') 
			return true; 
    
	return false; 
} 
var needCountDown1 = function(url, count, textID, parentUrl)
{
	setEnableSavaBtn(false);
	gCount = count;
	interval = window.setInterval("this.showCountDownTime1('"+url+"', '"+ textID+"','"+parentUrl+"')", 1000);
	document.getElementById(textID).innerHTML = count + " ";
	
}
this.showCountDownTime1 = function(url, textID,parentUrl)
{
	gCount--;
	document.getElementById(textID).innerHTML = gCount + " ";
	if(gCount==0)
	{
		window.clearInterval(interval);
		if(gCount == 0)
		{
			if(parentUrl != "false") {
				if (typeof(parReload)!='undefined' && parReload) {
					parent.location.reload(); //(parentUrl); //href=parentUrl;
				} else {
					if (typeof(parReload)!='undefined'){
						parent.location.href=parentUrl;
						}
					else{
						parent.location.href=url;
						}
				}
			} else {
				var j = url.indexOf("%%%");
				if (j != -1) 
					url = url.replace("%%%","&");
				parent.location.href=url;
			}
				
		}
	}
}

function getHttpFullUrl(innerUrl, key)
{
	var port = window.location.port;
	if (port == "") {
		port = 80;
	}
	var url = "http://" + key + "@" + window.location.hostname + ":" + port;
	url += innerUrl;

	return url;
}
function goAdmin1(k, nav, side)
{	
	k = location.href.replace("admin/motWizard.cgi","");
	parent.location.href = k+"mainFrame.cgi?nav="+nav+"&side="+side;
}
function gotoLiveview(ip,url)
{
	var ca = url.split("/");
	var parUrl = "http://" + ip + "/" + ca[4] + "/liveView.cgi"; 
	window.location = parUrl;
	

}
function goSetupWizard(ip,url)
{
	var ca = url.split("/");
	var parUrl = "http://" + ip + "/" + ca[4] + "/mainFrame.cgi?nav=Setup"; 
	window.location = parUrl;
	

}

function checkValidKey(keyValue)
{
	if(keyValue.length > 30)
		return false;
	
	var targetChar;
	for(var i = 0; i < keyValue.length; i++){
		targetChar = keyValue.charCodeAt(i);
		if((targetChar > 47 && targetChar < 58) || (targetChar > 64 && targetChar < 91) || (targetChar > 96 && targetChar < 123) ||
			 targetChar == 45 || targetChar == 46 || targetChar == 95)
			continue;
		else
			return false;
	}
	
	return true;
}

function checkAdminUserName(userNameError1,userNameError2,newadd)
{
	var userName = newadd;
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
			alert(userNameError2);
			userName.select();
			return false;
		}
	}
}
function set_DetectLevel(level,value) 
{
	var tmp = value-40; 
	for(var i=0; i<100; i++) 
	{ 
		if(i % 2 == 0)
			level.unshift(tmp+40);
		else
			level.unshift(tmp-0.1+40);
		if (level.length > 99) 
			level.pop(); 
	} 
	return level; 
} 
function set_DetectLevel2(level) 
{ 
	for(var i=0; i<10; i++) 
	{ 
		level[i]=level[i]-10+10;
	} 
	return level; 
} 
function setform3value()
{
	document.getElementById("form3").action = "upload_graphic.cgi?enable="+document.getElementById("graphicenable").value+"&xpos="+document.getElementById("xpos").value+"&ypos="+document.getElementById("ypos").value+"&width="+document.getElementById("width").value+"&height="+document.getElementById("height").value;	
}
