
function factory(id, dataInfo)
{
	var tar = document.getElementById(id);
	var count = 0;
	var temp ="";
	for(var i in dataInfo.opt)
	{
		count++;
		temp += "<span class=\"imgText\">"+ dataInfo.opt[i][3] +"</span>";
		temp += "<span class=\"imgText imgSetup\"><select name=\""+i+"\" id=\""+i+"\" onchange=\"sendData(\'"+i+"\', this);\" >"; 
		for(var j = dataInfo.opt[i][0]; j <= dataInfo.opt[i][1] ; j+= dataInfo.opt[i][2])
		{
			if( j.toString() == dataInfo.opt[i][4])
				temp += "<option value=\'" + j +"\' selected='selected'>"+j+"</option>"; 
			else
				temp += "<option value=\'" + j +"\'>"+j+"</option>";
		}
		temp += "</select></span>";	
		if(count % 2 == 0)
			temp += "<br />";
	}
	
	for(var i in dataInfo.check)
	{
		count++;
		temp += "<span class=\"imgText\">"+ dataInfo.check[i][0] +"</span>";
		temp += "<span class=\"imgText imgSetup\">";
		if( dataInfo.check[i][1] == "1")
			temp += "<input type=\"checkbox\" name=\""+i+"\" id=\""+i+"\" onclick=\"return sendData(\'"+i+"\', this);\" checked=\"checked\" />"
		else
			temp += "<input type=\"checkbox\" name=\""+i+"\" id=\""+i+"\" onclick=\"return sendData(\'"+i+"\', this);\" />"
		temp += "</span>";
		if(count % 2 == 0)
			temp += "<br />";
	}
	
	for(var i in dataInfo.otherOpt)
	{
		count++;
		temp += "<span class=\"imgText\">"+ dataInfo.otherOpt[i][0] +"</span><span class=\"imgText imgSetup\"><select name=\""+i+"\" id=\""+i+"\" onchange=\"sendData(\'"+i+"\', this);\" >"; 
		
		for(var j = 3; j < dataInfo.otherOpt[i].length ; j+= 1)
		{
			if((j - 3 + dataInfo.otherOpt[i][1] ).toString() == dataInfo.otherOpt[i][2])
				temp += "<option value=\"" + (j - 3 + dataInfo.otherOpt[i][1] ) +"\" selected='selected' >"+dataInfo.otherOpt[i][j]+"</option>";
			else
				temp += "<option value=\"" + (j - 3 + dataInfo.otherOpt[i][1] ) +"\">"+dataInfo.otherOpt[i][j]+"</option>";
		}
		
		temp += "</select></span>"	
		if(count % 2 == 0)
			temp += "<br />";
	}
	if(count % 2 == 1)
		temp += "<br />";

	document.getElementById(id).innerHTML = temp;
}
function sendData(type,tar)
{
	var val =  tar.value;
	if(tar.type == "checkbox")
	{
		if(tar.checked)
			val = 1;
		else
			val = 0;
	}
	var url = "adv_image.cgi?command=update&" + type + "=" + val;
	sendByAjax(url);
}

function sendByAjax(url)
{
	new net.ContentLoader(url,callbackfun);
}

function callbackfun()
{
	var xml = null;
	xml =this.req.responseXML;
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

function getHttpFullUrl1(innerUrl, key)
{
	var port = TdbHttpPort;
	if (port == "") {
		port = 80;
	}
	var url = "http://" + key + "@" + window.location.hostname + ":" + port;
	url += innerUrl;
	if(window.location.href.indexOf("ttps:") != -1)
	{
		if(window.location.port == "")
			port = 443;
		else
			port = parseInt(window.location.port);
		url = "https://" + key + "@" + window.location.hostname + ":" + port;
		url += innerUrl;
	}
	return url;
}
