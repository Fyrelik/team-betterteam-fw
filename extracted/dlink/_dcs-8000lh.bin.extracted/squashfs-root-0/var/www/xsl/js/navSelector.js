var selector;
var navIDText="";
var navIDTextLast = "";

$(function(){ 
	var queryNavDir = getQuery("nav"); 
	var querySideDir = readCookie("usePath");
	if(querySideDir == "null" || querySideDir == "adv_lan")
		querySideDir = getQuery("side");
	if(querySideDir == "" || querySideDir == "undefined")
			querySideDir = "null";
	createCookie("usePath", 'null');
	selector  = new barSelector();
	selector.init(queryNavDir, false,querySideDir);
})
function narbarClick(target, sideTarget)
{
	selector.navSelect(target,sideTarget);

	navIDText = target.id;
	
	 if (navIDText != "Live" && navIDText != navIDTextLast) {
		sidebarHeight = document.getElementById("div" + navIDText).scrollHeight;
	 }
	 navIDTextLast = navIDText;
}
function sidebarClick(target)
{
	if((target.id != "mot_detect")&&(document.getElementById('mainIframe').value == "mot_detect"))
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
	selector.sideSelect(target);
}
function barSelector()
{
	this.navIDNow;
	this.sideIDNow;
	this.step1_is_wizard_first_page = false;
	var iframe = document.getElementById('mainIframe');
	
	//** interface**
	this.init = function(dir, isStep1, sideDir)
	{
		this.step1_is_wizard_first_page = isStep1;
		if(dir != "")
		{
			this.navSelect(document.getElementById(dir),sideDir);
		}
		else
			location.href = "liveView.cgi";	
		
	}
	this.navSelect = function(target,sideTarget, isRedir)
	{
		var tarID = target.id;
		navIDNow = target.id;

		if(tarID == 'Live')
		{
			location.href ="liveView.cgi";
			return;
		}
		initNavbar();

		if(sideTarget == 'null')
		{
			initSidebar();
			this.sideIDNow = setSidebarFirstChild(tarID);
		}
		else
		{
			initSidebar();
			this.sideIDNow = sideTarget;
			this.sideSelect(document.getElementById(sideTarget), isRedir);
		}

		setNavbarOn(tarID);

	}
	this.sideSelect = function(target, isRedir)
	{
		var tarID = target.id;
		document.getElementById(this.sideIDNow).className = 'sideBarOff';
		document.getElementById(tarID).className = 'sideBarOn';
		iframe.value = tarID;
		if(isRedir != false)
			iframe.src = 'admin/'+ isWizardOnStep1(tarID) + ".cgi"; //FIXMEs
		this.sideIDNow = tarID;
	}
	//*** privete ***
	var initNavbar = function()
	{
		var navBarDiv = document.getElementById("navBar");
		for(var i=0; i< navBarDiv.getElementsByTagName('li').length; i++)
		{
		
			if(navBarDiv.getElementsByTagName('li')[i].id !="liSpace" && navBarDiv.getElementsByTagName('li')[i].id.substring(0,5)!="divli")
			navBarDiv.getElementsByTagName('li')[i].className = 'navBarOff';
		}
		
		
	}
	var initSidebar = function()
	{
		var sideBarDiv = document.getElementById("sideBar").getElementsByTagName('div');
		var sideBarDivConut = sideBarDiv.length;
		for(var i=0; i< sideBarDivConut; i++) 
		{
			if(sideBarDiv[i].id.substring(0,3) == 'div')
			{
				document.getElementById(sideBarDiv[i].id).style.display = "none";
			}
				
		}
		var id = new Array('sideBar','navBar');
		for(var k= 0 ; k < id.length ; k++)
		{
			var sideBarDiv = document.getElementById(id[k]).getElementsByTagName('div');
			var sideBarDivConut = sideBarDiv.length;
			for(var i=0; i< sideBarDivConut; i++) 
			{
				if(sideBarDiv.id != 'divlive')
				{
					for(var j=0; j< sideBarDiv[i].getElementsByTagName('li').length; j++) 
					{
						if(sideBarDiv[i].getElementsByTagName('li')[j].getElementsByTagName('div').length != 0) {
							sideBarDiv[i].getElementsByTagName('li')[j].getElementsByTagName('div')[0].className = 'sideBarOff';	
						}
					}
				}
					
			}
		}
	
	}
	
	var setNavbarOn = function(tarID)
	{
		document.getElementById(tarID).className = "navBarOn";
		document.getElementById("div"+tarID).style.display = "";
	}
	var setSidebarFirstChild = function(tarID)
	{
			
		var ulfrontChild = document.getElementById('ul'+ tarID).getElementsByTagName('div')[0].id; // find out the first one
		iframe.style.height = '0px';
		//alert(ulfrontChild);
		document.getElementById(ulfrontChild).className = 'sideBarOn';
		iframe.value = ulfrontChild;
		iframe.src = "admin/"+ isWizardOnStep1(ulfrontChild)+".cgi" ;
		return ulfrontChild;	
	}
	
	var isWizardOnStep1 = function(page)
	{
		if(this.step1_is_wizard_first_page)
		{
			if(page == 'adv_wizard')
				return "netWizard";	
		}
		return page;
	}
	

	
}
function getQuery(name)    
{   
    var AllVars = window.location.search.substring(1);   
    var Vars = AllVars.split("&");   
    for (i = 0; i < Vars.length; i++)   
    {   
        var Var = Vars[i].split("=");   
        if (Var[0] == name) return Var[1];   
    }   
    return "";   
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