function checkPreset(presetError,emptyerror)
{
	var presetName = document.getElementById("presetName");
	var result;
	if (presetName.value == '')
	{
		alertAndSelect("presetName",emptyerror);
		return false;
	}   
	for (var i=0; i < presetName.value.length; i++)
	{
		result = presetName.value.charCodeAt(i); 
		if (result < 45 || result > 122 || (result > 57 && result < 65) || (result > 90 && result < 95) || result == 47 || result == 96 || result == 46)
		{
			alert(presetNameError111);
			
			presetName.select();
			return false;
		}
	}
}
function changePatrol(active)
{
	var obj = document.getElementById("patrolPoint");
	if(obj.selectedIndex !=-1)
	{
		if(active=='up')
		{
			if (obj.selectedIndex>0)
				swapNode(obj.options[obj.selectedIndex],obj.options[obj.selectedIndex-1]);
		}
		else if(active=='down')
		{
			if (obj.selectedIndex<obj.options.length-1)
				swapNode(obj.options[obj.selectedIndex],obj.options[obj.selectedIndex+1]);
		}
		else//del
		{
			for(var i=0; i< obj.options.length; i++)
			{
				if(obj.options[i].selected)	
				{
					obj.remove(i);
					i = 0;
				}
			}
		}
	}
	else
		alert(noSelectError);
	
}

function swapNode(node1,node2)
{
	var parent = node1.parentNode;
	var t1 = node1.nextSibling;
	var t2 = node2.nextSibling;

	if(t1) 
		parent.insertBefore(node2,t1);
	else 
		parent.appendChild(node2);

	if(t2) 
		parent.insertBefore(node1,t2);
	else 
		parent.appendChild(node1);

}

function checkWaitTime(id,errcode,errcode1,errcode2)
{
	var obj = document.getElementById(id);
	if (obj.value == "")
	{
		alert(errcode1);
		return false;
	}
	if (isNaN(obj.value))
	{
		alert(errcode2);
		return false;
	}
	if(isPosInt(obj.value)==false || range(obj.value,0,60)==false)
	{
		alertAndSelect(obj.id,errcode);
		return false;
	}
	return true;
}
function checkPoint()
{
	var patrolPoint = document.getElementById("patrolPoint");
	var routeValue = "";
	for(var i=0;i<patrolPoint.options.length;i++)
		routeValue = routeValue + patrolPoint.options[i].value + ",";
	routeValue = routeValue.substring(0,routeValue.length-1)
	document.getElementById("route").value = routeValue;
	
	if(patrolPoint.length > 20)
	{
		alert(patrolFull);	
		return false;
	}
	return true;
}
function checkPatrol()
{
	var patrolPoint = document.getElementById("patrolPoint");
	if(($("#presetList").find(":selected").length + patrolPoint.length)  > 20)
	{
		alert(patrolFull);
		return false;
	}
	return true;
}
function changeSize() //adjestHeight: default height
{
        if (typeof(window.name) == "undefined" || window.name == "") 
			return;
		var iHeight="";
        var parentFrame = parent.document.getElementById(window.name);
        var divMainFrameBorder = document.getElementById("main");
        var divHelpBar = document.getElementById("helpBar");
        if (parentFrame == null)			
                return;
				
        if(divHelpBar != null)
        {
			if(divMainFrameBorder.scrollHeight > divHelpBar.scrollHeight)
				iHeight = divMainFrameBorder.scrollHeight;
  	        else
    	    	iHeight = divHelpBar.scrollHeight;
				
    	}
        else
    	  	iHeight = divMainFrameBorder.scrollHeight;
		if(parent.iFrameoffset != null)
			iHeight += parent.iFrameoffset;
	
		else
			iHeight +=18;
		if (iHeight < 200)
			iHeight = 200;
			
		parentFrame.style.height = iHeight+ 25 + "px";
		divHelpBar.style.height = iHeight + 8 + "px";
		
		if(document.getElementById("subFrameBody") != null)
		{
			var divsubFrameBody = document.getElementById("subFrameBody");
			divsubFrameBody.style.height = iHeight + 14+ "px";	
			//divsubFrameBody.style.height = "200px";
		}	
		
		if(parent.document.getElementById("spacer") != null )
		{
			if(iHeight < 380 )
			{
				if(parent.iframePageHeightOffset ==null)
					parent.document.getElementById("spacer").style.height = "240px";
				else
					parent.document.getElementById("spacer").style.height = parent.iframePageHeightOffset +"px";
			}
			else
				parent.document.getElementById("spacer").style.height = "80px";
		}
		
		//for position property
		var mainBlockFrame = parent.document.getElementById("mainBlockFrame");
		var sidebar = parent.document.getElementById("sideBar");
		if(mainBlockFrame.scrollHeight < 200)
			sidebar.style.height = defaultHeight + "px";
		else
			sidebar.style.height = mainBlockFrame.scrollHeight - 1 + "px";	
		
}
function getPoint(route){
	var patrolPoint = document.form4.patrolPoint;
	document.getElementById("patrolPoint").innerHTML = "";
	var j=0;
	var Point = route.split(',');

	for(var i=0;i<Point.length;i++)
	{
		patrolPoint.options.add(new Option(Point[i],Point[i]));
	}	
}
function disableEnterKeydown(e) 
{    
	var key;

     if(window.event)
          key = window.event.keyCode;     //IE
     else
          key = e.which;     //firefox
     if(key == 13)
          return false;
     else
          return true; 
}  

var charTable = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function basicAuthToKey(str) 
{
		var c1, c2, c3, c4;
		var i, len, out;
	
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
		 	/* c1 */
		 	do {
			 c1 = charTable[str.charCodeAt(i++) & 0xff];
		 } while(i < len && c1 == -1);
		 if(c1 == -1)
			 break;
		
		 /* c2 */
		 do {
			 c2 = charTable[str.charCodeAt(i++) & 0xff];
		 } while(i < len && c2 == -1);
		 if(c2 == -1)
			 break;
		
		 out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
		
		 /* c3 */
		 do {
			 c3 = str.charCodeAt(i++) & 0xff;
			 if(c3 == 61)
		  return out;
			 c3 = charTable[c3];
		 } while(i < len && c3 == -1);
		 if(c3 == -1)
			 break;
		
		 out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
		
		 /* c4 */
		 do {
			 c4 = str.charCodeAt(i++) & 0xff;
			 if(c4 == 61)
		  return out;
			 c4 = charTable[c4];
		 } while(i < len && c4 == -1);
		 if(c4 == -1)
			 break;
		 out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
			return out;
}
