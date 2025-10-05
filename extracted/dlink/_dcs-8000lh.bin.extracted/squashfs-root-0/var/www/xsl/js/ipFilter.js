//sending ajax data
function sendByAjax(url)
{
	new net.ContentLoader(url,callbackfun);
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
				var add_del_result = xml.getElementsByTagName('code')[0].firstChild.nodeValue;
			}catch(e)
			{
				if(typeof(doMask) == 'function')
					doMask();
				return false;
			}
		
		if(add_del_result=="ok")
		{	
			if(clickAddButton == 1)
			{
				if(addType == 0)//add sig ok
				{
					if(dealIpvX == 0)
					{
						var obj=document.getElementById('ipv4accessList');
						var addSigIP = document.getElementById("singleIP").value;
						obj.options.add(new Option(addSigIP,addSigIP));
						$("#ipv4accessList > option:last").attr('title',addSigIP);
						$("#singleIP").attr("value",'');
						$('.statusMessage').hide();
					}
					else
					{
						var obj=document.getElementById('ipv6accessList');
						var addSigIP = document.getElementById("singleIP").value;
						obj.options.add(new Option(addSigIP,addSigIP));
						$("#ipv6accessList > option:last").attr('title',addSigIP);
						$("#singleIP").attr("value",'');
						$('.statusMessage').hide();
					}
				}
				else if(addType == 1)//add sub ok
				{
					if(dealIpvX == 0)
					{
						var obj=document.getElementById('ipv4accessList');
						var addSubnetIP = document.getElementById("subnetIP").value + "/" + document.getElementById("netmask").value;
						obj.options.add(new Option(addSubnetIP,addSubnetIP));
						$("#ipv4accessList > option:last").attr('title',addSubnetIP);
						$("#subnetIP").attr("value",'');
						$("#netmask").attr("value",'');
						$('.statusMessage').hide();
					}
					else
					{
						var obj=document.getElementById('ipv6accessList');
						var addSubnetIP = document.getElementById("subnetIP").value + "/" + document.getElementById("netmask").value;
						obj.options.add(new Option(addSubnetIP,addSubnetIP));
						$("#ipv6accessList > option:last").attr('title',addSubnetIP);
						$("#subnetIP").attr("value",'');
						$("#netmask").attr("value",'');
						$('.statusMessage').hide();
					}
				}
				else if(addType == 2)//add range ok
				{
					if(dealIpvX == 0)
					{
						var obj=document.getElementById('ipv4accessList');
						var addRangIP = document.getElementById("rangeBeginIP").value + "-" + document.getElementById("rangeEndIP").value;
						obj.options.add(new Option(addRangIP,addRangIP));
						$("#ipv4accessList > option:last").attr('title',addRangIP);
						$("#rangeBeginIP").attr("value",'');
						$("#rangeEndIP").attr("value",'');
						$('.statusMessage').hide();
					}
					else
					{
						var obj=document.getElementById('ipv6accessList');
						var addRangIP = document.getElementById("rangeBeginIP").value + "-" + document.getElementById("rangeEndIP").value;
						obj.options.add(new Option(addRangIP,addRangIP));
						$("#ipv6accessList > option:last").attr('title',addRangIP);
						$("#rangeBeginIP").attr("value",'');
						$("#rangeEndIP").attr("value",'');
						$('.statusMessage').hide();
					}
				}
			}
			
			if(clickDelButton == 1)//del one ok
			{
				if(dealIpvX == 0)
				{
					var obj=document.getElementById('ipv4accessList');
					var index=obj.selectedIndex;
					obj.options.remove(index);
					$('.statusMessage').hide();
				}
				else
				{
					var obj=document.getElementById('ipv6accessList');
					var index=obj.selectedIndex;
					obj.options.remove(index);
					$('.statusMessage').hide();
				}
			}
		}
		else if(add_del_result=="invalidParameter")
		{
			document.getElementById("add_del_result").innerHTML = invalidParameter; 
			document.getElementById("add_del_result").style.display = "";
			$('.statusMessage').hide();
		}
		else if(add_del_result=="invalidFilterEnable")
		{
			document.getElementById("add_del_result").innerHTML = invalidFilterEnable; 
			document.getElementById("add_del_result").style.display = "";
			$('.statusMessage').hide();
		}
		else if(add_del_result=="invalidFilterType")
		{
			document.getElementById("add_del_result").innerHTML = invalidFilterType; 
			document.getElementById("add_del_result").style.display = "";
			$('.statusMessage').hide();
		}
		else if(add_del_result=="invalidAdminIPEnable")
		{
			document.getElementById("add_del_result").innerHTML = invalidAdminIPEnable; 
			document.getElementById("add_del_result").style.display = "";
			$('.statusMessage').hide();
		}
		else if(add_del_result=="invalidAdminIP")
		{
			document.getElementById("add_del_result").innerHTML = invalidAdminIP; 
			document.getElementById("add_del_result").style.display = "";
			$('.statusMessage').hide();
		}
		else if(add_del_result=="invalidIP")
		{
			document.getElementById("add_del_result").innerHTML = invalidIP; 
			document.getElementById("add_del_result").style.display = "";
			$('.statusMessage').hide();
		}
		else if(add_del_result=="invalidNetmask")
		{
			document.getElementById("add_del_result").innerHTML = invalidNetmask; 
			document.getElementById("add_del_result").style.display = "";
			$('.statusMessage').hide();
		}
		else if(add_del_result=="notChanged")
		{
			document.getElementById("add_del_result").innerHTML = ""; 
			document.getElementById("add_del_result").style.display = "";
			$('.statusMessage').hide();
			alert(commonIPadresserror);
		}
		
		if(typeof(doMask) == 'function')
			doMask();
	}
}

