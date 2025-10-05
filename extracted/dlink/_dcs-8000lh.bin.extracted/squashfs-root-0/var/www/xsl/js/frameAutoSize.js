// JavaScript Document
// special JS DOC for different OEM
var sidebarHeight = parent.sidebarHeight;
var divHelpBarHeight = 0;

$(function(){
	divHelpBarHeight = document.getElementById("helpBar").scrollHeight;
})

function resize()
{
        if (typeof(window.name) == "undefined" || window.name == "") 
			return;
		var iHeight="";
        var parentFrame = parent.document.getElementById(window.name);
        var divMainFrameBorder = document.getElementById("main");
        var divHelpBar = document.getElementById("helpBar");
		var sidebar = parent.document.getElementById("sideBar");
        if (parentFrame == null)			
                return;
				//alert(document.getElementById("subFrameBody").scrollHeight + " QQ " +  divMainFrameBorder.scrollHeight);
        if(divHelpBar != null)
        {
        	if (divHelpBarHeight == 0) {
			divHelpBarHeight = document.getElementById("helpBar").scrollHeight;
		}
			
			if(divMainFrameBorder.scrollHeight > divHelpBarHeight)
			{
				//iHeight = document.getElementById("subFrameBody").scrollHeight;
				iHeight = divMainFrameBorder.scrollHeight;
  	        }
			else
    	    	iHeight = divHelpBarHeight;
				
    	}
        else
    	  	iHeight = divMainFrameBorder.scrollHeight;
		
		if(sidebarHeight > iHeight) iHeight = sidebarHeight;   

		if(parent.iFrameoffset != null)
			iHeight += parent.iFrameoffset;
	
		else
			iHeight +=18;
		
		parentFrame.style.height = iHeight+ 14 + "px";
		divHelpBar.style.height = iHeight + 8 + "px";
		//alert(parentFrame.style.height);
		if(document.getElementById("subFrameBody") != null)
		{
			var divsubFrameBody = document.getElementById("subFrameBody");
			divsubFrameBody.style.height = iHeight + 14+ "px";	
			//divsubFrameBody.style.height = "200px";
		}	
		//for position property
		var mainBlockFrame = parent.document.getElementById("mainBlockFrame");
		defalutH = mainBlockFrame.scrollHeight - 1;
		/*if(mainBlockFrame.scrollHeight < adjestHeight)
		{
			defalutH = defaultHeight;
			sidebar.style.height = defaultHeight + "px";
		}
		else
		{
			defalutH = mainBlockFrame.scrollHeight - 1;
			sidebar.style.height = mainBlockFrame.scrollHeight - 1 + "px";	
		}*/
		sidebar.style.height = defalutH + "px";
		parent.document.getElementById("contentBorder").style.height = defalutH + "px";
}

function goAVset(path)
{
	window.location.href= path +".cgi";
	parent.sidebarClick(parent.document.getElementById(path))
}