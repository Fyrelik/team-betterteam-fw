function utf8_strlen(str)
{
	var str_encode = escape(str);
	var cnt = 0;
	for( i=0; i<str_encode.length; i++)
	{
		if( str_encode.charAt(i) == "%")
		{
			if( str_encode.charAt(i+1) == "u" )
			{
				var value = parseInt(str_encode.substr(i+2,4),16);
				if( value < 0x0800)
				{
					cnt += 2;
				}
				else
				{
					cnt += 3;
				}
				i = i+5;
			}
			else
			{
				cnt++;
				i = i+2;
			}
		}
		else
		{
			cnt++;
		}
	}
	return cnt;
}

function wait_webserver_restart(){
		timeoutID = window.setInterval("ShowRealTime()", 1000);
		document.getElementById("cert_show_leavetime").innerHTML = leaveTimes + " ";
}

function ShowRealTime(){
	leaveTimes--;
	document.getElementById("cert_show_leavetime").innerHTML = leaveTimes + " ";
	
	if(leaveTimes==0){
		leaveTimes = 1;
		window.clearInterval(timeoutID);
		if(cgiHttpsEnable == '2')//choose only https
		{
			var protocol="https"
			var start = location.href.indexOf(location.host) + location.host.length + 1;
			var end = location.href.indexOf("/admin/");
			var lang = location.href.substring(start, end);
			var navValue = "Setup";
			var sideValue = "adv_https";
			var currentPort = parseInt(TdbHttpsPort);
			var newUrl = protocol+"://"+window.location.hostname  + ":" + currentPort + "/" + lang + "/"+'mainFrame.cgi' + "?" + "nav=" + navValue +"&side="+sideValue;
			parent.location.href=newUrl;
		}
		else if(cgiHttpsEnable == '1')//choose both http and https
		{
			if(httpsURL.indexOf("ttps:") != -1)
			{
				var protocol="https"
				var start = location.href.indexOf(location.host) + location.host.length + 1;
				var end = location.href.indexOf("/admin/");
				var lang = location.href.substring(start, end);
				var navValue = "Setup";
				var sideValue = "adv_https";
				var currentPort = parseInt(TdbHttpsPort);
				var newUrl = protocol+"://"+window.location.hostname  + ":" + currentPort + "/" + lang + "/"+'mainFrame.cgi' + "?" + "nav=" + navValue +"&side="+sideValue;
				parent.location.href=newUrl;
			}
			else 
			{
				var protocol="http"
				var start = location.href.indexOf(location.host) + location.host.length + 1;
				var end = location.href.indexOf("/admin/");
				var lang = location.href.substring(start, end);
				var navValue = "Setup";
				var sideValue = "adv_https";
				var currentPort = parseInt(TdbHttpPort);
				var newUrl = protocol+"://"+window.location.hostname  + ":" + currentPort + "/" + lang + "/"+'mainFrame.cgi' + "?" + "nav=" + navValue +"&side="+sideValue;
				parent.location.href=newUrl;
			}
			
		}else if(cgiHttpsEnable == '0')//disable https.
		{
			var protocol="http"
			var start = location.href.indexOf(location.host) + location.host.length + 1;
			var end = location.href.indexOf("/admin/");
			var lang = location.href.substring(start, end);
			var navValue = "Setup";
			var sideValue = "adv_https";
			var currentPort = parseInt(TdbHttpPort);
			var newUrl = protocol+"://"+window.location.hostname  + ":" + currentPort + "/" + lang + "/"+'mainFrame.cgi' + "?" + "nav=" + navValue +"&side="+sideValue;
			parent.location.href=newUrl;
		} 
	}
}

function checkinput(index){
	if (checkCountry(index)==false)
		return false;
	if (checkState(index)==false)
		return false;
	if (checkLocal(index)==false)
		return false;
	if (checkOrg(index)==false)
		return false;
	if (checkOrg_unit(index)==false)
		return false;
	if (checkCommonName(index)==false)
		return false;
	if (checkValidity(index)==false)
		return false;
	else 
		return true;
}