function getSelectedCount(objSelect)
{
   var count=0;
  for(var i=0;i<objSelect.options.length;i++)
  {
       var el=objSelect.options[i];
       if(el.selected)
	   	count++;
  }
return count;
}
/********* start of check ipv4 address functions****************/
function checkDelAccessList(accessList)
{//suit ipv4 and ipv6.
	var selectObj=document.getElementById(accessList)
	var sCount=getSelectedCount(selectObj);
	var saveFilterType=$("#filterType").get(0).selectedIndex;
	
	var filter_num=selectObj.options.length;
	
	if(sCount==0)
	{
		alert(delNumError);
		return false;
	}
	if(sCount>1)
	{
		alert(delChooseError);
		return false;
	}
	if(saveFilterType==1)
	{
		if((filter_num ==1)&&(!document.form1.adminIPEnableBox.checked))
		{
			alert(allowNoneError);
			return false;
		}
	}
	
	return true;
}

// checking world!!
function check_ip_range(order, my_obj)
{
	var which_ip = (my_obj.addr[order]).split(" ");	
	var start, end, octet;
	
	//if (order != 0 || my_obj.is_mask){
		start = 0;
		end = 255;
	//}
	//else{
	//	start = 1;
	//	end = 223;
	//}			
	if (isNaN(which_ip) || which_ip == "" || which_ip.length > 1 || parseInt(which_ip) < start || parseInt(which_ip) > end)
	{
		if(order == 0) octet = "first";
		else if(order == 1) octet = "second";
		else if(order == 2) octet = "third";
		else octet = "fourth";
		
		alert(ipMessage2);
		return false;
	}				
	return true;
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

function checkAddress(id,message1,message2,message3,emptymessage,allow_zero,mask)
{
	var checkObj = document.getElementById(id).value;
	if(checkObj != "")
	{
		var temp_obj = new addr_obj(checkObj.split("."), message1, false, message2, message3, -1, mask);
		
		if (!check_address(temp_obj)){
    		return false;
		}
	}
	else
	{
		alert(emptymessage);
		return false;
	}
	return true;
}

function check_address(my_obj)//allow empty but not space
{	
	if(my_obj.addr == "")
		return true;

//	if (my_obj.addr.length == 4||my_obj.addr.length == 7)
//	{
		if (!(checkIPv6addresserrer()||is_valid_ip(my_obj)) ){	
		//	alert(ipadresserrorinfo);
			return false;}
		else{	
			return true;}
	
}
function checkIPv6addresserrer() {	
	//var Obj = document.getElementById("adminIPEnable").value;
	var str = document.getElementById("adminIP").value;
	var str_temp = document.getElementById("adminIP").value;
	var str_temp2 = document.getElementById("adminIP").value;
	
	var startNum = str_temp.substring(0, 2); // start with FF will be error.
	if ((startNum.indexOf('FF') == 0)||(startNum.indexOf('ff') == 0)||(startNum.indexOf('fF') == 0)||(startNum.indexOf('Ff') == 0)){
//		alert(addAddressError);
    	return false;
	}
	if((str_temp2.split('::')).length-1>=2){ // more than two '::' will be error. 
//		alert(addAddressError);
		return false;
	}
   return /::/.test(str)
    ?/^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str)
    :/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str);
} 
function is_valid_ip(my_obj)
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
	/*if (ip[0] == 127 && ip[1] == 0 && ip[2] == 0 && ip[3] == 1)
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
	}*/
	if (ip[0] == 127)
	{
		alert(my_obj.e_msg1);
		return false;
	}
	for(i=0; i<=3;i++){
		if(ip[i]>255||ip[i]<0)	{
			alert(my_obj.e_msg1);
			return false;
			}
		
		}
	if (count_zero == 4)
	{
		alert(my_obj.e_msg2);
		return false;
	}
	else
	{
		if (count_zero != 4)
		{
			for(var i = 0; i < ip.length; i++)
			{//num start with 0 will be error
				if(ip[i].length > 1 && ip[i].charAt(0) == "0")
				{
					alert(my_obj.e_msg1);
					return false;
				}
				if (!check_ip_range(i, my_obj))
					return false;							
			}
		}
	}
	return true;				
}

