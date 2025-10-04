function insertApplet(context,bitmap,pfile,width,height,blockWidth,blockHeight)
{
	 var temp = "<applet code=\"MD.class\" type=\"application/x-java-applet\" archive=\"MD.jar\" width=\""+width+"\" height=\""+height+"\" name=\"MDApplet\" id=\"MDApplet\" >";
		temp+="<param name=\"codebase\" value=\"\" />"; 
		temp+="<param name=\"scriptable\" value=\"true\" />" ; 
		temp+="<param name=\"type\" value=\"application/x-java-applet;version=1.4\" />"; 
		temp+="<param name=\"mayscript\" value=\"true\" />" ; 
		temp+="<param name=\"profileid\" value=\"3\" />" ;
		temp+="<param name=\"pageContext\" value=\" "+ context +"\" />" ; 
		temp+="<param name=\"blockWidth\" value=\" "+ blockWidth +"\" />" ;
		temp+="<param name=\"blockHeight\" value=\" "+ blockHeight +"\" />" ;
		temp+="<param name=\"region1\" value=\""+bitmap+"\" />"; 
		temp+="</applet>";
		
	document.getElementById("applet").innerHTML = temp;
}

function insertEventApplet(pageContext, httpport)
{
	var string = "";
	string +='<applet code="Event.class" type="application/x-java-applet" archive="Event.jar" width="0" height="0" name="EventApplet" id="EventApplet">';
	string += '<param name="codebase" value="" />';
	string += '<param name="scriptable" value="true" />';
	string += '<param name="type" value="application/x-java-applet;version=1.4" />';
	string += '<param name="mayscript" value="true" />';
	string += '<param name="webEvent" value="1" />';
	string +=' <param name="pageContext" value="'+pageContext+'" />';
	string +=' <param name="RemotePort" value="'+httpport+'" />';
	string += '</applet>';
	
	document.getElementById("javaEVT").innerHTML = string;	
}

var statusReq;
var gameover = 0;

function TestsmtpMail(smtpServer, smtpUser, smtpPassword, smtpReveiver, smtpSender, smtpPort, smtpIterval, smtpAuth, obj)
{
	var urlXML = ""
	var protocol = "http";
		
	if(window.location.href.indexOf("ttps:") != -1)
		protocol = "https";
	
	if(typeof(doMask) == 'function')
      doMask(true, 'test');
	
	var url = protocol+"://"+window.location.hostname  + ":" + window.location.port+"/cgi/admin/test_mail_status.cgi?smtpServer="+smtpServer+"&smtpUser="+smtpUser+"&smtpPass="+smtpPassword+"&receiver="+smtpReveiver+"&sender="+smtpSender+"&smtpPort="+smtpPort+"&smtpInterval="+smtpIterval+"&smtpEncrypt="+smtpAuth;
	statusReq= $.ajax({
		url: url,
		type: 'GET',
		dataType: 'xml',
		error: function() {
			alert("something error !!!!!!!");
		},
		success: function(xml){
			doMask();
			if (gameover == 1) return;
			if(xml == null) return;
			var final = xml.getElementsByTagName('code')[0].firstChild.nodeValue;

			if(final=='testMailOk')
			{
				if(obj=="snap")
				{
					$("#test_statu_snap").html(testMailOk);
				}
				else if(obj=="vclip")
				{
					$("#test_statu_vclip").html(testMailOk);	
				}
			}
			else if(final=='testMailFault')
			{
				if(obj=="snap")
				{
					$("#test_statu_snap").html(testMailFail);
				}
				else if(obj=="vclip")
				{
					$("#test_statu_vclip").html(testMailFail);	
				}
			}
			resize();
		}
	});

}
var ftpstatusReq;
var ftpgameover = 0;
function TestFtpSend(ftpServer, ftpUser, ftpPass, folder, fixFile, ftpPort, passive, obj)
{
	var urlXML = ""
	var protocol = "http";
	var nowport = TdbHttpPort;
		
	if(window.location.href.indexOf("ttps:") != -1)
	{
		protocol = "https";
		nowport = TdbHttpsPort;
	}
	
	if(typeof(doMask) == 'function')
      doMask(true, 'test');
	
	var url = protocol+"://"+window.location.hostname  + ":" + window.location.port+"/cgi/admin/test_ftp_status.cgi?ftpServer="+ftpServer+"&ftpUser="+ftpUser+"&ftpPass="+ftpPass+"&folder="+folder+"&fixFile="+fixFile+"&ftpPort="+ftpPort+"&passive="+passive;
	
	ftpstatusReq= $.ajax({
		url: url,
		type: 'GET',
		dataType: 'xml',
		error: function() {
			alert("something error !!!!!!!");
		},
		success: function(xml){
			doMask();
			if (ftpgameover == 1) return;
			if(xml == null) return;
			var final = xml.getElementsByTagName('code')[0].firstChild.nodeValue;

			if(final=='testFtpOk')
			{
				if(obj=="snap")
				{
					$("#snap_test_ftp_statu").html(testFtpOk);
				}
				else if(obj=="vclip")
				{
					$("#vclip_test_ftp_statu").html(testFtpOk);	
				}
			}
			else if(final=='testFtpFault')
			{
				if(obj=="snap")
				{
					$("#snap_test_ftp_statu").html(testFtpFail);
				}
				else if(obj=="vclip")
				{
					$("#vclip_test_ftp_statu").html(testFtpFail);	
				}
			}
			resize();
		}
	});

}