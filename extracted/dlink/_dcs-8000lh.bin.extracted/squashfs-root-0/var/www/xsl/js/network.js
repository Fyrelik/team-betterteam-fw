// checking world!!
function check_ip_range(order, my_obj, id)
{
	var which_ip = (my_obj.addr[order]).split(" ");				
	var start, end, octet;
	
	if (my_obj.is_mask){
		start = 0;
		end = 255;
	}/*else if(order != 0){					
		start = 1;
		end = 254;				
	}*/
	else
	{
		if(order!=0){
			start = 0;
			end = 254;
		}
		else
		{
			start = 1;
			end = 223;
		}
	}
	/*if (isNaN(which_ip) || which_ip == "" || which_ip.length > 1)
	{
		alert(netErrorMessage1 + (order+1) + netErrorMessage2 + my_obj.desc + netErrorMessage3);
		return false;
	}*/
	if (isNaN(which_ip) || which_ip == "" || which_ip.length > 1 || parseInt(which_ip) < start || parseInt(which_ip) > end)
	{
		if(order == 0) octet = "first";
		else if(order == 1) octet = "second";
		else if(order == 2) octet = "third";
		else octet = "fourth";
		if(oem == "D-Link" || oem == "D-Trendnet")
		{
			if(id=="ip")
				alert(networkipseterror);
			else if(id=="router")
				alert(routerMessage2);
			else if(id=="pridns")
				alert(priDnsMessage2);
			else if(id=="secdns")
				alert(secDnsMessage2);
		}
		else
			alert(my_obj.e_msg1)
		return false;
	}				
	return true;
}

function checkIPv6(objID) {
	var Obj = document.getElementById(objID);
	var str = Obj.value;
	var str_temp = Obj.value;
	var str_temp2 = Obj.value;
	
	var startNum = str_temp.substring(0, 2); // start with FF will be error.
	if ((startNum.indexOf('FF') == 0)||(startNum.indexOf('ff') == 0)||(startNum.indexOf('fF') == 0)||(startNum.indexOf('Ff') == 0))
    	return false;
		
	var startzeroNum = str_temp.substring(0, 4); // start with 0 will be error.
	if ((startzeroNum.indexOf("0:") == 0)||(startzeroNum.indexOf("00:") == 0)||(startzeroNum.indexOf("000:") == 0)||(startzeroNum.indexOf("0000") == 0))
	return false;
	
	if((str_temp2.split('::')).length-1>=2) // more than two '::' will be error. 
		return false;
		
   return /::/.test(str)
    ?/^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str)
    :/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str);
} 
function checkDNS(objID1,objID2){
	var Obj1 = document.getElementById(objID1);
	var Obj2 = document.getElementById(objID2);	
	var str_temp1 = Obj1.value;
	var str_temp2 = Obj2.value;
	var firstDNS = str_temp1.toUpperCase();
	var secondDNS = str_temp2.toUpperCase();
	
	if(firstDNS == secondDNS){
		return false;
	}
	return true;
}
function checkIpv6Prefix(objID)
{
	var Obj = document.getElementById(objID);
	var prefix = Obj.value;
	if (isPosInt(prefix)==false || range(prefix, 0, 128)==false)
		return false;
	else
		return true;
}