function checkRangeIncrease(startIp,endIp,erroMessage1,erroMessage2)
{
	var startIpValue = document.getElementById(startIp).value;
	var endIpValue = document.getElementById(endIp).value;
	var new_start_obj = new addr_obj(startIpValue.split("."), null, false, null, null, -1, false);
	var new_end_obj = new addr_obj(endIpValue.split("."), null, false, null, null, -1, false);
	var start;
	var end;
	
	if(startIpValue == endIpValue)
	{
		alert(erroMessage1);
		return false;
		}
	
	for(var index=0; index < new_start_obj.addr.length; index++)
	{
		start = Number((new_start_obj.addr[index]).split(" "));
		end = Number((new_end_obj.addr[index]).split(" "));
		
		if(start > end)
		{
			alert(erroMessage2);
			return false;
		}
		else if(start < end)
		{
			return true;
		}
	}
	
	return true;
}
/********* end of check ipv4 address functions****************/

/********* start of check ipv6 address functions****************/
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

function checkIpv6Address(id)
{
	if(checkIPv6(id) == false)
	{
		alertAndSelect(id,invalidIpv6Address);
		return false;
	}
}

function checkIpv6RangeIncrease(startIp,endIp,erroMessage1,erroMessage2)
{
	var startIpValue = document.getElementById(startIp).value;
	var endIpValue = document.getElementById(endIp).value;
	var new_start_obj = new addr_obj(startIpValue.split(":"), null, false, null, null, -1, false);
	var new_end_obj = new addr_obj(endIpValue.split(":"), null, false, null, null, -1, false);
	var start;
	var end;
	
	if(startIpValue == endIpValue)
	{
		alert(erroMessage1);
		return false;
		}
		
	
	for(var index=0; index < new_start_obj.addr.length; index++)
	{
		start = parseInt((new_start_obj.addr[index]).split(" "),16);
		end = parseInt((new_end_obj.addr[index]).split(" "),16);
		
		if(start > end)
		{
			alert(erroMessage2);
			return false;
		}
		else if(start < end)
		{
			return true;
		}
	}
	
	return true;
}
/********* end of check ipv6 address functions****************/

