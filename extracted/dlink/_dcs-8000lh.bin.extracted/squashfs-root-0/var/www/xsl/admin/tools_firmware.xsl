<?xml version="1.0" encoding="utf-8"?><!-- DWXMLSource="adv_network.xml" --><!DOCTYPE xsl:stylesheet  [
	<!ENTITY nbsp   "&#160;">
	<!ENTITY copy   "&#169;">
	<!ENTITY reg    "&#174;">
	<!ENTITY trade  "&#8482;">
	<!ENTITY mdash  "&#8212;">
	<!ENTITY ldquo  "&#8220;">
	<!ENTITY rdquo  "&#8221;"> 
	<!ENTITY pound  "&#163;">
	<!ENTITY yen    "&#165;">
	<!ENTITY euro   "&#8364;">
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="utf-8" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/>
<xsl:template match="/">
<html xmlns="http://www.w3.org/1999/xhtml">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<head>

<link rel="stylesheet" type="text/css" href="../basic.css" />
<link rel="stylesheet" type="text/css" href="../setup.css" />
<script language="JavaScript" src="../js/jquery.js" type="text/javascript"></script><script language="JavaScript" src="../js/make.js" type="text/javascript"></script>
<script language="JavaScript" src="../js/public.js" type="text/javascript"></script>
<script language="JavaScript" src="../js/frameAutoSize.js" type="text/javascript"></script>
<script language="JavaScript" src="../js/setupInit.js" type="text/javascript"></script>
<script language="JavaScript" type="text/javascript">
var updateConfirm = "<xsl:value-of select="root/lang/body/updateConfirm" />";
var updatingText = "<xsl:value-of select="root/lang/body/updatingText" />";
var updateError = "<xsl:value-of select="root/lang/body/filepathError" />";
var eth0Ipv4Address = "<xsl:value-of select="root/common/eth0Ipv4Addr" />";

var countdown=120;
var flag=0;
var progress = 1;

//var LevelOfTrust = '<xsl:value-of select="root/config/LevelOfTrust" />';

function initForm()
{ 
	var parUrl = parent.document.location.href;
	var url;
	var j = parUrl.indexOf("tools_firmware");
	if (j != -1) {
		url = parUrl;
	} else {
		j = parUrl.indexOf("?");
		parUrl = parUrl.substr(0, j + 1);
		parUrl += "nav=Maintain%%%side=tools_firmware";
		url = parUrl;
	}
	document.getElementById("divProgress").style.display ="none";
	if('<xsl:value-of select="/root/result/code" />' != "")
	{
		$('#messageTitle').show();
		$('#messageTitle').css("display","block;");
		$('.statusMessage').show();
	}
/*
	if('<xsl:value-of select="/root/result/code" />' == "updateStage1")
	{
		$('#uploadFW').hide();
		$('#FWInfo').show();
	} else {
		$('#uploadFW').show();
		$('#FWInfo').hide();
	}
*/
	if ('<xsl:value-of select="/root/result/code" />' == 'updateOK')
	{
		var IP_ADDR = window.location.hostname;
		if(eth0Ipv4Address == IP_ADDR)//current eth0 ipv4 == current url ip, start old process, auto reconnect.
		{
			$("#manreconnectmessage").hide();
			$("#countdownmessage").show();//show countdownmessage message
			needCountDown1(url,countdown,"leavetime", false);
		}
		else//start new porcess, only show result, and user manual reconnect.
		{
			$("#countdownmessage").hide();
			$("#manreconnectmessage").show();//show man reconnect
		}
	
		$("#upload2").attr("disabled" ,"disabled");
		$("#firmwareUpload").attr("disabled" ,"disabled");

		var camVersion = $("#spanVersion", window.parent.document);
               camVersion.html('<xsl:value-of select="root/common/version" />');
	}
/*
	if ('<xsl:value-of select="/root/config/StaticTrustLevel" />' == '0')
	{
		var index='<xsl:value-of select="root/config/LevelOfTrust" />'
		//$("LevelOfTrust")[index-1].attr("checked", "true")
		$(":radio[name=LevelOfTrust]").val([index]); 

	}
*/	
	resize();
}

function sendUpdate() 
{
	$('.statusMessage').hide();
	if(flag==1)
		return false;
	if(document.getElementById("upload2").value == "")
	{	
			alert(updateError);
			return;
	}
	if(confirm(updateConfirm))
	{
		flag=1;
		var updateForm = document.updateForm;
		updateForm.submit();
		document.getElementById("messageTitle").style.cssText = "display:block";
		document.getElementById("updating").innerHTML = updatingText ;
		firmwareUpdate();
	}
}
/*
function contiUpdate(continueUpdate) 
{alert(continueUpdate);

	$("#UpdateContinue").val(continueUpdate);
	alert($("#UpdateContinue").val());
	var confirmForm = document.confirmForm;
		
	confirmForm.submit();
	document.getElementById("messageTitle").style.cssText = "display:block";
	document.getElementById("updating").innerHTML = updatingText ;
	firmwareUpdate();

}
*/
function firmwareUpdate()
{
	document.updateForm.firmwareUpload.disabled=true;	
	document.updateForm.upload.disabled=true;
	$("#divProgress").css("display","block");
	document.getElementById("progress").innerHTML = '<xsl:value-of select="root/lang/body/progress" />' +　":";
	resize();
	IntID = window.setInterval("proceeding()",1800);
}
function proceeding() 
{
	progress = progress+1;
	
	if (progress == 100)
		progress = 99;
	document.getElementById("bar").style.width = progress + "px";
	
	var percent = "" + progress + "%";
	document.getElementById("progressText").innerHTML = percent;
}
</script>
</head>
<body onload="initForm();resize()">
<div class="subFrameBody" id="subFrameBody">
	<div class="mainFrameBorder" id="mainFrameBorder">
		<div class="main" id="main">
			<div class="pageTitle"><xsl:value-of select="root/lang/body/pageTitle"/></div>
			<div class="title" id="messageTitle">
				<div class="tHeader">
					<xsl:value-of select="root/lang/body/firmwareUpgrade" />
				</div>
				<div class="tText">
					<div class="description">
					<xsl:value-of select="root/lang/body/description1" />
					<a href="http://support.dlink.com/" target="_blank"><xsl:value-of select="root/lang/body/description2" />
					</a>
					<xsl:value-of select="root/lang/body/description3" />
					<xsl:value-of select="root/lang/body/description4" />
					</div>  
					<span id="updating" class="updatingMsg"></span>  
					<div class="statusMessage">
						<xsl:if test="/root/result/code = 'rebootFail'">
							<xsl:value-of select="root/lang/message/rebootFail" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'rebootOK' or /root/result/code = 'resetOK'">
							<xsl:value-of select="root/lang/message/rebootOK" />
							<br />
							<xsl:value-of select="root/lang/body/reboot1" />
							<span name="leavetime" id="leavetime"></span>
							<xsl:value-of select="root/lang/body/reboot2" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'resetFail'">
							<xsl:value-of select="root/lang/message/resetFail" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'calibrationOK'">
							<xsl:value-of select="root/lang/message/calibrationOK" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'updateOK'">
							<strong><xsl:value-of select="root/lang/message/updateOK" /></strong>
							<br />
							<span id="countdownmessage">
								<xsl:value-of select="root/lang/body/reboot1" />
								<span name="leavetime" id="leavetime"></span>
								<xsl:value-of select="root/lang/body/reboot2" />	
							</span>
							<span id="manreconnectmessage">
								<xsl:value-of select="root/lang/message/saveOK" />
							</span>						 
						</xsl:if>
						<xsl:if test="/root/result/code = 'uploadFail'">
							<xsl:value-of select="root/lang/message/uploadFail" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'examFail'">
							<xsl:value-of select="root/lang/message/examFail" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'infoFail'">
							<xsl:value-of select="root/lang/message/infoFail" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'signFail'">
							<xsl:value-of select="root/lang/message/signFail" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'decryptFail'">
							<xsl:value-of select="root/lang/message/decryptFail" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'uploadDecrypt'">
							<xsl:value-of select="root/lang/message/uploadDecrypt" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'uploadSign'">
							<xsl:value-of select="root/lang/message/uploadDecrypt" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'invalidImage'">
							<xsl:value-of select="root/lang/message/invalidImage" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'importOK'">
							<xsl:value-of select="root/lang/message/importOK" />
							<br />
							<xsl:value-of select="root/lang/body/reboot1" />
							<span name="leavetime" id="leavetime"></span>
							<xsl:value-of select="root/lang/body/reboot2" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'invalidDB'">
							<xsl:value-of select="root/lang/message/invalidDB" />
						</xsl:if>
						<xsl:if test="/root/result/code = 'noDB'">
							<xsl:value-of select="root/lang/message/noDB" />
						</xsl:if>
						&nbsp;
					</div>	
				</div>
				<div class="tFooter"></div>
			</div><!--1st title end-->
			<div class="group">
				<div class="gHeader">
					<xsl:value-of select="root/lang/body/firmwareInfo" />
				</div>
				<div class="gText">
                	<div><span class="w3 w_firmware h1"><xsl:value-of select="root/lang/body/firmwareVersion" /></span><span class="h1"><xsl:value-of select="root/common/version" /></span></div>
                    <div><span class="w3 w_firmware h1"><xsl:value-of select="root/lang/body/firmwareProduct" /></span><span class="h1"><xsl:value-of select="/root/common/build" /></span></div>
<!--
<xsl:if test="/root/common/peripheral/PT = '1'">
					<div><span class="w3 w_firmware h1"><xsl:value-of select="root/lang/body/mcufirmware" /></span><span class="h1"><xsl:value-of select="/root/config/mcuVersion" /></span></div>
</xsl:if>
-->
					<xsl:if test="/root/common/optAgent/version != ''">
						<div><span class="w3 w_firmware h1"><xsl:value-of select="root/lang/body/agentVersion" /></span><span class="h1"><xsl:value-of select="/root/common/optAgent/version" /></span></div>
					</xsl:if>
				</div>
				<div class="gFooter"></div>
			</div><!--group end-->
			<form enctype="multipart/form-data" method="post" action="update.cgi" name="updateForm">
			<div class="group">
				<div class="gHeader">
					<xsl:value-of select="root/lang/body/firmwareUpgrade" />
				</div>
				<div class="gText">
					
					<div class="indent0">
                    	<xsl:value-of select="root/lang/body/filePath" />
                            <input name="upload" type="file" id="upload2" value=""  style="width:200px;" />
                            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp; 
                            <input name="firmwareUpload" id="firmwareUpload" value="{root/lang/body/upload}" type="button" onclick="return sendUpdate()" />
                            &nbsp; &nbsp;
							<div id="divProgress">
								<span id="progress"></span>&nbsp;
                            	<span id="bar" style="background-image:url(../images/progress.jpg); display:inline-block; width:0px; height:20px; line-height:20px;">&nbsp;</span>&nbsp;&nbsp;
                            	<span align="left" id="progressText">1%</span>
							</div>	             
                    </div>
				</div>
				<div class="gFooter"></div>
			</div><!--group end-->
			</form>
		</div><!--main end-->
		<div class="helpBar" id="helpBar">
			<div class="helpBarTitle"><xsl:value-of select="root/lang/hint/helpfulHints" /></div>
			<xsl:value-of select="//hint/description1" />
			<a href="http://support.dlink.com/" target="_blank"><xsl:value-of select="//hint/description2" /></a>
			<xsl:value-of select="//hint/description3" />   
		</div><!--helpBar end-->
	</div><!--mainFrame end-->
<div class="clear"></div>
</div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