function checkCountry(index){
	var length=document.getElementById("country"+index).value.length;
	if (isEmpty("country"+index,countryError)==true)
		return false;
		
	if (length!=2){
		alert(countryError2);
		return false;
	}
	if (countryLimit("country"+index,countryError2)==false)
		return false;	
	else
		return true;
}

function checkState(index){ 
	var str_pro = document.getElementById("province"+index).value;
	var pro_length = utf8_strlen(str_pro);
	if(pro_length > 128)
	{
		alert(stateLengthErro);
		focusById("province"+index);
		return false;
	}
	if (isEmpty("province"+index,stateError1)==true)
		return false;
	if (checkCertificate("province"+index,stateError2)==false)
		return false;
	else
		return true;
}

function checkLocal(index){
	var str_local = document.getElementById("locality"+index).value;
	var local_length = utf8_strlen(str_local);
	if(local_length > 128)
	{
		alert(localityLengthErro);
		focusById("locality"+index);
		return false;
	}
	if (isEmpty("locality"+index,localError1)==true)
		return false;
	if (checkCertificate("locality"+index,localError2)==false)
		return false;
	else
		return true;
}

function checkOrg(index){
	var str_org = document.getElementById("organization"+index).value;
	var org_length = utf8_strlen(str_org);
	if(org_length > 64)
	{
		alert(orgLengthErro);
		focusById("organization"+index);
		return false;
	}
	if (isEmpty("organization"+index,orgError1)==true)
		return false;
	if (checkCertificate("organization"+index,orgError2)==false)
		return false;
	else
		return true;
}

function checkOrg_unit(index){
	var str_org_u = document.getElementById("organization_u"+index).value;
	var org_u_length = utf8_strlen(str_org_u);
	if(org_u_length > 64)
	{
		alert(orgUnLengthErro);
		focusById("organization_u"+index);
		return false;
	}
	if (isEmpty("organization_u"+index,org_unitError1)==true)
		return false;
	if (checkCertificate("organization_u"+index,org_unitError2)==false)
		return false;
	else
		return true;
}

function checkCommonName(index){
	var str_common = document.getElementById("commonName"+index).value;
	var common_length = utf8_strlen(str_common);
	if(common_length > 64)
	{
		alert(commonNameLengthErro);
		focusById("commonName"+index);
		return false;
	}
	if (isEmpty("commonName"+index,commonNameError1)==true)
		return false;
	if (checkCertificate("commonName"+index,commonNameError2)==false)
		return false;
	else
		return true;
}

function checkValidity(index){ 
	var data=document.getElementById("validity"+index).value; 
	if (data!=""){ 
		if (!isNaN(data)){ 
			if (range(data,1,3650)){ 
				if (checkNum("validity"+index)==true){ 
					return true;
					}
				else
					alert(validityError3);
				}	
			else
				alert(validityError2);
			}
		else
			alert(validityError2);
		}
	else
		alert(validityError);
	return false;
}

//for https 
function isEmpty(obj,error){
	var data = document.getElementById(obj);
	if (data.value==""){
		alert(error);
		return true;
	}
	else
		return false;
}
function countryLimit(id,error){
	var data=document.getElementById(id);
	var length=data.value.length;
	var i=0;
	for(i=0;i<length;i++){
		var result=data.value.charCodeAt(i);
		if (result<65||result>90){
			alert(error);
			return false;
		}
	}
}
function checkCertificate(id,error){
	var data=document.getElementById(id);
	var length=data.value.length;
	var i=0;
	for(i=0;i<length;i++){
		var result=data.value.charCodeAt(i);
		if (result==34||result==37||result==38||result==39||result==43||result==44||result==60||result==62||result==92||result==94){
			alert(error + "\' \" < > & \\ % ^ + ,");
			return false;
		}
	}
}

function checkNum(id){
	var patt=new RegExp("\\."); 
	var data=document.getElementById(id).value;
	if (patt.test(data)==true)
		return false; 
	else 
		return true; 
} 