//check input ipv4 or ipv6
function pre_send_request(index)//1: sig , 2: sub , 3, range
{
	if(index == 1)
	{
		var getSigIP = document.getElementById("singleIP").value;
		if(getSigIP.indexOf(".") > 0 )  
		{  
			send_request(0);
			return true;
		} 
		else if(getSigIP.indexOf(":") > 0 )
		{
			send_request(4);
			return true;
		}
		else
		{
			alert(addAddressError);
			return false;
		}
	}
	if(index == 2)
	{
		var getSubNetIP = document.getElementById("subnetIP").value;
		if(getSubNetIP.indexOf(".") > 0 )  
		{  
			send_request(1);
			return true;
		} 
		else if(getSubNetIP.indexOf(":") > 0 )
		{
			send_request(5);
			return true;
		}
		else
		{
			alert(addAddressError);
			return false;
		}
	}
	if(index == 3)
	{
		var getSubNetIP = document.getElementById("rangeBeginIP").value;
		if(getSubNetIP.indexOf(".") > 0 )  
		{  
			send_request(2);
			return true;
		} 
		else if(getSubNetIP.indexOf(":") > 0 )
		{
			send_request(6);
			return true;
		}
		else
		{
			alert(addAddressError);
			return false;
		}
	}
}


function send_request(index)//0-2:add ipv4 filter, 3:del ipv4 filter, 4-6:add ipv6 filter, 7:del ipv6 filter, 8:save all
{
	if(document.form1.filterEnableBox.checked)
	{
		document.form1.filterEnable.value = 1;
		var ipv4selectObj=document.getElementById("ipv4accessList")
		var ipv4FilterNum=ipv4selectObj.options.length;
		var ipv6selectObj=document.getElementById("ipv6accessList")
		var ipv6FilterNum=ipv6selectObj.options.length;
		
		if(index == 0)//add ipv4 sig
		{
			if(ipv4FilterNum>7)
			{
				alert(ipv4filterListNumError);
				return false;
			}
			if(checkAddress("singleIP",ipMessage1,ipMessage2,ipMessage3,ipError1,false,false) == false)
			{
				focusById("singleIP");
				return false;
			}
			
			var getSigIP = document.getElementById("singleIP").value;
			var filterType = document.getElementById("filterType").value;
			var url = "adv_firewall.cgi?filterType=" + filterType + "&singleIP=" + getSigIP + "&ipType=" + 0;
			if(typeof(doMask) == 'function')
				doMask(true,"process");
			sendByAjax(url);
			addType =0;
			dealIpvX =0;
			clickAddButton = 1;
			clickDelButton = 0;
			document.getElementById("add_del_result").style.display = "none";
			return true;
		}
		if(index == 1)//add ipv4 subnet
		{
			if(ipv4FilterNum>7)
			{
				alert(ipv4filterListNumError);
				return false;
			}
			if(checkAddress("subnetIP",ipMessage1,ipMessage2,ipMessage3,ipError1,false,false) == false)
			{
				focusById("subnetIP");
				return false;
			}
			
			var netMaskValue=document.getElementById("netmask").value;
			if(!range(netMaskValue, 1 , 32) || !isPosInt($("#netmask").val()))
			{
				alert(netMaskError);
				focusById("netmask");
				return false;
			}
			
			var subip = document.getElementById("subnetIP").value;
			var netmask = document.getElementById("netmask").value;
			var filterType = document.getElementById("filterType").value;
			var url = "adv_firewall.cgi?filterType=" + filterType + "&subnetIP=" + subip + "&netmask=" + netmask + "&ipType=" + 0;
			if(typeof(doMask) == 'function')
				doMask(true,"process");
			sendByAjax(url);
			addType =1;
			dealIpvX =0;
			clickAddButton = 1;
			clickDelButton = 0;
			document.getElementById("add_del_result").style.display = "none";
			return true;
		}
		if(index == 2)//add ipv4 range
		{
			if(ipv4FilterNum>7)
			{
				alert(ipv4filterListNumError);
				return false;
			}
			if(checkAddress("rangeBeginIP",ipMessage1,ipMessage2,ipMessage3,ipError1,false,false) == false)
			{
				focusById("rangeBeginIP");
				return false;
			}
			if(checkAddress("rangeEndIP",ipMessage1,ipMessage2,ipMessage3,ipError1,false,false) == false)
			{
				focusById("rangeEndIP");
				return false;
			}
			if(checkRangeIncrease("rangeBeginIP","rangeEndIP",sameIpError,decreasRangeError) == false)
			{
				focusById("rangeBeginIP");
				return false;
			}
			var beginip = document.getElementById("rangeBeginIP").value;
			var endip = document.getElementById("rangeEndIP").value;
			var filterType = document.getElementById("filterType").value;
			var url = "adv_firewall.cgi?filterType=" + filterType + "&rangeBeginIP=" + beginip + "&rangeEndIP=" + endip + "&ipType=" + 0;
			if(typeof(doMask) == 'function')
				doMask(true,"process");
			sendByAjax(url);
			addType =2;
			dealIpvX =0;
			clickAddButton = 1;
			clickDelButton = 0;
			document.getElementById("add_del_result").style.display = "none";
			return true;
		}
		
		if(index == 3)//del ipv4 access list
		{
			if(checkDelAccessList("ipv4accessList")==true)
			{
				var checkText=$("#ipv4accessList").find("option:selected").text();
				var url = "adv_firewall.cgi?deleteIP=" + checkText + "&ipType=" + 0;
				if(typeof(doMask) == 'function')
					doMask(true,"process");
				sendByAjax(url);
				dealIpvX =0;
				clickDelButton = 1;
				clickAddButton = 0;
				document.getElementById("add_del_result").style.display = "none";
				return true;
			}
			else
			{
				return false;
			}
		}
		
		if(index == 7)//del ipv6 access list
		{
			if(checkDelAccessList("ipv6accessList")==true)
			{
				var checkText=$("#ipv6accessList").find("option:selected").text();
				var url = "adv_firewall.cgi?deleteIP=" + checkText + "&ipType=" + 1;
				if(typeof(doMask) == 'function')
					doMask(true,"process");
				sendByAjax(url);
				dealIpvX =1;
				clickDelButton = 1;
				clickAddButton = 0;
				document.getElementById("add_del_result").style.display = "none";
				return true;
			}
			else
			{
				return false;
			}
		}
		
		if(index == 4)// ipv6 add sig
		{
			if(ipv6FilterNum>7)
			{
				alert(ipv6filterListNumError);
				return false;
			}
			if(checkIpv6Address("singleIP") == false)
			{
				return false;
			}
			
			var getSigIP = document.getElementById("singleIP").value;
			var filterType = document.getElementById("filterType").value;
			var url = "adv_firewall.cgi?filterType=" + filterType + "&singleIP=" + getSigIP + "&ipType=" + 1;
			if(typeof(doMask) == 'function')
				doMask(true,"process");
			sendByAjax(url);
			addType =0;
			dealIpvX =1;
			clickAddButton = 1;
			clickDelButton = 0;
			document.getElementById("add_del_result").style.display = "none";
			return true;
		}
		if(index == 5)//add ipv6 subnet
		{
			if(ipv6FilterNum>7)
			{
				alert(ipv6filterListNumError);
				return false;
			}
			if(checkIpv6Address("subnetIP") == false)
			{
				return false;
			}
			
			var netMaskValue=document.getElementById("netmask").value;
			if(!range(netMaskValue, 0 , 128) || !isPosInt($("#netmask").val()))
			{
				alert(ipv6PrefixError);
				focusById("netmask");
				return false;
			}
			
			var subip = document.getElementById("subnetIP").value;
			var netmask = document.getElementById("netmask").value;
			var filterType = document.getElementById("filterType").value;
			var url = "adv_firewall.cgi?filterType=" + filterType + "&subnetIP=" + subip + "&netmask=" + netmask + "&ipType=" + 1;
			if(typeof(doMask) == 'function')
				doMask(true,"process");
			sendByAjax(url);
			addType =1;
			dealIpvX =1;
			clickAddButton = 1;
			clickDelButton = 0;
			document.getElementById("add_del_result").style.display = "none";
			return true;
		}
		
		if(index == 6)//add ipv6 range 
		{
			if(ipv6FilterNum>7)
			{
				alert(ipv6filterListNumError);
				return false;
			}
			if(checkIpv6Address("rangeBeginIP") == false)
			{
				return false;
			}
			if(checkIpv6Address("rangeEndIP") == false)
			{
				return false;
			}
			if(checkIpv6RangeIncrease("rangeBeginIP","rangeEndIP",sameIpError,decreasRangeError) == false)
			{
				focusById("rangeBeginIP");
				return false;
			}
			var beginip = document.getElementById("rangeBeginIP").value;
			var endip = document.getElementById("rangeEndIP").value;
			var filterType = document.getElementById("filterType").value;
			var url = "adv_firewall.cgi?filterType=" + filterType + "&rangeBeginIP=" + beginip + "&rangeEndIP=" + endip + "&ipType=" + 1;
			if(typeof(doMask) == 'function')
				doMask(true,"process");
			sendByAjax(url);
			addType =2;
			dealIpvX =1;
			clickAddButton = 1;
			clickDelButton = 0;
			document.getElementById("add_del_result").style.display = "none";
			return true;
		}
		
		if(index == 8)//save all
		{
			//clear input items.
			$("#singleIP").attr("value",'');
			$("#subnetIP").attr("value",'');
			$("#netmask").attr("value",'');
			$("#rangeBeginIP").attr("value",'');
			$("#rangeEndIP").attr("value",'');
			$("#singleIP").attr("value",'');
			$("#subnetIP").attr("value",'');
			$("#netmask").attr("value",'');
			$("#rangeBeginIP").attr("value",'');
			$("#rangeEndIP").attr("value",'');
			//check admin ip.
			if(document.form1.adminIPEnableBox.checked)
			{
				document.form1.adminIPEnable.value = 1;
				if(checkAddress("adminIP",ipMessage1,ipMessage2,ipMessage3,ipError1,false,false) == false)
				{
					focusById("adminIP");
					return false;
				}
				
			}
			else
			{
				document.form1.adminIPEnable.value = 0;
			}
			
			//when click save all,if allow list is empty and admin ip is not enable, no one can link to the camera
			var saveFilterType=$("#filterType ").get(0).selectedIndex;
			if(saveFilterType==1)
			{
				var ipv4tempAccessList=document.getElementById("ipv4accessList")
				var ipv4filter_num=ipv4tempAccessList.options.length;
				var ipv6tempAccessList=document.getElementById("ipv6accessList")
				var ipv6filter_num=ipv6tempAccessList.options.length;
				
				if((ipv4filter_num ==0)&&(ipv6filter_num ==0)&&(!document.form1.adminIPEnableBox.checked))
				{
					alert(allowEmptyListError);
					return false;
				}
			}
		}
	}
	else
	{
		document.form1.filterEnable.value = 0;
	}
	
	document.getElementById("add_del_result").style.display = "none";
	factory.setupCheckbox();
	send_submit("form1");
}