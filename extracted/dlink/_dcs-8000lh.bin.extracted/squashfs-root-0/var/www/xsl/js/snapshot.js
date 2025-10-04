function isEMailAddrAndNotEmpty(id,emptyMsg,ErrorMsg)
{
	var str = document.getElementById(id).value;
	if(str == "")
	{
		alertAndSelect(id,emptyMsg);
		return false;
	}

    var re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z0-9]{2,7}$/;
	//var re = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    if (!str.match(re))
	{
		alertAndSelect(id,ErrorMsg);
        return false;
	}
	else
        return true;
}
function checkFolder(obj,errCode)
{	
	var data = document.getElementById(obj);
	var tags = "~ ! @ # $ % ^ & ( ) + { } ` = [ ] ; ' \" , \\ | * ? < > :";
	var arytags = tags.split(" ");
	
	for(var i = 0 ; i < arytags.length ; i++)
	{
		if(data.value.indexOf(arytags[i]) != (-1) || data.value.charCodeAt(i)==32)	
		{
			alertAndSelect(obj,errCode + " \"/\" , \".\" , \"-\" , \"_\"");
			return false;
		}
	}
	return true;
}
function checkFolder2(obj,errCode){

	var data = document.getElementById(obj);
	var tagss = ".. ... // ///";
	var arytagss = tagss.split(" ");
	var folderValue = data.value;

	for(var i = 0 ; i < arytagss.length ; i++)
	{
		if(data.value.indexOf(arytagss[i]) != (-1))	
		{
			alertAndSelect(obj,errCode);
			return false;
		}
	}
	
	return true;
}

