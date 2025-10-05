function checkddns()
{
	var ddns_hostname =getValue("ddnsHostname");
	var ddns_username =getValue("ddnsUsername") ;
	var ddns_passwordword = getValue("ddnsPasswordword");
	var confim_Password =getValue("confimPassword");
	var ddns_timeout =getValue("ddnsTimeout");
	if(document.form1.providerValue.value == "")
	{
		alert(ddnsError6);
		return false;
	}

	if(checkddnsName("ddnsHostname",ddnsError1)==false)
		return false;
	
	if (ddns_username == "")
	{
		alertAndSelect('ddnsUsername',ddnsError2);
		return false;
	}
	if(checkName("ddnsUsername",ddnsError5)==false)
		return false;
		
	if (ddns_passwordword == ""){
		alertAndSelect('ddnsPasswordword',ddnsError3);
		return false;
	}
	
	if(checkName("ddnsPasswordword",ddnsError5)==false)
		return false;
		
	if (ddns_passwordword != confim_Password)
	{
		alertAndSelect('confimPassword',ddnsError4);
		return false;
	}
	if (isNaN(ddns_timeout)) 
	{ 
		alertAndSelect('ddnsTimeout',ddnsError7);
		return false;
	}
	if(isPosInt(ddns_timeout)==false)
	{
		alertAndSelect('ddnsTimeout',ddnsError9);
		return false;
	}
	if (numCheck(ddns_timeout - 23)==-1 || numCheck(ddns_timeout-65535)==0){
		alertAndSelect('ddnsTimeout',ddnsError8);
		return false;
	}
	return true;
}

function checkControler()
{
	var ddns = document.form1.providerDDNS;
	if(ddns.selectedIndex!=0)
		document.form1.providerValue.value = ddns[ddns.selectedIndex].text;
}
function onStatusLoad()
{
	var xmlDoc = this.req.responseXML;
	if(xmlDoc == null)
		return;
	var final = xmlDoc.getElementsByTagName('finalStatus')[0].firstChild.nodeValue;

	if(final)
		$("#status").html(final);
	this.req.close;
	this.req.abort();
	this.req = "";
	setStatus(xmlDoc.getElementsByTagName('etag')[0].firstChild.nodeValue);
}
function checkddnsName(obj,serverError)
{
	var data = document.getElementById(obj);
	if(data.value == "")
	{
		alert(serverError);
		data.select();
		return false;
	}
	var result;
	for (var i=0; i< data.value.length; i++){
		result = data.value.charCodeAt(i); 
		if (result < 45 || result > 122 || (result > 57 && result < 64) || (result > 90 && result < 95) || result == 47 || result == 96){
			alert(serverError);
			data.select();
			return false;
		}
		
	}
}
function checkDDNSServer(id,ErrorMsg,ErrorMsg1)
{
	var str = document.getElementById(id).value;
	if(str == "")
	{
		alertAndSelect(id,ErrorMsg1);
		return false;
	}
	var re = /^(([h|H][t|T][t|T][p|P])\:\/\/)?(\w+(\:(\w+))?@)?(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9]))|(([0-9a-zA-Z\_\-]+\.)*[0-9a-zA-Z\_\-]+\.[a-zA-Z]{2,4}))(\:(\d)+)?$/;
    if (!str.match(re))
	{
		alertAndSelect(id,ErrorMsg);
        return false;
	}
	else
        return true;
}
