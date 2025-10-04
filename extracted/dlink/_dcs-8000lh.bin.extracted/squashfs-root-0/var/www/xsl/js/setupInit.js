$(function(){ 
	var url = location.href.split("admin/");
	url = url[1];
	if(url.length < 2)
		return;
	url = url.replace(".cgi", "");
	try{
		var mainid = $(window.parent.document).find("#"+ url).attr("name");
		if(mainid == undefined || parent.document.getElementById(mainid) == null)
			return;
		
		parent.selector.navSelect(parent.document.getElementById(mainid), url, false);  
	}
	catch(e)
	{
		return; //ignore
		//alert(e);	
	}
	 
})