//sending ajax data
function sendByAjax(url)
{
	new net.ContentLoader(url,callbackfun);
}
function sendByAjaxPostMode(url,data)
{
	new net.ContentLoader(url,callbackfun,null,'POST',data,'application/x-www-form-urlencoded');
}

function callbackfun()
{
	var xml = null;
	xml =this.req.responseXML;
	
	if(xml == null){
		if(typeof(doMask) == 'function')
			doMask();
		return false;
	}
	else
	{	
		try{
				var create_result = xml.getElementsByTagName('code')[0].firstChild.nodeValue;
			}catch(e)
			{
				if(typeof(doMask) == 'function')
					doMask();
				return false;
			}
		
		if(create_result=="exportOK")
		{
			certStatus=1;
			if($("#autocreat").attr("checked"))
			{
				document.getElementById("curPerActive").innerHTML = status_active;
				document.getElementById("certInfoCountry").innerHTML = defaultCertCountry;
				document.getElementById("certInfoProvince").innerHTML = defaultCertProvince;
				document.getElementById("certInfoLocality").innerHTML = defaultCertLocality;
				document.getElementById("certInfoOrg").innerHTML = defaultCertOrganization;
				document.getElementById("certInfoOrgUni").innerHTML = defaultCertOrganization_u;
				document.getElementById("certInfoCommonName").innerHTML = defaultCertCommonName;
				document.getElementById("certInfoValidity").innerHTML = defaultCertValidity;
				document.getElementById("certInfoKeyLength").innerHTML = defaultKeyLength;
				document.getElementById("certInfoCountry").title = defaultCertCountry;
				document.getElementById("certInfoProvince").title = defaultCertProvince;
				document.getElementById("certInfoLocality").title = defaultCertLocality;
				document.getElementById("certInfoOrg").title = defaultCertOrganization;
				document.getElementById("certInfoOrgUni").title = defaultCertOrganization_u;
				document.getElementById("certInfoCommonName").title = defaultCertCommonName;
			}
			else if($("#mancreat").attr("checked"))
			{
				document.getElementById("curPerActive").innerHTML = status_active;
				document.getElementById("certInfoCountry").innerHTML = $("#country2").val();
				document.getElementById("certInfoProvince").innerHTML = $("#province2").val();
				document.getElementById("certInfoLocality").innerHTML = $("#locality2").val();
				document.getElementById("certInfoOrg").innerHTML = $("#organization2").val();
				document.getElementById("certInfoOrgUni").innerHTML = $("#organization_u2").val();
				document.getElementById("certInfoCommonName").innerHTML = $("#commonName2").val();
				document.getElementById("certInfoValidity").innerHTML = $("#validity2").val();
				document.getElementById("certInfoKeyLength").innerHTML = $("#keyLength2").val();
				document.getElementById("certInfoCountry").title = $("#country2").val();
				document.getElementById("certInfoProvince").title = $("#province2").val();
				document.getElementById("certInfoLocality").title = $("#locality2").val();
				document.getElementById("certInfoOrg").title = $("#organization2").val();
				document.getElementById("certInfoOrgUni").title = $("#organization_u2").val();
				document.getElementById("certInfoCommonName").title = $("#commonName2").val();
			}
			
			$("#countryInfor").css("display", "");
			$("#areaInfor").css("display", "");
			$("#localityInfor").css("display", "");
			$("#orgInfor").css("display", "");
			$("#orguniInfor").css("display", "");
			$("#commonNameInfor").css("display", "");
			$("#validityInfor").css("display", "");
			$("#keyLengthInfor").css("display", "");
			$("#Proerty").css("display", "");
			$("#Remove").css("display", "");
			document.getElementById("Remove").value = removeButton;
			resize();
		}
		else if(create_result=="removeOK")
		{
			if(certStatus==2)
			{
				$("#country3").removeAttr("disabled");
				$("#province3").removeAttr("disabled");
				$("#locality3").removeAttr("disabled");
				$("#organization3").removeAttr("disabled");
				$("#organization_u3").removeAttr("disabled");
				$("#commonName3").removeAttr("disabled");
				$("#validity3").removeAttr("disabled");
				$("#keyLength3").removeAttr("disabled");
				$("#upload").attr("disabled","disabled");
				$("#submitLocal").attr("disabled","disabled");
			}
			certStatus=0;
			document.getElementById("curPerActive").innerHTML = status_notinstall;
			$("#countryInfor").css("display", "none");
			$("#areaInfor").css("display", "none");
			$("#localityInfor").css("display", "none");
			$("#orgInfor").css("display", "none");
			$("#orguniInfor").css("display", "none");
			$("#commonNameInfor").css("display", "none");
			$("#validityInfor").css("display", "none");
			$("#keyLengthInfor").css("display", "none");
			$("#Proerty").css("display", "none");
			$("#Remove").css("display", "none");
			$("#certRequestInfoGroup").css("display", "none");
			$("#manInstallcreate").css("display", "");
			
			resize();
		}
		else if(create_result=="csr_ok")
		{
			certStatus=2;
			$("#Proerty").css("display", "none");
			$("#Remove").css("display", "");
			$("#upload").removeAttr("disabled");
			$("#submitLocal").removeAttr("disabled");
			$("#countryInfor").css("display", "none");
			$("#areaInfor").css("display", "none");
			$("#localityInfor").css("display", "none");
			$("#orgInfor").css("display", "none");
			$("#orguniInfor").css("display", "none");
			$("#commonNameInfor").css("display", "none");
			$("#validityInfor").css("display", "none");
			$("#keyLengthInfor").css("display", "none");
			$("#Proerty").css("display", "none");
			$("#country3").attr("disabled","disabled");
			$("#province3").attr("disabled","disabled");
			$("#locality3").attr("disabled","disabled");
			$("#organization3").attr("disabled","disabled");
			$("#organization_u3").attr("disabled","disabled");
			$("#commonName3").attr("disabled","disabled");
			$("#validity3").attr("disabled","disabled");
			$("#keyLength3").attr("disabled","disabled");
			
			document.getElementById("curPerActive").innerHTML = status_waitC;
			document.getElementById("Remove").value = buttonRmCertRequest;
			
			var url = "/cgi/admin/cert_request_info.cgi?op=get_request_info";
			sendByAjax(url);
		}
		else if(create_result.indexOf("BEGIN CERTIFICATE REQUEST") > 0)
		{
			var objCertInfo=document.getElementById("certRequestInfo");
			if(navigator.appName == "Microsoft Internet Explorer")
				objCertInfo.innerText = create_result;
			else
				objCertInfo.innerHTML = create_result;
			$("#certRequestInfoGroup").css("display", "");
			$("#manInstallcreate").css("display", "none");
			focusById("certRequestInfo");
			resize();
		}
		if(typeof(doMask) == 'function')
			doMask();
	}
}