function checkFixFilename(obj,fixFilenameError)
{
	var data = document.getElementById(obj);
	
	if(data.value != ""){
	
		for (i=0; i<data.value.length; i++)
		{
			var result = data.value.charCodeAt(i); 
			if (result < 33 || result > 126 ){
				alertAndSelect(obj,fixFilenameError + " \".\" , \"-\" , \"_\"");
				return false;
			}
		}
		var tags = "~ ! @ # $ % ^ & ( ) + { } ` = [ ] ; ' , \\ | * / : * ? \" < > |";
		var arytags = tags.split(" ");
	
		for(var i = 0 ; i < arytags.length ;i++)
		{
			if(data.value.indexOf(arytags[i]) != (-1))	
			{
				alertAndSelect(obj,fixFilenameError + " \".\" , \"-\" , \"_\"");
				return false;
			}
		}
	}
}
function formatNumber(dataArray)
{
	for (var i = 0; i < (dataArray.length); i++) {
		if (dataArray[i].length == 1) {
			if (dataArray[i] == 0)
				dataArray[i] = "00";
			else
				dataArray[i] = "0"+dataArray[i];
		}
	}
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
function checkSec(id,num,err)
{
	var sec = document.getElementById(id).value;
	if(isPosInt(sec)==false || sec < num)
	{
		alertAndSelect(id,err);
		return false;
	}
	return true;
}

function record_commonChecking()
{
//if($("#triggerType").val() == 0 || $("#triggerType").val() == 3 ||$("#triggerType").val() == 4 ||$("#triggerType").val() == 5 ||$("#triggerType").val() == 6) //motion or gpio or motion or hot or cold
	//{
			var pre = "";
			var pre1 = "m";
			var target = "motDay";
			var flag = true;
			var dflag = false;
			var m_triggerType = parseInt($("#triggerType").val(), 10);

			switch(m_triggerType)
			{
				case 1:
				{
					pre1 = "s";
					target = "scheduleDay";
					dflag = true;
					break;
				}
				case 3:
				{
					pre = "g";
					pre1 = "g";
					if(!!$("#"+pre+"onlyDuring").attr("checked"))dflag = true;
					break;
				}
				case 0:
				{
					if(supportMultiEvent)
						break;
				}
				case 4:
				{
					pre = "a";
					pre1 = "a";
					if(!!$("#"+pre+"onlyDuring").attr("checked"))dflag = true;
					break;
				}
				default:
					break;
			}

			if(document.form1.enableAction.checked)
			{
				if(dflag)
				{

					/*check day*/
					$("#"+pre+target+" input").each(function(){
						if(!!$(this).attr("checked"))
						{
							flag = false;
							return false;
						}
					});

					if(flag)
					{//no day selected
						alert(dayErr);
						return false;
					}

					/*check time*/
					if(!dateCheck(pre1+"sHour",pre1+"sMin",mfhourError,mfminuteError) || 
					!dateCheck(pre1+"eHour",pre1+"eMin",mthourError,mtminuteError))
						return false;
					setUpTime(pre1+"sHour",pre1+"sMin",pre1+"eHour",pre1+"eMin");
				}
			}

			if (supportMultiEvent)
			{
				var isEvent = true;
				$("#eventbox input").each(function(){
					if(!!$(this).attr("checked"))
						isEvent = false;
				});
				
				if(m_triggerType == 0)
				{
					if(isEvent)
					{
						alert(eventErr);
						return false;
					}
				}
			}
	//}
	/*else if($("#triggerType").val() == 1) //schedule
	{
		if(!dateCheck("ssHour","ssMin",mfhourError,mfminuteError) || 
		!dateCheck("seHour","seMin",mthourError,mtminuteError))
			return false;
		setUpTime("ssHour","ssMin","seHour","seMin");
		
		var flag = true;
		$("#scheduleDay input").each(function(){
			if(!!$(this).attr("checked"))
					flag = false;
		});
		if(flag||((!$("#"+"sSun").attr("checked"))&&(!$("#"+"sMon").attr("checked"))&&(!$("#"+"sTue").attr("checked"))&&(!$("#"+"sWed").attr("checked"))&&(!$("#"+"sThu").attr("checked"))&&(!$("#"+"sFri").attr("checked"))&&(!$("#"+"sSat").attr("checked"))))
		{
			alert(dayErr);
			return false;
		}	
	}*/
/*	else if($("#type").val() == 3) //DI
	{
		if(!dateCheck("ssHour","ssMin",mfhourError,mfminuteError) || 
		!dateCheck("seHour","seMin",mthourError,mtminuteError))
			return false;
		setUpTime("ssHour","ssMin","seHour","seMin");
		
		var flag = false;
		$("#gmotDay input").each(function(){
			if($(this).attr("checked") == true)
					flag = true;
		});
		if(!flag)
		{
			alert(dayErr);
			return false;
		}	
	}*/
	/*else if($("#type").val() == 2)
	{
		if(!checkSec("alwaysInterval",5, intervalSecErr))
			return false;
	}*/
	
	/*if(!(document.form1.sd.checked )) //as lease one click
	{
		alert(triggerError);
		return false;
	}*/
	
	//if (document.form1.sd.checked)
	//{
		if($("#recordToSDcard").attr("checked"))
		{
			if(intervalCheck("sdquote",sdQuotaError, sdQuotaError, 200, 32768)==false)
			{
				return false;
			}
			if(recordertype(extraModules)==true)
			{
				if(document.getElementById("smbkeepSpace").value < 200 || document.getElementById("smbkeepSpace").value > 32768)
				{
					document.getElementById("smbkeepSpace").value = smbkeepSpacevalue;
					if(smbkeepSpacevalue < 200 || smbkeepSpacevalue > 32768)
						document.getElementById("smbkeepSpace").value = 200;	
				}
			}
		}
		if(recordertype(extraModules)==true && $("#recordToSamba").attr("checked"))
		{
			if(document.getElementById("sdquote").value < 200 || document.getElementById("sdquote").value > 32768 || isNaN(document.getElementById("sdquote").value))
			{
				document.getElementById("sdquote").value = sdquotevalue;
				if(sdquotevalue < 200 || sdquotevalue > 32768)
					document.getElementById("sdquote").value = 200;
			}
			if(intervalCheck("smbkeepSpace",sdQuotaError1, sdQuotaError1, 200, 32768)==false)
			{
				return false;
			}
			if(checkServer("SambaServer",serverError)==false)
			{
				return false;
			}
			
			if ($("#account").attr("checked"))
			{
				if (getValue("user") == "")
				{
					alertAndSelect('user',usernameError);
					return false;
				}
				if(checksmbName("user",usernameError1)==false)
				{
					return false;
				}
				//if (getValue("password") == "")
				//{
				//	alertAndSelect('password',passwordError);
				//	return false;
	 			//}
		
				if(getValue("password") != "*a!_-/6^P$")
					{
					if(checksmbPassword("password",passwordError1)==false)
						return false;
					}
			}
			if (getValue("shareFolder") == "")
				{
					alertAndSelect('user',shareFolderError);
					return false;
				}
			if(checksmbName("shareFolder",shareFolderError)==false)
				return false;
		
			if(checksmbsubName("subFolder",subFolderError)==false)
				return false;
		}
		else
			return true;
		//}
		
	//}
	return true;
	
}
function gpio_commonChecking()
{
	if($("#type").val() == 0){
		return true;
	}
	var pre = "m";
	if($("#type").val() == 2) //gpio
		pre = "d";
	if($("#type").val() == 3) //audio
		pre = "a";
		
	if(document.form1.toOutBox1.checked && $("#"+pre+"onlyDuring").attr("checked"))
	{
				if(!dateCheck(pre+"sHour",pre+"sMin",mfhourError,mfminuteError) || 
			!dateCheck(pre+"eHour",pre+"eMin",mthourError,mtminuteError))
						return false;
				setUpTime(pre+"sHour",pre+"sMin",pre+"eHour",pre+"eMin");
				var flag = false;
				$("#"+pre+"motDay input").each(function(){
					if(!!$(this).attr("checked"))
						flag = true;
					});
				if(flag||((!$("#"+pre+"Sun").attr("checked"))&&(!$("#"+pre+"Mon").attr("checked"))&&(!$("#"+pre+"Tue").attr("checked"))&&(!$("#"+pre+"Wed").attr("checked"))&&(!$("#"+pre+"Thu").attr("checked"))&&(!$("#"+pre+"Fri").attr("checked"))&&(!$("#"+pre+"Sat").attr("checked"))))
				{
					alert(dayErr);
					return false;
				}	
			
	}
	return true;
		
}

function night_led_commonChecking()
{
	if($("#type").val() <= 2)
		return true;
	var pre = "m";
	if($("#type").val() == 4) //gpio
		pre = "d";
	if($("#type").val() == 5) //hot
		pre = "h";
	if($("#type").val() == 6) //cold
		pre = "c";
		
	if($("#"+pre+"onlyDuring").attr("checked"))
	{
				if(!dateCheck(pre+"sHour",pre+"sMin",mfhourError,mfminuteError) || 
			!dateCheck(pre+"eHour",pre+"eMin",mthourError,mtminuteError))
						return false;
				setUpTime(pre+"sHour",pre+"sMin",pre+"eHour",pre+"eMin");
				var flag = false;
				$("#"+pre+"motDay input").each(function(){
					if(!!$(this).attr("checked"))
						flag = true;
					});
				if(!flag)
				{
					alert(dayErr);
					return false;
				}
				else
				{
					return true;
				}
			
	}
	else
	{
		return true;
	}
}

function snapshot_videoclip_commonChecking(index)
{
	//if($("#triggerType").val() == 0 || $("#triggerType").val() == 3 ||$("#triggerType").val() == 4 ||$("#triggerType").val() == 5 ||$("#triggerType").val() == 6) //motion or gpio or motion or hot or cold
	//{
			var pre = "";
			var pre1 = "m"
			if($("#triggerType").val() == 3)
			{
				pre = "g";
				pre1 = "g";
			}
			if($("#triggerType").val() == 4)
			{
				pre = "a";
				pre1 = "a";
			}
			if(supportMultiEvent == false && $("#triggerType").val() == 1)
			{
				pre = "s";
				pre1 = "s";
			}
			if(document.form1.enableAction.checked && $("#"+pre+"onlyDuring").attr("checked"))
			{
				var flag = true;
				$("#"+pre+"motDay input").each(function(){
				if(!!$(this).attr("checked"))
						flag = false;
				});
				if($("#triggerType").val() == 1||($("#triggerType").val() == 0 && document.form1.onlyDuring.checked ==true))
				{
					if(flag||((!$("#"+pre1+"Sun").attr("checked"))&&(!$("#"+pre1+"Mon").attr("checked"))&&(!$("#"+pre1+"Tue").attr("checked"))&&(!$("#"+pre1+"Wed").attr("checked"))&&(!$("#"+pre1+"Thu").attr("checked"))&&(!$("#"+pre1+"Fri").attr("checked"))&&(!$("#"+pre1+"Sat").attr("checked"))))
					{
						alert(dayErr);
						return false;
					}
				}
				if(!flag)
				{
					document.form1.duringEnable.value =1;
					if(!dateCheck(pre1+"sHour",pre1+"sMin",mfhourError,mfminuteError) || 
			!dateCheck(pre1+"eHour",pre1+"eMin",mthourError,mtminuteError))
						return false;
				setUpTime(pre1+"sHour",pre1+"sMin",pre1+"eHour",pre1+"eMin");
				}
				else
					document.form1.duringEnable.value =0;
			
			}
			if (supportMultiEvent) {
				var isEvent = true;
				$("#eventbox input").each(function(){
				if(!!$(this).attr("checked"))
						isEvent = false;
				});
			
				if($("#triggerType").val() == 0)
				{
					if(isEvent)
					{
						alert(eventErr);
						return false;
					}
				}
			}
	//}
	/*else if($("#triggerType").val() == 1) //schedule
	{
		if(!dateCheck("ssHour","ssMin",mfhourError,mfminuteError) || 
		!dateCheck("seHour","seMin",mthourError,mtminuteError))
			return false;
		setUpTime("ssHour","ssMin","seHour","seMin");
		
		var flag = true;
		$("#scheduleDay input").each(function(){
			if(!!$(this).attr("checked"))
					flag = false;
		});
		if(flag||((!$("#"+"sSun").attr("checked"))&&(!$("#"+"sMon").attr("checked"))&&(!$("#"+"sTue").attr("checked"))&&(!$("#"+"sWed").attr("checked"))&&(!$("#"+"sThu").attr("checked"))&&(!$("#"+"sFri").attr("checked"))&&(!$("#"+"sSat").attr("checked"))))
		{
			alert(dayErr);
			return false;
		}	
	}*/
	/*else if($("#type").val() == 2)
	{
		if(!checkSec("alwaysInterval",5, intervalSecErr))
			return false;
	}*/
	
	if(!(((document.form1.sd != null)&&(document.form1.sd.checked))||document.form1.ftp.checked || document.form1.smtp.checked)) //as lease one click
	{
		alert(triggerError);
		return false;
	}

	if ((document.form1.sd != null)&&(document.form1.sd.checked))
	{
		if(intervalCheck("sdquote",sdQuotaError, sdQuotaError, 30, 999999)==false)
		{
			return false;
		}
	}
	
	//FTP Server settings
	if ((document.form1.ftp.checked) && (index != "testSnapSmtp"))
	{
		if(checkName("ftpUser",ftpNameError)==false || 
		checkName("ftpPass",ftpNameError)==false || 
		checkServer("ftpServer",firFtpServerError)==false || 
		checkFolder("folder",firFolderError)==false || 
		checkFolder2("folder",firFolderError2)==false ||
		checkFixFilename("fixFile",firFixFilenameError)==false || 
		checkport("ftpPort",firFtpError,PortError1,PortError2,PortError3)==false)
			return false;
	}
	
	//smtp check
	if ((document.form1.smtp.checked) && (index != "testSnapFtp"))
	{
		if(isEMailAddrAndNotEmpty("receiver",firRecipientError,firRecipientMailError)==false ||
		checkServer("smtpServer",firSmtpError)==false || 
		checkport("smtpPort",firSmtpName,PortError1,PortError2,PortError3) == false ||
		checkSmtpUser("smtpUser","smtpPass",mailNameError)==false || 
		checkName("smtpPass",mailNameError)==false || 
		isEMailAddrAndNotEmpty("sender",firSenderError,firSenderMailError)==false)
			return false;
	}
	
	return true;
	
}
function setUpTime(h1,m1,h2,m2)
{
		$("#sHour").val($("#"+ h1).val());
		$("#sMin").val($("#"+ m1).val());
		$("#eHour").val($("#"+ h2).val());
		$("#eMin").val($("#"+ m2).val());

}
function videoclipChecking(preErr, maxErr)
{
	if(!range($("#preRecSec").val(), 0 , 5) || !isPosInt($("#preRecSec").val()))
	{
			alertAndSelect("preRecSec",preErr);
			return false;
	}
		
	if(!range($("#maxRecSec").val(), 5 , 10) || !isPosInt($("#maxRecSec").val()))
	{
			alertAndSelect("maxRecSec", maxErr);
			return false;
	}
	/*if($("#type").val() == '0')
	{
		if(intervalCheck("ignoreMotionTime",ignoreMotionTimeError,ignoreMotionTimeError2, 60, 86400)==false)
			return false;
	}
	else
	{*/
		if (document.form1.ftp.checked)
		{
			if(modeltype ==0)
			{
				if(intervalCheck("ftpInterval", ftpintervalError + intervalError,ftpintervalError + intervalError5, 30, 86400)==false)
				return false;	
				if(intervalCheck("ftpIgnoreMotionTime",ignoreMotionTimeErrorftp,ftpignoreMotionTimeError1, 10, 86400)==false)
				return false;
			}
			else
			{
				if(intervalCheck("ftpInterval", ftpintervalError + intervalError,ftpintervalError + intervalError3, 60, 86400)==false)
				return false;	
				if(intervalCheck("ftpIgnoreMotionTime",ignoreMotionTimeErrorftp,ftpignoreMotionTimeError1, 0, 86400)==false)
				return false;
			}
		}
		if (document.form1.smtp.checked)
		{
			if(intervalCheck("smtpInterval", smtpintervalError + intervalError,smtpintervalError + intervalError3, 60, 86400)==false)
			return false;
			if(modeltype ==0)
			{
				if(intervalCheck("smtpIgnoreMotionTime",ignoreMotionTimeErrorsmtp,smtpignoreMotionTimeError2, 30, 86400)==false)
				return false;
			}
			else
			{
				if(intervalCheck("smtpIgnoreMotionTime",ignoreMotionTimeErrorsmtp,smtpignoreMotionTimeError2, 30, 86400)==false)
				return false;
			}
		}
		/*if (document.form1.sd.checked)
		{
			if(intervalCheck("sdInterval", sdintervalError+intervalError,sdintervalError + intervalError2, 60, 86400)==false)
				return false;
		}*/
	//}
	
		
	if(document.form1.smtp.checked && document.form1.ftp.checked)
	{
		alert(ftpSmtpcheckErr);	
		return false;
	}

	return true;
	
}

function recordChecking(preErr, postErr)
{
	if($("#triggerType").val() == 0)
	{
		if(!range($("#preRecSec").val(), 0 , 5) || !isPosInt($("#preRecSec").val()))
		{
				alertAndSelect("preRecSec",preErr);
				return false;
		}
			
		if(!range($("#postRecSec").val(), 0 , 60) || !isPosInt($("#postRecSec").val()))
		{
				alertAndSelect("postRecSec", postErr);
				return false;
		}
	}
	else
	{
		if(!range($("#preRecSec").val(), 0 , 5) || !isPosInt($("#preRecSec").val()))
		{
			document.getElementById("preRecSec").value = preRecSecinit;
					if(preRecSecinit < 0 || preRecSecinit > 5)
						document.getElementById("preRecSec").value = 2;
		}
			
		if(!range($("#postRecSec").val(), 0 , 60) || !isPosInt($("#postRecSec").val()))
		{
			document.getElementById("postRecSec").value = postRecSecinit;
					if(postRecSecinit < 0 || postRecSecinit > 60)
						document.getElementById("smbkeepSpace").value = 5;
		}	
	}
	/*if($("#type").val() == '0')
	{
		if(intervalCheck("ignoreMotionTime",ignoreMotionTimeError,ignoreMotionTimeError2, 0, 86400)==false)
			return false;
	}
	else
	{
		if (document.form1.sd.checked)
		{
			if(intervalCheck("sdInterval", sdintervalError+intervalError,sdintervalError + intervalError2, 60, 86400)==false)
				return false;
		}
	}*/

	return true;
	
}


function snapshotCheck(index)
{
	/*if($("#type").val() == '0') //motion
	{
		if(intervalCheck("ignoreMotionTime",ignoreMotionTimeError,ignoreMotionTimeError2, 30, 86400)==false)
			return false;
	}
	else
	{*/
	if(modeltype ==1)
	{
		if ((document.form1.ftp.checked)&&(index != "testSnapSmtp"))
		{
			if(intervalCheck("ftpInterval",ftpintervalError + intervalError,ftpintervalError + intervalError1, 1, 86400)==false)
				return false;
			if(intervalCheck("ftpIgnoreMotionTime",ftpignoreMotionTimeError,ftpignoreMotionTimeError1, 0, 86400)==false)
			return false;
			
		}
		if ((document.form1.smtp.checked)&&(index != "testSnapFtp"))
		{
			if(intervalCheck("smtpInterval",smtpintervalError + intervalError,smtpintervalError + intervalError2, 30, 86400)==false)
				return false;	
			if(intervalCheck("smtpIgnoreMotionTime",smtpignoreMotionTimeError,smtpignoreMotionTimeError2, 30, 86400)==false)
			return false;
				
		}	
	}
	else
	{
		if ((document.form1.ftp.checked)&&(index != "testSnapSmtp"))
		{
			if(intervalCheck("ftpInterval",ftpintervalError + intervalError,ftpintervalError + intervalError1, 10, 86400)==false)
				return false;
			if(intervalCheck("ftpIgnoreMotionTime",ftpignoreMotionTimeError,ftpignoreMotionTimeError1, 10, 86400)==false)
			return false;
			
		}
		if ((document.form1.smtp.checked)&&(index != "testSnapFtp"))
		{
			if(intervalCheck("smtpInterval",smtpintervalError + intervalError,smtpintervalError + intervalError2, 30, 86400)==false)
				return false;	
			if(intervalCheck("smtpIgnoreMotionTime",smtpignoreMotionTimeError,smtpignoreMotionTimeError2, 30, 86400)==false)
			return false;
				
		}
	}
		/*if (document.form1.sd.checked)
		{
			if(intervalCheck("sdInterval",sdintervalError + intervalError,sdintervalError + intervalError2, 10, 86400)==false)
				return false;	
		}*/
	//}
	
	return true;
}
var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
function setDuration(pre,itemPre, sizePre)//
{
	var itemSize = 1;
	var sHour = $("#" + pre + "sHour").val();
	var sMin = $("#" + pre + "sMin").val();
	var eHour = $("#" + pre + "eHour").val();
	var eMin = $("#" + pre + "eMin").val();
	var overDay = false;
	if(parseInt(sHour, 10) > parseInt(eHour, 10))	
		overDay = true;
	else if(parseInt(sHour, 10) == parseInt(eHour, 10) && parseInt(sMin, 10) >= parseInt(eMin, 10) )
		overDay = true;
	var now, next;	
	for(var i = 1 ; i <= 7 ; i++)
	{
		now = (i-1) % 7;
		if($("#" + pre + days[ (i - 1) % 7]).attr("checked"))
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
function setProtocolRule(sur,tar)
{
	//init check
	if($("#"+ sur).attr("checked"))
		$("#" + tar).attr("disabled" , true);
	else
		$("#"+ tar).attr("disabled" , false);
	
	//add event
	$("#" + sur).change(function(){
		if($("#"+ sur).attr("checked"))
			$("#" + tar).attr("disabled" , true);
		else
			$("#"+ tar).attr("disabled" , false);
	});

}
function recordertype(gettype)
{  
	var samba = "samba";
	var temp = gettype;
	if(temp.indexOf("samba")>= 0)
		return true;
	else
		return false;
}

function checkPerformance(name,value)
{	
		if(name < value)
		{
			if(name > 0)
				return true;
			else
				return false;
		}
		else
			return false;
}