function checkIPv6gateway(objID) {
	var gateway = document.getElementById(objID).value;
	
	if(gateway.substring(1, 2)==":"||gateway.substring(2, 3)==":"||gateway.substring(3, 4)==":"){
		return false;	
		}
	else {
		var startNum = gateway.substring(0, 2);
		if ((startNum.indexOf('FE')==0)||(startNum.indexOf('fe')==0)||(startNum.indexOf('Fe')==0)||(startNum.indexOf('fE')==0)){
			middleNum = gateway.substring(2, 3);
			if ((middleNum.indexOf('8')<0)&&(middleNum.indexOf('9')<0)&&(middleNum.indexOf('a')<0)&&(middleNum.indexOf('b')<0)&&
			(middleNum.indexOf('A')<0)&&(middleNum.indexOf('B')<0)){
			return false;
			}
		return true;
		}
		
    	return false;
	} 
}
function checkport(objID, Error1, Error2, Error3)
{
	var Obj = document.getElementById(objID);
	var Port = Obj.value;
	if (Port != "") 
	{
		if (!isNaN(Port)) 
		{
			if (range(Port, 1, 65535))
				return true;
			else
				alertAndSelect(Obj, Error3);
		}
		else
			alertAndSelect(Obj, Error2);
	}
	else
		alertAndSelect(Obj, Error1);
	return false;
}
function checkName(id,errCode){
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
function addr_obj(addr, desc, allow_zero, e_msg1, e_msg2, e_msg3, is_mask)
{	
	this.addr = addr;
	this.desc = desc;
	this.allow_zero = allow_zero;	
	this.e_msg1 = e_msg1;
	this.e_msg2 = e_msg2;
	if (e_msg3 != -1)
		this.e_msg3 = msg[e_msg3];	
	this.is_mask = is_mask;	
}
function checkmask(maskid,message1,message2,message3,emptymessage,allow_zero,mask)
{
	var mask = document.getElementById(maskid).value;
	var temp_mask_obj = new addr_obj(mask.split("."), message1, allow_zero, message2, message3, -1, mask);
	if (mask == "")
	{
		alert(emptymessage);
		return false;
	}
	if (!check_mask(temp_mask_obj))
            return false;
	if (checkSubnetMask(message2) == false)
		return false;
	
	return true;
}
function checkAddress(id,message1,message2,message3,emptymessage,allow_zero,mask)
{
	var checkObj = document.getElementById(id).value;
	if(checkObj != "")
	{
		var temp_obj = new addr_obj(checkObj.split("."), message1, false, message2, message3, -1, mask);
		if (!check_address(temp_obj,id))
    		return false;
	}
	else
	{
		alert(emptymessage);
		return false;
	}
	return true;
}
function check_address(my_obj,id)//allow empty but not space
{			
	if(my_obj.addr == "")
		return true;

	if (my_obj.addr.length == 4)
	{
		if (!is_valid_ip(my_obj,id))
			return false;
		else
			return true;
	}
	else
	{
		alert(my_obj.e_msg1);
		return false;
	}
	
}
function is_valid_ip(my_obj,id)
{	
	var count_zero = 0;
	var ip = my_obj.addr;
	for(var i = 0; i < ip.length; i++)
	{
		if (ip[i] == "0")
		{
			count_zero++;
		}								
	}
	if (ip[0] == 127 && ip[1] == 0 && ip[2] == 0 && ip[3] == 1)
	{
		alert(my_obj.e_msg1);
		document.form1.ip.select();
		return false;
	}
	if (ip[0] == 254 && ip[1] == 254 && ip[2] == 254 && ip[3] == 254)
	{
		alert(my_obj.e_msg1);
		return false;
	}
	if (ip[0] == 169 && ip[1] == 254)
	{
		alert(my_obj.e_msg1);
		return false;
	}
	if (ip[0] == 127)
	{
		alert(my_obj.e_msg1);
		return false;
	}
	/*if (ip[3] == 0 || ip[3] == 255)
	{
		alert(my_obj.e_msg1);
		return false;
	}
	*/
	if (!my_obj.allow_zero && count_zero == 4)
	{
		alert(my_obj.e_msg2);
		return false;
	}
	else
	{
		if (count_zero != 4)
		{
			for(var i = 0; i < ip.length; i++)
			{
				if(ip[i].length > 1 && ip[i].charAt(0) == "0")
				{
					alert(my_obj.e_msg1);
					return false;
				}	
				if (!check_ip_range(i, my_obj, id))
					return false;							
			}
		}
	}
	return true;				
}
//check mask
function check_mask(my_mask){
	var temp_mask = my_mask.addr;							
	var in_range = false;
	var error;
	var subnet_mask = new Array(0, 128, 192, 224, 240, 248, 252, 254, 255);
	for (var i = 0; i < temp_mask.length; i++)
	{	
		var mask = parseInt(temp_mask[i]);
		if(temp_mask[i].length > 1 && temp_mask[i].charAt(0) == "0")
		{
			alert(my_mask.e_msg1);
			return false;
		}	
			
		for (var j = 0; j < subnet_mask.length; j++)
		{
			if (mask == subnet_mask[j])
			{							
				in_range = true;
				break;
			}
			else
				in_range = false;
		}
		
		if (!in_range)
		{	// when not in the subnet mask range
			/*error = netErrorMessage1 + (i+1) + netErrorMessage2 + my_mask.desc + netErrorMessage6;
			for (var j = 0; j < subnet_mask.length; j++)
			{
				error += subnet_mask[j];
				if (j < subnet_mask.length - 1)
					error += ",";
			}
			alert(error);*/
			alert(my_mask.e_msg1);
			return false;
		}
		
		if (i != 0 && mask != 0)
		{ // when not the 1st range and the value is not 0
			if (parseInt(temp_mask[i-1]) != 255){  // check the previous value is 255 or not
				alert(my_mask.e_msg1);
				return false;
			}
		}	
	}
	
	if (my_mask.addr.length != 4){// check mask is vaild or not
		alert(my_mask.e_msg1);
		return false;
	}

	if (temp_mask[0] == 255 && temp_mask[1] == 255 && temp_mask[2] == 255 && temp_mask[3] == 255) 
	{
		alert(my_mask.e_msg1);
		return false;
	}

	if (temp_mask[0] == 0 && temp_mask[1] == 0 && temp_mask[2] == 0 && temp_mask[3] == 0) 
	{
		alert(my_mask.e_msg1);
		return false;
	}
	
	return true;
}
function checkSubnetMask(maskMessage2)
{
	var netmask = document.getElementById("netmask");
	var result;
	var i=0   
	for (i=0; i<netmask.value.length; i++)
	{
		result = netmask.value.charCodeAt(i); 
		if (result < 46 || result > 57 || result == 47){
			alert(maskMessage2)
			document.form1.netmask.select();
			return false;
		}
	}
}
function checkmask_gateway_ip(ipErrormsg,netmask,ip,router)
{
	var mask = document.getElementById(netmask).value.split(".");
	var ip =  document.getElementById(ip).value.split(".");
	var router =  document.getElementById(router).value.split(".");
	for(var i=0;i<4;i++)
	{
		if((ip[i] & mask[i]) != (router[i] & mask[i]))
		{
			alert(ipErrormsg);
			return false;
		}
	}
	return true;	
}
function checkpppoe(pppoeError1,pppoeError2,pppoeError3,pppoeError4,IsComfirm)
{

	var pppoe_name = document.getElementById("pppoeName").value;
	var pppoe_pass = document.getElementById("pppoePass").value;

	if (pppoe_name == "")
	{
		alertAndSelect('pppoeName',pppoeError1);
		return false;
	}
	
	if(checkName("pppoeName",pppoeError5)==false || checkName("pppoePass",pppoeError5)==false)
		return false;
	
	if (pppoe_pass == ""){
		alertAndSelect('pppoePass',pppoeError2);
		return false;
	}
	if(IsComfirm)
	{
		var pppoe_confirm = document.getElementById("pppoeConfirm").value;
		if (pppoe_confirm == ""){
			alertAndSelect('pppoeConfirm',pppoeError3);
			return false;
		}
		if (pppoe_pass != pppoe_confirm){
			alertAndSelect('pppoeConfirm',pppoeError4);
			return false;
		}		
	}
	return true;
}
function checkDomain(obj,serverError)
{
	var data = document.getElementById(obj);
	var result;
	for (var i=0; i< data.value.length; i++){
		result = data.value.charCodeAt(i); 
		if (result < 45 || result > 122 || (result > 57 && result < 65) || (result > 90 && result < 95) || result == 47 || result == 96||result ==95){
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