function createPEM(index)// 1, auto create. 2, man create. 3, create and install.
{
	if(cgiHttpsEnable != '0')
	{
		alert(createCertError);
		return false;
	}
	
	if($("#bothhttps").attr("checked"))
		var https_Enable=1;
	else
		var https_Enable=2;
	if(index == 1)
	{
		if(certStatus == 1)
		{
			alert(createrCertError1);
			return false;
		}
		else if(certStatus == 2)
		{
			alert(createrCertError2);
			return false;
		}
		var url = "cert_create.cgi?createMethod=" + 0;
		if(typeof(doMask) == 'function')
			doMask(true,"process");
		sendByAjax(url);
	}
	else if(index == 2)
	{
		if(certStatus == 1)
		{
			alert(createrCertError1);
			return false;
		}
		else if(certStatus == 2)
		{
			alert(createrCertError2);
			return false;
		}
		var checkDataOK=checkinput(index);
		if(checkDataOK==true)
		{
			var country = document.getElementById("country2").value;
			var state = document.getElementById("province2").value;
			var local = document.getElementById("locality2").value;
			var org = document.getElementById("organization2").value;
			var org_unit = document.getElementById("organization_u2").value;
			var commonName = document.getElementById("commonName2").value;
			var validity = document.getElementById("validity2").value;
			var keyLength2 = document.getElementById("keyLength2").value;
			var cert_method=1;
			var url = "/cgi/admin/cert_create.cgi"
			var data = "certParameters="+country+','+state+','+local+','+org+','+org_unit+','+commonName+','+validity+','+keyLength2+','+cert_method;
			if(typeof(doMask) == 'function')
			doMask(true,"process");
			sendByAjaxPostMode(url,data);
		}
	}
	else if(index == 3)
	{
		if(certStatus == 2)
		{//down load crs
			var protocol = "http";
			var currentPort = parseInt(TdbHttpPort);
			if(window.location.href.indexOf("ttps:") != -1)
			{
				protocol = "https";
				currentPort = parseInt(TdbHttpsPort);
			}
			var url = protocol+"://"+window.location.hostname  + ":" + currentPort+ "/cgi/admin/cert_create_request.cgi";
			window.open(url,'_self');
		}
		else if(certStatus == 1)
		{//if a valid pem exist, please remove it before create crs.
			alert(createrCertError1);
			return false;
		}
		else
		{//create crs.
			var protocol = "http";
			if(window.location.href.indexOf("ttps:") != -1)
				protocol = "https";
			var checkDataOK=checkinput(3);
			if(checkDataOK==true)
			{
				if(typeof(doMask) == 'function')
					doMask(true,"process");
				var country = document.getElementById("country3").value;
				var state = document.getElementById("province3").value;
				var local = document.getElementById("locality3").value;
				var org = document.getElementById("organization3").value;
				var org_unit = document.getElementById("organization_u3").value;
				var commonName = document.getElementById("commonName3").value;
				var validity = document.getElementById("validity3").value;
				var keyLength3 = document.getElementById("keyLength3").value;
				var cert_method=2;
				var url = "/cgi/admin/cert_create_request.cgi"
				var data = "certParameters="+country+','+state+','+local+','+org+','+org_unit+','+commonName+','+validity+','+keyLength3+','+cert_method;
				if(typeof(doMask) == 'function')
					doMask(true,"process");
				sendByAjaxPostMode(url,data);
			}
		}
	}
	
}

function send_request(index)//0 enable https decide connect type. 1, import cert.
{
	if(index == 0)
	{//save htttps mode.
		if($("#enableHttpsBox").attr("checked"))
		{
			//no per, you can not enable https
			if((certStatus==0)||(certStatus==2))
			{
				alert(noCerSaveError);
				return false;
			}
			if($("#bothhttps").attr("checked"))
				$("#https_Enable").val("1");
			else
				$("#https_Enable").val("2");
				
			if($("#bothhttps").attr("checked"))
			{
			}
			else
			{
				if($("#onlyhttps").attr("checked"))
				{
				}
				else
				{
					alert(connectTypeError);
					return false;
				}
			}
			
		}
		else
		{
			$("#https_Enable").val("0");
		}
		send_submit("formContTYPE");
	}
	else if(index == 1)
	{// up load Pem.
		if(cgiHttpsEnable != '0')
		{
			alert(createCertError);
			return false;
		}
		if(confirm(upLoadCertConfirm))
		{
			if(typeof(doMask) == 'function')
			doMask(true,"process");
			document.getElementById("cert_upload").submit();
		}
		else
			return;
	}
}

function cert_remove()
{
	if(cgiHttpsEnable != '0')
	{
		alert(removeError1);
		return false;
	}
	else
	{
		if(certStatus==2)
		{
			if(confirm(removeConfirm1))
			{
				var url = "/cgi/admin/cert_remove.cgi?op=remove";
				if(typeof(doMask) == 'function')
					doMask(true,"process");
				sendByAjax(url);
			}
			else
				return;
		}
		else
		{
			if(confirm(removeConfirm))
			{
				var url = "/cgi/admin/cert_remove.cgi?op=remove";
				if(typeof(doMask) == 'function')
					doMask(true,"process");
				sendByAjax(url);
			}
			else
				return;
		}
	}
}