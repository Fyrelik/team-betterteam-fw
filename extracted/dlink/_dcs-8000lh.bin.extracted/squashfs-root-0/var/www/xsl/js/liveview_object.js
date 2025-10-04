var usePPapi = isPPapiChrome(); //chrome 45 and later use ppapi
var useHTTPS = (document.location.protocol=='https:');
var loadPNaCL = false;
var NaClPlay = false;
var NaClSnapshot = false;
var NACLSnapshotURL = null;
var tNACLcon = false; //FIXME: on talk for test two-way audio
var MotionTrigger = 0;
var SpeakerOccupied = false;
var MDAreas = new Array("MdArea_1","MdArea_2","MdArea_3","MdArea_4","MdArea_5");
var MDborders = new Array("1px solid #FF0000","1px solid #008000","1px solid #0000FF","1px solid #FFFF00","1px solid #FF00FF");
var MDbgColors = new Array("#FF6666","#32CD7F","#6495ED","#FFFFCC","#FF69BE");

function isPPapiChrome()
{
/*
*check whether ppapi function is on firstly
*/
	if(typeof(PPAPI_on) === "undefined" || !PPAPI_on)
		return 0;

/*
*for security issue,chrome ver 44 above use ppapi instead of npapi
*/
	var browserInfo = navigator.userAgent.toLowerCase(),
		isChrome = /chrome/i.test(browserInfo),
		ver = isChrome && (browserInfo.match(/chrome\/([\d.]+)/))[1];

	return (isChrome && parseInt(ver,10) > 44);
}

function hideDOMById(id)
{
	var o = document.getElementById(id);
	if(o)o.style.display = "none";
}

function showDOMById(id)
{
	var o = document.getElementById(id);
	if(o)o.style.display = "";
}

function updateDOMById(id, text)
{
	var o = document.getElementById(id);
	if(o)o.innerHTML = text;
}

function NaClLoad()
{
	npluginTalk = document.getElementById("nacl_talker");
	if(useHTTPS && npluginTalk)
	{
		/*--FIXME:for two-way audio deamon--*/
		npluginTalk.addEventListener('load', tNaClLoad, true);
		npluginTalk.addEventListener('error', tNaClError, true);
		npluginTalk.addEventListener('crash', tNaClCrash, true);
		npluginTalk.addEventListener('message', tNaClMessage, true);
		npluginTalk.innerHTML = '<embed id="t_talker" type="application/x-pnacl" width="0" height="0" path="./" src="/websocket_audio_upload.nmf"></embed>';
	}
	else
	{
		showDOMById("liveviewImg");
		hideDOMById("nacl_status");
		loadPNaCL = true;
	}
}

function NaClError()
{
	loadPNaCL = true;
	hideDOMById("nacl_status");
	if(typeof clientObj === 'undefined' || !clientObj.isLiveView)
		return;
	setTimeout(function(){
		window.location.reload();
	}, 3000);
	return;
}

function NaClCrash()
{
	loadPNaCL = true;
	hideDOMById("nacl_status");
	if(typeof clientObj === 'undefined' || !clientObj.isLiveView)
		return;
	setTimeout(function(){
		window.location.reload();
	}, 3000);
	return;
}

function NaClStatusCode(status)
{
	var code = 0;
	switch(status)
	{
		case 'on':
			code = 1;
			break;
		case 'off':
			code = 0;
			break;
		case 'fail':
			code = -1;
			break;
		default:
			break;
	}

	return code;
}

function NaClMotionTrigger(status)
{
	var doFlag = false;
	if(status == 'on')
	{
		if(!MotionTrigger)
			doFlag = true;
		MotionTrigger++;
	}
	else
	{
		if(MotionTrigger)
			MotionTrigger--;
		if(!MotionTrigger)
			doFlag = true;
	}

	return doFlag;
}

function NaClHTTPSRedirect()
{
	if(useHTTPS || typeof clientObj === 'undefined' || !clientObj.isLiveView)
		return;
	if(TdbHttpPort != clientObj.port)
	{//FIXME:need more work later
		$('#talkwarn a').css('text-decoration', 'none');
		return;
	}
	var httpsURI = 'https://';
	httpsURI += window.location.hostname;
	httpsURI += ':';
	httpsURI += TdbHttpsPort;
	window.location.href = httpsURI;
}

function NaClMessage(msgEvent)
{

	if(typeof clientObj === 'undefined' || !clientObj.isLiveView)
		return;

	switch(typeof msgEvent.data)
	{
		case 'string':
			{
				console.log("Recv :"+msgEvent.data);

				if(msgEvent.data == "snapshot success")
				{
				/*
				*when received snapshot message, the pnacl
				*would send image stream data next
				*/
					NaClSnapshot = true;
				}
				else if(msgEvent.data == "NoFrame")
				{
				/*
				*this would happen when the resolution was changed
				*/
					window.location.reload();
					return;
				}
				else
				{
				/*
				*message like 'type:value'
				*/
					var _params = msgEvent.data.split(':');
					if(_params.length < 2)
						return;
					switch(_params[0])
					{
						case 'recording stop':
							{

								if(clientObj.isOnRecord)//perhaps reach the limit
								{
									clientObj.isOnRecord = false;
									StatusNow['record'][0] = 0;
									btn.clickOnOff(document.recordButton, 0);
									btn.setTitle(document.recordButton, wording['record'].off);
								}

								if(_params[1] == 'Occupied.')
								{//limitation: only one local recording each time
									alert(wording['recording_err0'].alt);
								}
								else
								{
									clientObj.recorder.stop();
								}
								break;
							}
						case 'motion_detected_1':
							{
								if(!NaClMotionTrigger(_params[1]))
									break;
								OnNotifyMotionDetection(1, NaClStatusCode(_params[1]));
								break;
							}
						case 'in_recording':
							{
								OnNotifyInRecording(NaClStatusCode(_params[1]));
								break;
							}
						case 'gp_input_1':
						case 'gp_input_2':
						case 'gp_input_3':
							{
								var gparr = _params[0].split('_');
								OnNotifyGPInput(parseInt(gparr[2], 10), NaClStatusCode(_params[2]));
								break;
							}
						case 'audio_detected':
							{
								if(!NaClMotionTrigger(_params[1]))
									break;
							}
						case 'gp_input_0':
						case 'irled':
							{
								OnNotify(_params[0], NaClStatusCode(_params[1])+'');
								break;
							}
						case 'speaker_occupied':
							{
								SpeakerOccupied = NaClStatusCode(_params[1])?true:false;
								break;
							}
						default:
							break;
					}
				}
			}
			break;
		case 'object':
			{
				if(NaClSnapshot)
				{
					if(NACLSnapshotURL)
					{
						URL.revokeObjectURL(NACLSnapshotURL);
						NACLSnapshotURL = null;
					}
					var oMyBlob = new Blob([msgEvent.data],{type:"image/jpeg"});
					NACLSnapshotURL = URL.createObjectURL(oMyBlob);
					NaClSnapshot = false;
					NaClGetSnapshot(parseInt(clientObj.pData[clientObj.onPfile].height,10)+100, parseInt(clientObj.pData[clientObj.onPfile].width,10)+100);
				}
			}
			break;
		default:
			break;
	}
}

/*
*FIXME: for two-way audio test
*/
function tNaClLoad()
{
	console.log("nacl talker load.");
	showDOMById("liveviewImg");
	hideDOMById("nacl_status");
	loadPNaCL = true;
}

function tNaClError()
{
	console.log("nacl talker error.");
}

function tNaClCrash()
{
	console.log("nacl talker crash.");
}

function tNaClMessage(msgEvent)
{
	switch(typeof msgEvent.data)
	{
		case 'string':
			{
				if(msgEvent.data == "lost connection")
				{
					Stream_OnStreamOutNotify(3);
				}
				else
					console.log(msgEvent.data);
			}
			break;
		default:
			break;
	}
}

function NaClVisible()
{
	if(NaClPlay && typeof clientObj !== 'undefined')
	{
		if(document['visibilityState'] == 'hidden')
		{
			clientObj.closeClient(1);
		}
		else
		{
			clientObj.run();
		}
	}
}

function NaClZoom(scale)
{
	if(typeof clientObj !== 'undefined')
	{
		clientObj.setZoom(scale);
	}
}

/*
*for recording
*/

function NaClGetSnapshot(h, w)
{
	var limit_h = window.screen.availHeight-30,
		limit_w = window.screen.availWidth-10;

	if(h>limit_h) h = limit_h;
	if(w>limit_w) w = limit_w;

	var t = (limit_h-h)/2,
		l = (limit_w-w)/2,
		X=window.open("_Snapshot", "_Snapshot","titlebar=no, toolbar=no, location=no, status=no, menubar=no, directories=no, width="+w+", height="+h+", top="+t+", left="+l);
	X.document.write('<iframe frameborder="0" style="height:'+(h-20)+';width:100%; overflow:auto;" src="snapshot.html?d='+encodeURI(wording.download.alt)+'&s='+NACLSnapshotURL+'"></iframe>');
	X.document.close();
}

function NaClRecorder()
{

	var _lrec = this;

	_lrec.quota = 500 * 1024 * 1024;
	_lrec.name = "rec.avi";

	var _lgetName = function(){
		var fullBit = function(b){
			var v = parseInt(b, 10);
			return (v<10?'0':'')+v;
		}

		var date = new Date(),
			e_name = date.getFullYear().toString();

		e_name += fullBit(date.getMonth()+1);
		e_name += fullBit(date.getDate());
		e_name += '_'+fullBit(date.getHours());
		e_name += fullBit(date.getMinutes());
		e_name += fullBit(date.getSeconds());
		e_name += '.avi';

		return e_name;
	}

	var _lexportFile = function(path, name){
		if(typeof path !== 'string' || typeof name !== 'string')
			return;

		var e_elem = document.createElement('a'),
			e_event = document.createEvent('MouseEvents');

		e_elem.href = path;
		e_elem.download = name;
		e_event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		e_elem.dispatchEvent(e_event);
	}

	var _lgetFile = function(path)
	{
		window.webkitRequestFileSystem(window.PERSISTENT, _lrec.quota, function(recfs){
			recfs.root.getDirectory(path, {}, function(dirEntry) {
				var dirReader = dirEntry.createReader();
				var entries = [];
				var _lreadEntries = function(){
					dirReader.readEntries(function(results) {
						if (!results.length)
						{
							_lshowResult(entries);
						}
						else
						{
							entries = entries.concat(_ltoArray(results));
							_lreadEntries();
						}
					},
					function(){console.log('readEntries error');});
				}
				var _ltoArray = function(list) {
				  return Array.prototype.slice.call(list || [], 0);
				}
				var _lshowResult = function(entries){			
					if(entries.length == 0)
					{
						return;
					}
					entries.forEach(function(entry, index) {
						if(_lisRecFile(entry.name))
						{
							_lexportFile(entry.toURL(), _lrec.name);
							return false;
						}
					});				  
				}
				var _lisRecFile = function(file)
				{
					var _f_arr = file.split('/'),
						_mtype = _f_arr[_f_arr.length-1];
					if(_mtype == 'record')
						return true;
					return false;
				}
				_lreadEntries();
			},
			function(){
				console.log("get directory error!");
			});
		},
		function(){console.log('requestFileSystem error');});
	}

	_lrec.start = function(callback)
	{

		if(! navigator.webkitPersistentStorage)
		{
			console.log("the browser does not support record action.");
			return;
		}

		_lrec.name = _lgetName();
		navigator.webkitPersistentStorage.queryUsageAndQuota(function(used, limit){
			console.log('Allocated: '+limit+'  used:'+used);
			if(_lrec.quota > limit)
			{
				navigator.webkitPersistentStorage.requestQuota(_lrec.quota,
					function(grantedBytes){
					//Note: the grantedBytes may not equal to quota you request
						console.log('Allocated '+grantedBytes+' bytes of persistant storage.');
						if(callback)callback();
					},
					function(e){
					console.log("request quota error!");
				});
			}
			else
			{
				if(callback)callback();
			}
		}, function(e){
			console.log("query quota error!");
		});
	}

	_lrec.stop = function()
	{
		_lgetFile('/');
	}
}

function makeMessage(command, path)
{ 
/*
*Package a message using a simple protocol containing:
* [command, <path>, <extra args>...]
*/
	var msg = [command, path];
	for (var i = 2; i < arguments.length; ++i) 
	{
		msg.push(arguments[i]);
	}

	return msg;
}

function setMotionBox_area(enableMap,area)
{
	
	var i;
	for(i = 1; i <=5; i++ )
		 $("#divembeddNP .motion_box_"+i).remove();
	
	$("#divembeddNP").css({
		'position': 'absolute',
		'height':360+'px',
		'width':480+'px',
		'float':'left'})
		.append("<ol id='motion_box_1'></ol><ol id='motion_box_2'></ol><ol id='motion_box_3'></ol><ol id='motion_box_4'></ol><ol id='motion_box_5'></ol>");


	var m_box1 = $("#motion_box_1"),
		m_box2 = $("#motion_box_2"),
		m_box3 = $("#motion_box_3"),
		m_box4 = $("#motion_box_4"),
		m_box5 = $("#motion_box_5");
		
	m_box1.html('');
	m_box2.html('');
	m_box3.html('');
	m_box4.html('');
	m_box5.html('');

	m_box1.selectable({
				 appendTo: '#motion_box_1',
				 autoRefresh: true,
				 rectCor:{"winIdx":1,"befRectID":"MdArea_1","rectID":"area1","borderCor":"1px solid #FF0000","dbCor":"#FF6666"},
			/*	 selected: function(event, ui) {
					var id_name = "#"+ui.selected.id;
				//	console.log(id_name);
					//console.log(this.className)
					/*console.time('id direct');
					$(id_name).html();
					console.timeEnd('id direct');
					console.time('id by');
					$(id_name, this).html();
					console.timeEnd('id by');*/
				//	$(id_name).removeClass(Add_class).addClass('ui-selected-sel_1');
				// },*/
				 selecting:function(){
				 	console.log("remove mdarea_1");
				//	$("#MdArea_1").remove();
					$('.ui-selectable-helper').css({'z-index':99999});

				/*	$('.ui-selected-sel_1').each(function(){
						$(this).removeClass('ui-selected-sel_1').addClass('ui-selected-none');
					});*/
					
					
				 }
				});
	m_box2.selectable({
				 appendTo: '#motion_box_2',
				 autoRefresh: true,
				 rectCor:{"winIdx":2,"befRectID":"MdArea_2","rectID":"area2","borderCor":"1px solid #008000","dbCor":"#32CD7F"},
				 selecting:function(){
				// 	$("#MdArea_2").remove();
					$('.ui-selectable-helper').css({'z-index':99999});
				 }
				});
	m_box3.selectable({
				 appendTo: '#motion_box_3',
				 autoRefresh: true,
				 rectCor:{"winIdx":3,"befRectID":"MdArea_3","rectID":"area3","borderCor":"1px solid #0000FF","dbCor":"#6495ED"},
				 selecting:function(){
				// 	$("#MdArea_3").remove();
					$('.ui-selectable-helper').css({'z-index':99999});
				 }
				});
	m_box4.selectable({
				 appendTo: '#motion_box_4',
				 autoRefresh: true,
				 rectCor:{"winIdx":4,"befRectID":"MdArea_4","rectID":"area4","borderCor":"1px solid #FFFF00","dbCor":"#FFFFCC"},
				 selecting:function(){
				 //	$("#MdArea_4").remove();
					$('.ui-selectable-helper').css({'z-index':99999});
				 }
				});
	m_box5.selectable({
				 appendTo: '#motion_box_5',
				 autoRefresh: true,
				 rectCor:{"winIdx":5,"befRectID":"MdArea_5","rectID":"area5","borderCor":"1px solid #FF00FF","dbCor":"#FF69BE"},
				 selecting:function(){
				 //	$("#MdArea_5").remove();
					$('.ui-selectable-heper').css({'z-index':99999});
				 }
				});
	drawMotionArea(enableMap,area);
}
function drawMotionArea(enableMap,area)
{
	for(var i = 0; i < 5; i++)
	{
		if(area[i].x == 0 &&area[i].y == 0&&area[i].w == 0&&area[i].h == 0)
			continue;
		var cooridateS = coverCooridate(area[i],2,nativeW,nativeH,i+1);
		var rect= new Array();
		rect=cooridateS.split(",");
		var isShow;
		if(enableMap[i] ==1)
			isShow = "";
		else
			isShow = "none"

		
	//	console.log("window_"+i+" dispaly is "+isShow+area[i]);
			
		$("<div id=\""+MDAreas[i]+"\" </div>").css({
			"position": "absolute",
			"top":rect[1]+"px",
			"left":rect[0]+"px",
			"height":rect[3]+"px",
			"width":rect[2]+"px",
			"border": MDborders[i],
			"background-color":MDbgColors[i],
			"display":isShow
		}).appendTo("#motion_box_"+(i+1));

			$("#"+MDAreas[i]).append(i+1);
			$("#"+MDAreas[i]).addClass("MDflag");
				
	}		
}
function set_top_index(n)
{
//	console.log("set_top_index:"+n);
	var zMap = [51, 52, 53, 54, 55],
		cacheDOM = null;
	for(var i=0; i<5; i++)
	{
		if(i == n)
		{
			$("#motion_box_"+(i+1)).css({'z-index':99/*, 'opacity':'.7'*/});
		}
		else
		{
			cacheDOM = $("#motion_box_"+(i+1));
			if(cacheDOM.css('z-index') == 99)
			{
				cacheDOM.css({'z-index':zMap[i]/*, 'opacity':'.7'*/});
			}
		}
	}
}
function setMotionBox(mdata)
{

	 $("#divembeddNP .motion_box").remove();

	$("#divembeddNP").css({
		'height':p[initProfile].height+'px',
		'width':p[initProfile].width+'px'})
		.append("<ol class='motion_box'></ol>");

	var  m_s = "",
		m_class = "",
		m_li = "",
		m_c = 0,
		m_top = 0,
		m_left = 0,
		m_wn = 10,
		m_hn = 30,
		m_wbl = p[initProfile].width / (4*m_wn),
		m_hbl = p[initProfile].height / m_hn,
		m_box = $("#divembeddNP .motion_box");

	for(var i=0; i<m_hn; i++)
	{
		m_s = mdata.substr(i*m_wn, m_wn);
		for(var j=0; j<m_wn; j++)
		{
			m_c = parseInt(m_s[j], 16);
			for(var k=3;; k--)
			{
				m_class = (m_c&(0x01<<k)?'ui-selected-sel':'ui-selected-none');
				m_top = i*m_hbl;
				m_left = (4*j+3-k)*m_wbl;
				m_li = "<li style='top:"+m_top+"px; left:"+m_left+"px; width:"+(m_wbl-1)+"px; height:"+(m_hbl-1)+"px;' class=\""+m_class+"\" id=\"md_n"+i+"_"+j+"_"+(3-k)+"\"></li>";
				m_box.append(m_li);

				if(k == 0)break;
			}
		}
	}

	M_UI_CLASS = 'ui-selected-sel';
	m_box.selectable({
		autoRefresh: true,
		selected: function(event, ui) {
			var id_name = "#"+ui.selected.id;
			$(id_name, this).removeClass('ui-selected-sel ui-selected-none').addClass(M_UI_CLASS);
		},
		selecting:function(){
			$('.ui-selectable-helper').css({'z-index':99999});
		}
	});
}

function getMotionData()
{

	var m_s = "",
		m_c = 0,
		m_wn = 10,
		m_hn = 30,
		m_base = ['A', 'B', 'C', 'D', 'E', 'F'],
		m_box = $("#divembeddNP .motion_box")[0];
		
		for(var i=0; i<m_hn; i++)
		{
			for(var j=0; j<m_wn; j++)
			{
				m_c = 0;

				for(var k=0; k<4; k++)
				{
					if($("#md_n"+i+"_"+j+"_"+k, m_box).hasClass("ui-selected-sel"))
					{
						m_c |= (0x01<<(3-k));
					}
				}
				
				if(m_c > 9) m_c = m_base[m_c-10];
				m_s += m_c; 
			}
		}

	return m_s;
}
function profile(codec, width, height,fps,rtspUrl) //profile data object
{
	this.codec = codec;
	this.width = width;
	this.height = height;
	this.fps = fps;
	this.rtspUrl = rtspUrl;
}

function srvData(auth,product,ptEnable,micEnable,rtspPort,isIE,httpPort,httpsPort,isPT,motionMode)
{
	if(productoem == "Alphanetworks" || productoem == "Trendnet") 
		this.auth = base64decode1(auth); 
	else 
		this.auth = "Basic "+auth; 

	this.isIE = isIE;
	this.product = product;
	this.pt = ptEnable;
	this.mic = micEnable;
	//this.audio = audioEnable;
	this.proxy = true;
	this.rtspPort = rtspPort;
	this.httpPort = httpPort;
	this.httpsPort = httpsPort;
	if(isPT == 'undefined' || isPT == null)
		this.isPT = 1	
	else
		this.isPT = 0;
		
	if(motionMode == 'undefined' || motionMode == null)
		this.isMotion = 0;	
	else
		this.isMotion = motionMode;
}

function getStandardIP()
{
	var localip = location.hostname;
	var correctip ="";
	if(localip.indexOf(":") != -1)
	{
		if(localip.indexOf('[') != -1)
		{
			correctip = location.hostname;
		}
		else
		{
			correctip = '['+ localip+']';
		}
	}
	else
	{
		correctip = location.hostname;
	}
	return correctip;
}

var zoomObj;

function PlugIn(id,initProfile, pData,camData, resize, statusNow) //PlugIn class
{
	var object = document.getElementById(id);

	this.pData = pData;
	this.camData = camData;
	this.resize = resize;
	this.modelName = camData.product
	//status now
	this.isOnRecord = false;
	this.isAudio = false;
	if(statusNow && statusNow["audio"][0] == '1')
		this.isAudio = true;	
	this.onPfile = initProfile;
	this.isTalk = false;
	this.zoom;
	if(window.location.href.indexOf("ttps:") != -1)
	{
		if(window.location.port == "")
			this.port = 443;
		else
			this.port = parseInt(window.location.port);
		object.SetConnectProtocol(1);
	}
	else
	{
		if(window.location.port == "")
			this.port = 80;
		else
			this.port = parseInt(window.location.port);
		object.SetConnectProtocol(0);
	}
	
	var head = window.location.protocol  + "//" + window.location.hostname;

	this.init = function()
	{

		if(!object) return false;
		if(navigator.appVersion.indexOf("Mac") == -1)
		{
			object.AllowDblClickFullScreen = 0;
			var ProxyEnable = object.GetIEProxyEnable();
			var proxy = object.GetIEProxy();
			var proxyport = object.GetIEProxyPort();
			object.UseProxy(ProxyEnable);
			if(camData.proxy == "1")
			{
				object.Proxy = proxy;
				object.ProxyPort = proxyport;
			}
			var ifbypass = object.GetIEBypassEnable();
			var proxyexception = object.GetIESpecifiedBypass();
			object.UseBypass(ifbypass);
			object.SpecifiedBypass = proxyexception;
		}
		
		object.RemoteHost=getStandardIP();
		
		object.RemotePort = this.port;
		
		if(productoem == "Alphanetworks" || productoem == "Trendnet")
		{
			var getauth = camData.auth.split(":"); 
			object.Username = getauth[0];
			var userlength = getauth[0].length;
			object.Password = camData.auth.substring(userlength+1);
			//object.Password = getauth[1];
			object.SetAuxAuthType(4,"");
		}
		else
			object.SetAuthentication(camData.auth);
		//object.DynamicProfile(1);
		//for Digital Zoom
		//if (camData.pt == 0)
		//	object.EnableDigitalZoom(1);
		if (camData.pt == 1)
		{
			if(navigator.appVersion.indexOf("Mac") == -1)
				object.EnablePTWnd(1);
		}
		object.ModelName = this.modelName;
		if(this.isLiveView)
			this.initAdjest();
		this.setProfile(this.onPfile);

		var path = readCookie('savePath');
		if (path != "null")
			object.StoringPath = path;
	
		if(this.zoom)
			this.zoom.setupID(object.id);

		if(this.camData.isMotion)
		{
			object.MDWidth = 640;
			object.MDHeight = 480;
			object.MBCX = 16;
			object.MBCY = 16;
			object.ShowMotionDetectionInput();
		}
		this.notificationStart();
		return this.onPfile;

	};
	this.privacy = function()
	{
		this.notificationStart();
	}
	this.setZoom = function(wording)
	{
		this.zoom = new digiZoom(wording,this.modelName);	
	}
	this.run = function()
	{
		object.LiveStreamIn(1);//win+mac
		if(navigator.appVersion.indexOf("Mac") == -1)//win
		{
			object.AllowDblClickFullScreen = 0;	
		}
		else//mac
		{
			object.AllowDblClickFullScreen = 1;	
		}
		this.setAudio(this.isAudio);
		
	};
	this.setAudio = function(isOn)
	{
		this.isAudio = isOn;
		
		if(isOn) {
			//object.SetAudioStreamType(2); // 0: PCM, 1: MULAW, 2: ADPCM, 3: AAC
			if(navigator.appVersion.indexOf("Mac") == -1) //win
			{
				object.SetAudioStreamType(0); //use PCM
			}
			else //mac
			{
				if(pData[this.onPfile].codec == 'mp4' || pData[this.onPfile].codec == 'h264')
					object.SetAudioStreamType(3); //use AAC
				else
					object.SetAudioStreamType(3); // ADPCM can't record, still use AAC 
			}
			object.LiveStreamIn(2);
		}
		else
			object.StopLiveStreamIn(2);
		
	};
	this.snapshot = function()
	{
		
		object.Snapshot();
	};
	this.recording = function(isOn)
	{
		this.isOnRecord = isOn;
		
		object.IntervalType = 0;
		object.RecordingFileInterval = 60;
		object.RecordLoop = 1;
		if(navigator.appVersion.indexOf("Mac") != -1) //mac
		{
			if(pData[this.onPfile].codec == 'mp4' || pData[this.onPfile].codec == 'h264')
				object.RecordFileType = 1;  //use mp4
			else
				object.RecordFileType = 0;  //use avi
		}
		
		if(isOn)
		{
			if(micstatus == 1 && this.isAudio)
				object.RecordStreamIn(0);
			else
				object.RecordStreamIn(1);
		}
		else
			object.StopRecordStreamIn(0);	
	};
	this.StartNotification = function()
	{
		object.StartNotification();
	};
	this.fullscreen = function()
	{
		if(pData[this.onPfile].width > 800)
			largeLiveVedio = true;
		else
			largeLiveVedio = false;
		if(navigator.appVersion.indexOf("Mac") == -1)//win + NP
		{
			object.SetFullScreen(1);	
		}
		else//mac + NP
		{
			var a;
			var b;
			if(window.innerWidth > window.innerHeight && (window.innerWidth/window.innerHeight) > (p[clientObj.onPfile].width/p[clientObj.onPfile].height))
			{
			 	a = window.innerHeight / p[clientObj.onPfile].height;
				b =1;
			}
			else
			{
				a = window.innerWidth / p[clientObj.onPfile].width;
				b = 0;
			}
			a -= 0.05;
			document.getElementById("fullScreen").style.display = "none";
			document.getElementById("header").style.display = "none";
			document.getElementById("banner").style.display = "none";
			document.getElementById("navBar").style.display = "none";
			document.getElementById("sideBar").style.display = "none";
			document.getElementById("title").style.display = "none";
			document.getElementById("gHeader").style.display = "none";
			document.getElementById("liveviewImg").style.display = "none";
			document.getElementById("divZoom").style.display = "none";
			document.getElementById("footbar").style.display = "none";
			document.getElementById("gFooter").style.display = "none";
			document.getElementById("copyright").style.display = "none";
			document.getElementById("ncscontrol").width = p[clientObj.onPfile].width * a + "px";
			document.getElementById("ncscontrol").height = p[clientObj.onPfile].height * a + "px";
			document.getElementById("frameimage1").style.display = "none";
			document.getElementById("frameimage2").style.display = "none";
			document.getElementById("frameimage3").style.display = "none";
			document.getElementById("frameimage4").style.display = "none";
			document.body.style.background = "#000000";
			document.getElementById("group").style.background = "#000000";
			document.getElementById("main").style.background = "#000000";
			document.getElementById("group").style.border = "0px solid #000000";
			document.getElementById("mainBlockFrame").style.background = "#000000";
			document.getElementById("mainFrame").style.background = "#000000";
			document.getElementById("contentBorder").style.background = "#000000";
			document.getElementById("contentBlock").style.background = "#000000";
			document.getElementById("mainpage").style.background = "#000000";
			if(productoem == "D-Link")
			{
				document.getElementById("contentBorder").style.width = 0 +"px";
				document.getElementById("contentBorder").style.height = 0 +"px";
			}
			document.getElementById("contentBorder").style.marginLeft = 0 + "px";
			document.getElementById("contentBlock").style.marginLeft = 0 + "px";
			document.getElementById("mainFrame").style.marginLeft = 0 + "px";
			if(b==1)
			{
				document.getElementById("mainpage").style.width = document.getElementById("ncscontrol").width;
				document.getElementById("mainpage").style.height = document.getElementById("ncscontrol").height;
				document.getElementById("main").style.minHeight = document.getElementById("ncscontrol").height;
				document.getElementById("group").style.height = document.getElementById("ncscontrol").height;
				var c = window.innerWidth - document.getElementById("mainBlockFrame").offsetWidth;
				document.getElementById("mainBlockFrame").style.minHeight = document.getElementById("ncscontrol").height;
				document.getElementById("mainBlockFrame").style.marginLeft = c/2 + "px";
			}
			else
			{
				document.getElementById("mainBlockFrame").style.width = document.getElementById("ncscontrol").width;
				var c = window.innerHeight - document.getElementById("ncscontrol").offsetHeight;
				document.getElementById("ncscontrol").style.marginTop = c/2 + "px";
				document.getElementById("contentBlock").style.width = document.getElementById("ncscontrol").width;
			}
		}
	};
	this.setPath  = function(path)
	{
		var temp;
		if(path == "null" || path == "undefined")
		{
		    temp = object.SelectDirectory(object.StoringPath);
			if(temp != object.StoringPath && temp != "" && temp != null)
				object.StoringPath = temp
		}
		else
		{
		 	temp = object.SelectDirectory(path);
			if(temp != "" && temp != null)
			{
				object.StoringPath = temp;
			}
			else
				temp = path;
		}
		return temp;
		//}
	};
	this.setProfile = function(id)
	{
		this.onPfile = id;
		
		//object.SetAudioStreamType(3);
		if(navigator.appVersion.indexOf("Mac") == -1) //win
		{
			object.SetAudioStreamType(0); //use PCM
		}
		else //mac
		{
			if(pData[id].codec == 'mp4' || pData[id].codec == 'h264')
				object.SetAudioStreamType(3); //use AAC
			else
				object.SetAudioStreamType(3); // ADPCM can't record, still use AAC 
		}
		object.ProfileID = parseInt(this.onPfile);

		if(pData[id].codec == 'mp4')
			object.SetStreamType(0);
		else if(pData[id].codec == 'h264')
			object.SetStreamType(2);	
		else
			object.SetStreamType(1);
		if(this.isLiveView)
		{
			if( pData[this.onPfile].width > 800)
				this.setLargerSize(pData[this.onPfile].width);
			else
				this.setNormalSize();
		}
		if(resize)
		{
			object.width = pData[this.onPfile].width +"px";
			object.height = pData[this.onPfile].height+"px";
		}
		
		changeSizeInfo(pData[this.onPfile].width , pData[this.onPfile].height);
		
		object.StopRecordStreamIn(0);
		object.StopLiveStreamIn(0);	
		
		if(this.camData.isPT == 1)
		{
			this.zoom.setupID(object.id);
			this.zoom.changePfile(pData[this.onPfile].width,pData[this.onPfile].height,"QQ",pData[this.onPfile].codec);
		}
	};
	this.talk = function(isOn)
	{
		this.isTalk = isOn;
		if(isOn)
			object.StartTwoWayAudio(2);
		else
			object.StopTwoWayAudio();
	}
	
	this.setAuthType = function(BaseTerm)
	{
		object.SetAuxAuthType(4, BaseTerm);	
		var notify = document.getElementById("notify");
		if(!notify)
			return;
		notify.SetAuxAuthType(4, BaseTerm);	
	}
	
	this.notificationStart = function()
	{
		var notify = document.getElementById("notify");
		if(!notify)
			return;
		var ifbypassnotify = notify.GetIEBypassEnable();
		notify.UseBypass(ifbypassnotify);
		if(window.location.href.indexOf("ttps:") != -1)
			notify.SetConnectProtocol(1);
		else
			notify.SetConnectProtocol(0);
		var ProxyEnable = notify.GetIEProxyEnable();
		var proxy = notify.GetIEProxy();
		var proxyport = notify.GetIEProxyPort();
		notify.UseProxy(ProxyEnable);
		if(ProxyEnable == "1")
		{
			notify.Proxy = proxy;
			notify.ProxyPort = proxyport;
		}
		notify.RemoteHost= getStandardIP();
		
		notify.RemotePort = this.port;
		
		if(productoem == "Alphanetworks" || productoem == "Trendnet")
		{
			var getnotifyauth = camData.auth.split(":"); 
			notify.Username = getnotifyauth[0];
			var userlength = getnotifyauth[0].length;
			notify.Password = camData.auth.substring(userlength+1);
			//notify.Password = getnotifyauth[1];
			notify.SetAuxAuthType(4,"");
		}
		else
			notify.SetAuthentication(camData.auth);
			
		notify.StartNotification();
	}
	this.ir = function(value)
	{
		var url = "/dev/ir_ctrl.cgi?ir=" + value;
		sendByAjax(url);	
	}
	this.led = function(value)
	{
		var url = "/dev/gpioCtrl.cgi?led=" + value;
		sendByAjax(url);	
	}
	this.gpOut = function(value)
	{
		var url = "/dev/gpioCtrl.cgi?out1=" + value;
		sendByAjax(url);		
	}
	this.setDoubleClickOff = function()
	{
		object.AllowDblClickFullScreen = 0;		
	}
	this.closeClient = function()
	{
		object.Stop();
		if(this.isTalk)
			object.StopTwoWayAudio();
	}
	this.newSpaceForJre = function()
	{
		var div1 = document.createElement("div");
		div1.id = "recordField";
		var div2 = document.createElement("div");
		div2.id = "eventField";
		var obj = document.getElementById("javaObject");		
		obj.appendChild(div1);
		obj.appendChild(div2);
		this.recordfield = document.getElementById("recordField");
		this.eventfield = document.getElementById("eventField");
		
	}
	this.embbedEventApplet = function(pageContext, httpport)
	{
		var string = "";
		if(navigator.appVersion.indexOf("Mac") == -1)
			string +='<applet code="Event.class" type="application/x-java-applet" archive="Event.jar" width="0" height="0" name="EventApplet" id="EventApplet">';
		else
			string += '<object classid="java:Event.class" type="application/x-java-applet" archive="Event.jar" width="0" height="0" name="EventApplet" id="EventApplet">';
		
		string += addCommonParam();
		string += '<param name="webEvent" value="1" />';
		string +=' <param name="pageContext" value="'+pageContext+'" />';
		//alert(httpport);
		string +=' <param name="RemotePort" value="'+httpport+'" />';
		if(navigator.appVersion.indexOf("Mac") == -1)
			string += '</applet>';
		else
			string += '</object>';
		
		return string;
		//document.getElementById("").innerHTML = string;		

	}
	var addCommonParam = function()
	{
		var string = "";
		string += '<param name="codebase" value="" />';
		string += '<param name="scriptable" value="true" />';
		string += '<param name="type" value="application/x-java-applet;version=1.4" />';
		string += '<param name="mayscript" value="true" />';
		return string;
	}
}

function NaCl(id,initProfile, pData,camData, resize, statusNow) //NaCl module
{

	if(!usePPapi)
		return false;

	var object = document.getElementById(id);
	var object_layer = $("#divembeddNP div")[0];
	var t_object = null;
	var _self_ = this;
	_self_.pData = pData;
	_self_.camData = camData;
	_self_.resize = resize;
	_self_.modelName = camData.product;
	_self_.hostAddr = 'ws://';
	_self_.user = 'admin';
	_self_.pwd = '';
	_self_.recorder = null;
	_self_.isOnRecord = false;
	_self_.isAudio = false;
	if(statusNow && statusNow["audio"][0] == '1')
		_self_.isAudio = true;	
	_self_.onPfile = initProfile;
	_self_.v_type = '1'; //video type[1 mjpeg, 2 mpeg-4, 3 h264]
	_self_.a_type = '1'; //audio type[1 PCM, 2 AAC, 3 MS-ADPCM]
	_self_.isTalk = false;
	_self_.talkWorker = null;
	_self_.zoom;
	_self_.runflag = false;
	_self_.interval = 10;
	_self_.ip = getStandardIP();
	if(useHTTPS)
	{
		if(window.location.port == "")
			_self_.port = 443;
		else
			_self_.port = parseInt(window.location.port);

		_self_.hostAddr = 'wss://';
	}
	else
	{
		if(window.location.port == "")
			_self_.port = 80;
		else
			_self_.port = parseInt(window.location.port);
	}

	var a_auth = '';
	if(productoem == "Alphanetworks" || productoem == "Trendnet")
	{
		a_auth = camData.auth;
	}
	else
	{
		a_auth = base64decode1(camData.auth.substr(6));
	}

	a_auth = a_auth.split(":");
	_self_.user = a_auth[0];
	if(a_auth.length > 1)_self_.pwd = a_auth[1];

	_self_.hostAddr += _self_.user+':'+_self_.pwd+'@'+_self_.ip+':'+_self_.port+'/wss'; //wss path
	_self_.ehostAddr = _self_.hostAddr+'_e'; //wss event path
	_self_.platform = (navigator.appVersion.indexOf("Mac")==-1?'win':'mac');

	_self_.load = function()
	{
		return loadPNaCL;
	}

	_self_.init = function()
	{

		if(!object) return false;

		object.width = '640px';
		object.height = '352px';
		if(_self_.isLiveView)
		{
			_self_.initAdjest();
		}	
		
		_self_.setProfile(_self_.onPfile);
		_self_.recorder = new NaClRecorder();
		if(useHTTPS)
		{
			hideDOMById('talkwarn');
			t_object = document.getElementById('t_talker');
			if(!t_object || !npluginTalk)
			{
				console.log('nacl talker null');
			}
			else
			{
				_self_.talkWorker = new Talker('t_talker');//FIXME: just for test, the nacl funtion would move to one module later
			}
		}
		else
		{
			showDOMById('talkwarn');
		}

		_self_.interval = 10;

		return _self_.onPfile;
	};

	_self_.run = function()
	{

		if(_self_.runflag)
			return;

		_self_.runflag = true;
		setTimeout(function(){
			console.log("host:"+_self_.hostAddr+" - type:"+_self_.v_type+" - pid:"+_self_.onPfile);
			NaClPlay = true;
			object.postMessage(makeMessage('open', _self_.hostAddr, 'realvideo', _self_.v_type, (_self_.onPfile).toString(), (-(new Date()).getTimezoneOffset())*60,_self_.a_type));

			_self_.runflag = false;
			setTimeout(function(){
					_self_.shadowlayer(0);
				}, _self_.interval);
		}, 4*_self_.interval);
	};

	_self_.setAudio = function(isOn)
	{

		_self_.isAudio = isOn;
		
		if(isOn)
		{
			if(_self_.platform == 'win') //win
			{
				_self_.a_type = '1'; //use PCM
			}
			else //mac
			{
				if(pData[id].codec == 'mp4' || pData[id].codec == 'h264')
					_self_.a_type = '2'; //FIXME:use AAC
				else
					_self_.a_type = '2'; //FIXME:ADPCM can't record, still use AAC
			}

			object.postMessage(makeMessage('audio output','1'));
		}
		else
			object.postMessage(makeMessage('audio output','0'));		
	};

	_self_.setProfile = function(id)
	{

		_self_.onPfile = id;
		
		if(_self_.platform == 'win') //win
		{
			_self_.a_type = '1'; //use PCM
		}
		else //mac
		{
			if(pData[id].codec == 'mp4' || pData[id].codec == 'h264')
				_self_.a_type = '2'; //FIXME:use AAC
			else
				_self_.a_type = '2'; //FIXME:ADPCM can't record, still use AAC 
		}

		if(pData[id].codec == 'h264')
			_self_.v_type = '3';
		else if(pData[id].codec == 'mp4')
			_self_.v_type = '2';	
		else
			_self_.v_type = '1';

		_self_.shadowlayer(1);
		if(_self_.isLiveView)
		{
			if( pData[_self_.onPfile].width > 800)
			{
				_self_.setLargerSize(pData[_self_.onPfile].width);
			}
			else
			{
				_self_.setNormalSize();
			}
		}
			
		if(resize)
		{
			object.width = pData[_self_.onPfile].width +"px";
			object.height = pData[_self_.onPfile].height+"px";
		}

		changeSizeInfo(pData[_self_.onPfile].width , pData[_self_.onPfile].height);
	};

	_self_.shadowlayer = function(isOn)
	{
		if(isOn)
		{
			if(_self_.interval != 10)
			{//not the init call
				_self_.closeClient();
			}
			else
			{
				_self_.interval = 200;
			}

			$(object_layer).css({
					'width':pData[_self_.onPfile].width +'px',
					'height':pData[_self_.onPfile].height +'px',
					'margin-top':'-'+pData[_self_.onPfile].height/2 +'px',
					'margin-left':'-'+pData[_self_.onPfile].width/2 +'px'
				});
		}
		else
		{
			_self_.interval = 200;
			$(object_layer).css({
					'width':'0px',
					'height':'0px'
				});
		}
	};

	_self_.snapshot = function()
	{
		object.postMessage(makeMessage('snapshot'));
	};

	_self_.recording = function(isOn)
	{
		_self_.isOnRecord = isOn;
		if(_self_.isOnRecord)
		{
			/*
			*As visit the resource of disk directly by ppapi is ruled out,
			*must we request a space for filesystem to do recording job
			*/
			console.log("recording start!");
			if(_self_.recorder)
				_self_.recorder.start(function(){
					object.postMessage(makeMessage('recording','1'));
				});
		}
		else
		{
			console.log("recording stop!");
			object.postMessage(makeMessage('recording','0'));
		}
	};

	_self_.setPath  = function(path)
	{
		return 'null';
	};

	_self_.talk = function(isOn)
	{
		_self_.isTalk = isOn;
		if(isOn)
		{
			if(SpeakerOccupied)
			{
				Stream_OnStreamOutNotify(3);
				return;
			}
			t_object.postMessage(makeMessage('open', _self_.hostAddr));
			tNACLcon = _self_.talkWorker.start();
			console.log('talker open.');
		}
		else
		{
			t_object.postMessage(makeMessage('stop'));
			tNACLcon = _self_.talkWorker.stop();
			console.log('talker stop.');
		}
	};

	_self_.fullscreen = function()
	{
		if(object.webkitRequestFullScreen)
		{
			NaClZoom(1);
			object_orgWidth = object.width;
			object_orgHeight = object.height;
			object.webkitRequestFullScreen();
			document.addEventListener("webkitfullscreenchange", fullhandler);

			function fullhandler()
			{
				if(document.webkitIsFullScreen)
				{//we should set object's width and height here, or the view is not right
					object.width = window.innerWidth;
					object.height = window.innerHeight;
				}
				else			
				{
					object.width = object_orgWidth;
					object.height = object_orgHeight;
					document.removeEventListener("webkitfullscreenchange", fullhandler);
				}
			}
		}
	};

	_self_.initZoom = function(wording)
	{

		var field = document.getElementById("divZoom");
		var zoom_word = '<span style="padding: 0 0 0px 2px">'+(wording?wording:'Zoom in/out:')+'  </span>';
		var zoom_btns = '';

		for(var i = 1; i < 5; i*=2)
		{
			zoom_btns += '<input type="button" id="zoom'+i+'" value="'+i+'x" onClick="NaClZoom('+i+');" style="width: 30px;"/>';
		}
		
		field.innerHTML = zoom_word+zoom_btns;
	};

	_self_.setZoom = function(scale)
	{
		object.postMessage(makeMessage('zoom', scale));
	};

	_self_.ir = function(value)
	{
		var url = "/dev/ir_ctrl.cgi?ir=" + value;
		sendByAjax(url);	
	};

	_self_.led = function(value)
	{
		var url = "/dev/gpioCtrl.cgi?led=" + value;
		sendByAjax(url);	
	};

	_self_.gpOut = function(value)
	{
		var url = "/dev/gpioCtrl.cgi?out1=" + value;
		sendByAjax(url);		
	};

	_self_.closeClient = function(flag)
	{
		if(flag)
		{
			console.log("stop video");
			object.postMessage(makeMessage('stop', 'video'));
		}
		else
		{
			console.log("stop client");
			object.postMessage(makeMessage('stop'));
		}
	};

}

function nonIE(id,initProfile,pData, camData)
{
	this.recordApplet;
	this.eventApplet;
	this.audioApplet;
	this.speakerApplet;
	this.recordfield;
	this.eventfield ;
	this.mjpgImage;
	this.vlcnotidy ;
	this.qtnotify;
	this.vlcqtNotify;
	this.javanotify;
	this.npnotify1;
	this.npnotify2;

	this.pData = pData;
	this.camData = camData;

	//status now!
	this.isOnRecord = false;
	this.isAudio = false;
	this.onPfile = initProfile;
	this.isInit = true;
	this.isTalk = false;
	//this.id = id;
	
	//non IE only
	this.key = "";
	this.playType = "VLC"; // default
	this.avObjectReady = false;
	this.javaObjectReady = false;
	var liveViewID = "objclient";
	//this.port = parseInt(TdbHttpPort);
	if(window.location.href.indexOf("ttps:") != -1)
		this.port = parseInt(TdbHttpPort);
	else
	{
		if(window.location.port == "")
			this.port = 80;
		else
			this.port = parseInt(window.location.port);
	}
	var head = window.location.protocol  + "//" + window.location.hostname;
	this.zoomObj;
	this.player;
	this.player = document.getElementById(id);
	
	this.init = function()
	{
		if(!this.player) return false;
		this.onPfile = initProfile;
		
		if(navigator.appVersion.indexOf("Mac") == -1)
		{
			var ProxyEnable = this.player.GetIEProxyEnable();
			var proxy = this.player.GetIEProxy();
			var proxyport = this.player.GetIEProxyPort();
			this.player.UseProxy(ProxyEnable);
			if(ProxyEnable == 1)
			{
				this.player.Proxy = proxy;
				this.player.ProxyPort = proxyport;
			}
			var ifbypass = this.player.GetIEBypassEnable();
			var proxyexception = this.player.GetIESpecifiedBypass();
			this.player.UseBypass(ifbypass);
			this.player.SpecifiedBypass = proxyexception;
			if (this.camData.pt == 1)
			{
				this.player.EnablePTWnd(1);
			}
			var path = readCookie('savePath');
			if (path != "null")
				this.player.StoringPath = path;
		}
		
		this.player.ModelName = this.camData.product;
		this.player.RemoteHost= getStandardIP();
		
		this.player.RemotePort = this.port;
		
		this.player.SetAuthentication(this.camData.auth);
		
		this.setProfile(this.onPfile);
		
		if(this.camData.isMotion)
		{
			this.player.MDWidth = 640;
			this.player.MDHeight = 480;
			this.player.MBCX = 16;
			this.player.MBCY = 16;
			this.player.ShowMotionDetectionInput();
		}
		
		return this.onPfile;
	};
	this.privacy = function()
	{
		this.newSpaceForJre();
		this.eventfield.innerHTML = this.embbedEventApplet(this.camData.auth, this.port);
	}
	this.setZoom = function(wording)
	{
		this.zoomObj = new digiZoom(wording,this.modelName);	
		
	}
	this.run = function()
	{
		this.player.LiveStreamIn(1);
		this.player.AllowDblClickFullScreen = 1;
		this.setAudio(this.isAudio);
	};
	this.setAudio = function(isOn)
	{
		this.isAudio = isOn;
		if(isOn) 
		{
			this.player.SetAudioStreamType(2); // 0: PCM, 1: MULAW, 2: ADPCM
			this.player.LiveStreamIn(2);
		}
		else
		{
			this.player.StopLiveStreamIn(2);
		}	
	};
	this.snapshot = function()
	{
		this.player.Snapshot();
	};
	this.recording = function(isOn)
	{
		this.isOnRecord = isOn;	
		
		this.player.IntervalType = 0;
		this.player.RecordingFileInterval = 60;
		this.player.RecordLoop = 1;
		
		if(isOn)
			this.player.RecordStreamIn(0);
		else
			this.player.StopRecordStreamIn(0);	
	};
	this.setPath = function(dir)
	{
		var path = dir;
		var temp;
		if(path == "null" || path == "undefined")
		{
			temp = this.player.SelectDirectory( this.player.StoringPath);
			if(temp != this.player.StoringPath && temp != "" && temp != null)
				this.player.StoringPath = temp;
		}
		else
		{	
			temp = this.player.SelectDirectory(path);
			if(temp != "" && temp != null)
			{
				this.player.StoringPath = temp;
			}
			else
				temp = path;
		}
		return temp;
	};
	this.fullscreen = function()
	{
		if(navigator.appVersion.indexOf("Mac") == -1)
		{
			this.player.SetFullScreen(1);
		}
		else
		{
			document.getElementById("mainpage").style.display = "none";
			document.getElementById("fullScreen").style.display = "";
			document.getElementById("mainIframe").style.display = "";
			document.getElementById("mainIframe").src = "fullScreen.html";
			setIframeSize();
			document.body.height = (window.innerHeight) + "px";
		}
	};
	this.setProfile = function(id)
	{
		this.onPfile = id;
		this.player.ProfileID = parseInt(this.onPfile);
		
		if(this.pData[this.onPfile].codec == 'mp4')
			this.player.SetStreamType(0);
		else if(this.pData[this.onPfile].codec == 'h264')
			this.player.SetStreamType(2);	
		else
			this.player.SetStreamType(1);
		this.player.StopLiveStreamIn(0);
		this.player.width = this.pData[this.onPfile].width + "px";
		this.player.height = this.pData[this.onPfile].height + "px";
		
		if(this.camData.isPT == 1)
		{
			this.zoomObj.setupID(this.player.id);
			this.zoomObj.changePfile(pData[this.onPfile].width,pData[this.onPfile].height,"QQ",pData[this.onPfile].codec);
		}
		
	};
	this.talk = function(isOn)
	{
		this.isTalk = isOn;
		
		if(navigator.appVersion.indexOf("Mac") == -1)
		{
			if(isOn)
				this.player.StartStreamOut();
			else
				this.player.StopStreamOut();
		}
		else
		{
			if(isOn)
				this.speakerApplet.StartStreamOut();
			else
				this.speakerApplet.StopStreamOut();	
		}
	}
	this.ir = function(value)
	{
		var url = "/dev/ir_ctrl.cgi?ir=" + value;
		sendByAjax(url);
		
	}
	this.led = function(value)
	{
		var url = "/dev/gpioCtrl.cgi?led=" + value;
		sendByAjax(url);	
	}
	this.gpOut = function(value)
	{
		var url = "/dev/gpioCtrl.cgi?out1=" + value;
		sendByAjax(url);		
	}
	this.closeClient = function()
	{}
	
	//*****  privete function all below there ***
	
	this.getBasicObject = function()
	{
		this.eventApplet = document.getElementById("EventApplet");
	 	this.recordApplet = document.getElementById("RecordApplet");
		this.speakerApplet = document.getElementById("Speaker");
		this.audioApplet = document.getElementById("Audio");
		this.mjpgImage = document.getElementById("mjpgImage");
		this.vlcnotidy = document.getElementById("testVLCPlayer");
		this.qtnotify = document.getElementById("testqtPlayer");
		this.vlcqtNotify = document.getElementById("testPlayer");
		this.javanotify = document.getElementById("testApplet");
		this.npnotify1 = document.getElementById("testNPPlayer1"); 
		this.npnotify2 = document.getElementById("testNPPlayer2"); 
	}
	this.newSpaceForJre = function()
	{
		var div1 = document.createElement("div");
		div1.id = "recordField";
		var div2 = document.createElement("div");
		div2.id = "eventField";
		var obj = document.getElementById("javaObject");		
		obj.appendChild(div1);
		obj.appendChild(div2);
		this.recordfield = document.getElementById("recordField");
		this.eventfield = document.getElementById("eventField");
		
	}

	this.embbedEventApplet = function(pageContext, httpport)
	{
		var string = "";
		if(navigator.appVersion.indexOf("Mac") == -1)
			string +='<applet code="Event.class" type="application/x-java-applet" archive="Event.jar" width="0" height="0" name="EventApplet" id="EventApplet">';
		else
			string += '<object classid="java:Event.class" type="application/x-java-applet" archive="Event.jar" width="0" height="0" name="EventApplet" id="EventApplet">';
		
		string += addCommonParam();
		string += '<param name="webEvent" value="1" />';
		string +=' <param name="pageContext" value="'+pageContext+'" />';
		//alert(httpport);
		string +=' <param name="RemotePort" value="'+httpport+'" />';
		if(navigator.appVersion.indexOf("Mac") == -1)
			string += '</applet>';
		else
			string += '</object>';
		return string;
		//document.getElementById("").innerHTML = string;		

	}
	this.embbedRecordApplet = function(product,id,width,height,pageContext,microphone)
	{
		var string = "";
		if(navigator.appVersion.indexOf("Mac") == -1)
			string += '<applet code="Record.class" type="application/x-java-applet" archive="Record.jar" width="0" height="0" name="RecordApplet" id="RecordApplet">';
		else
			string += '<object classid="java:Record.class" type="application/x-java-applet" archive="Record.jar" width="0" height="0" name="RecordApplet" id="RecordApplet">'; 
			
		string += addCommonParam();
		string += '<param name="productID" value="' +product + '" />';
		string += '<param name="AudioFormat" value="msadpcm" />';//<!-- supporting format 1. pcm 2. mulaw 3. msadpcm -->
		string +=' <param name="profileid" value="'+id+'" />';
		string +=' <param name="imageWidth" value="'+width+'" />';
		string +=' <param name="imageHeight" value="'+height+'" />';
		string +=' <param name="pageContext" value="'+pageContext+'" />';
		string +=' <param name="microphone" value="'+microphone+'" />';
		 
		if(navigator.appVersion.indexOf("Mac") == -1)
			string += '</applet>';
		else
			string += '</object>';
		return string;
	
	}
	var addCommonParam = function()
	{
		var string = "";
		string += '<param name="codebase" value="" />';
		string += '<param name="scriptable" value="true" />';
		string += '<param name="type" value="application/x-java-applet;version=1.4" />';
		string += '<param name="mayscript" value="true" />';
		return string;
	}
	/*
	this.setupMP4 = function(playType,pData,camData,onPfile,key,id)
	{
		
		var mp4 = document.getElementById(id);
		mp4.innerHTML = "";
		if(playType == "QT")
		{
			//try
			{
				var appletObject;
				var volume = 255;
				if(!this.isAudio)
					volume = 0;
				//if (canListen == "no" || flagListen == "off")
				//	volume = 0; 
				appletObject = this.writeqtObject("rtsp://"+window.location.hostname + ":" +  camData.rtspPort + "/" + pData[onPfile].rtspUrl,pData[onPfile].width + "px",pData[onPfile].height+"px",volume);
				mp4.innerHTML = appletObject;
				
				try{
						document.getElementById("qtplayer").SetURL("rtsp://"+window.location.hostname+":"+camData.rtspPort+"/"+ pData[onPfile].rtspUrl);	
				}
				catch(e)
				{
					//alert(e);	
				}
				
			}
		}
		else
		{
			var myvlc = new VLCObject("mymovie",pData[onPfile].width +"px", pData[onPfile].height +"px");
			myvlc.addParam("MRL","http://"+key+ "@" +window.location.hostname+":"+camData.httpPort+"/video/ts-mp4.cgi?profileid="+ onPfile);
			myvlc.write(id);	
		}
		
	}
	var setupMjpg = function(pData,onPfile, key)
	{
		var mjpg = document.getElementById("divPlayer");
		mjpg.innerHTML = "";
		var url = "http://" + key + "@" + window.location.hostname + ":" + camData.httpPort;
		
		if (window.location.protocol.toLowerCase() == "http:") 
			url =  "/video/mjpg.cgi?profileid=" + onPfile;
		else
			url += "/video/mjpg.cgi?profileid=" + onPfile;
		var text = '<img id="mjpgImage" alt="Processing..." ';
		text += ' width="'+pData[onPfile].width+'" height="'+pData[onPfile].height+'"'  ;
		text += ' src="'+ url +'" />';
		mjpg.innerHTML = text;

	}
	*/
	var setIframeSize = function()
	{
		var height = "480";
		var width = "640";
		var a;
		if(window.innerWidth > window.innerHeight && (window.innerWidth/window.innerHeight) > (width/height))
			 a = window.innerHeight / height;
		else
			a = window.innerWidth / width;
		a -= 0.01;
		var realWidth = a * width;
		var realHeight = a * height;
		document.getElementById("fullScreen").style.width = window.innerWidth + "px";
		document.getElementById("fullScreen").style.height = (realHeight + 3 ) + "px";
		document.getElementById("mainIframe").style.width = window.innerWidth + "px";
		document.getElementById("mainIframe").style.height = (realHeight  + 2) + "px";
		document.body.bgColor = "#000000";
	}
	var selectPlayType = function()
	{
		var browser = navigator.appVersion;
		if(browser.indexOf("X11") != -1 || browser.indexOf("Windows") != -1)
			return "VLC";
		else 
			return "QT";
		
	}
	var needRedirect = function()
	{
		if(navigator.userAgent.indexOf('Chrome') != -1)
			return true;
		else if(navigator.userAgent.indexOf('Safari') != -1)
			return true;
		else
			return false;
	}
	
	function changeKey(str) 
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
	
	this.checkAVObject = function(type)
	{
		
		if(type == 'VLC')
		{
			if(!checkInstalled("VLC"))
			{
				//this.vlcnotidy.style.display = "";
				return false;
			}
		}
		else if(type == "QT")
		{
			if(!checkInstalled("QuickTime"))
			{
				this.qtnotify.style.display = "none";
				return false;
			}
		}
		return true;
	}
	
	var checkInstalled = function(type) //QuickTime  VLC
	{
		try
		{
			if(navigator.plugins)
			{
				for (i=0; i < navigator.plugins.length; i++ )
				{		
					if (navigator.plugins[i].name.indexOf(type) >= 0)
						return true;
				}
			}
		}
		catch(e)
		{
			return false;	
		}
		return false;			
	}
	
	this.writeqtObject = function (src,width,height,volume)
	{
		var object = "";
		object = '<object id="mymovie" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" width="'+width+'" height="'+height+'" codebase="http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0" >';
		object += ' <param name="src" value="VerySmall.mov" >';
		object += ' <param name="autoplay" value="True" >';
		object += ' <param name="controller" value="false" >';
		object += ' <param name="ShowStatusBar" value="false" >';
		object += ' <param name="qtsrc" value="'+src+'" >';
		object += ' <param name="volume" value="'+volume+'" >';
		object += ' <param name="DONTFLATTENWHENSAVING" value="True" >';
	object += '<embed width="'+width+'" height="'+height+'" dontflattenwhensaving="True" id="qtplayer"SAVEEMBEDTAGS="True"src="VerySmall.mov"pluginspage="http://www.apple.com/quicktime/download/"autoplay="True"scale="ToFit" controller="false"ENABLEJAVASCRIPT="True"KIOSKMODE="True"QTSRCDONTUSEBROWSER="false"  DONTFLATTENWHENSAVING="false"ShowStatusBar="True"qtsrc="'+src+'"volume="'+volume+'"  ></embed>';
	object += '</object>'; 
	
		return object;
	}
}
function changeSizeInfo(w,h)
{
	var objw = document.getElementById("showWidth");
	var objh = document.getElementById("showHeight");
	if(objw)
		objw.innerHTML = w;
	if(objh)
		objh.innerHTML = h;
}
var g_zoom_lens = 1;

var refresh_flag = false;//need refresh temporarily 
function digiZoom(wording,modeName)
{
	
	this.w;
	this.h ;
	this.type;
	this.format;
	this.way = "scroll";
	this.wording = wording;
	if(!this.wording)
		this.wording = "Zoom in/out:";
	this.tempw = 640;
	this.temph = 480;
	this.double = 1;
	this.isIE = false;
	this.obj; 
	
	this.setupID = function(id)
	{
		this.obj = document.getElementById(id);
	}
	this.createbtn = function(wording,id, format, type)
	{
		var field = document.getElementById(id);
		if(modeName == 'CS-3122')
		{
			field.style.display = "none";
		}
		field.innerHTML = "";
		if(navigator.userAgent.indexOf("Firefox") != -1 && format != "jpg" && type == "QT")
			return;
		var btn, title;
		
		/*title = document.createElement('span');
		title.style.cssText = "margin: 0 0 0px 15px;";*/
		//title.innerHTML = wording;
		if(productoem == "Trendnet")
		{
			field.innerHTML = "";
		}
		else
		{
			field.innerHTML = '<span style="padding: 0 0 0px 2px">' + wording+ "  " +"</span>";
		}
		for(var i = 1; i <= 8; i++)
		{
			if((i == 3)||(i == 5)||(i == 6)||(i == 7))
				continue;
			//if(this.tempw * i > 2600 && navigator.appVersion.indexOf("Mac") != -1)
				//return;
			btn = document.createElement("input");	
			btn.type = 'button';
			btn.cssText = "margin: 0 0 0 6px;";
			btn.id = "zoom" + i;
			btn.value = i+"x";
			//btn.isIE = this.isIE;
			btn.onclick =  clickZoom;
			btn.lens = i;
			btn.style.width = "30px"
			btn.w = this.w;
			btn.h = this.h;
			btn.iformat = this.format;
			btn.itype = this.type;
			//if(this.isIE)
			btn.obj = this.obj;
			field.appendChild(btn);	
		}	
		
	}
	var clickZoom = function()
	{
		var img;
		g_zoom_lens = this.lens;
		this.obj.SetZoomRatio(this.lens);
	}

	
	this.changePfile = function(w,h,type,format)
	{
		this.type = type;
		this.w =w;
		this.h = h;
		this.tempw = w;
		this.temph = h;
		this.format = format;
		this.createbtn(this.wording,"divZoom",this.format,this.type);	
	}
	
}
//** ajax request

function sendByAjax(url)
{
	//alert(url);
	new net.ContentLoader(url,callbackfun);
}

function callbackfun()
{
	var xml = null;
	xml =this.req.responseXML;
}
function reloadImg()//for network recover event
{
	location.href = "liveView.cgi";
}

//compare version
function canDetectPlugins() 
{
	if(window.navigator.userAgent.indexOf("Firefox") != -1 && navigator.plugins)
	{
		return true;	
	}
    if( navigator.plugins && (navigator.plugins.length > 0 )) 
	{
        return true;
    } 
	else 
	{
        return false;
    }
}
function parseVersion(stringContainVersion)
{
    var parResult = stringContainVersion.split('version: ');
    var parLen = parResult[1].length;
    //alert(parLen);
    return parResult[1].substring(0, (parLen -1));
}
function needInstallNew(cliVersion, servVersion)
{
    var cliNumArray = cliVersion.split('.');
    var serNumArray = servVersion.split('.');
    //// compare from left to right
    if ( parseInt(serNumArray[0]) > parseInt(cliNumArray[0]) )
	return true;
    else if ( parseInt(serNumArray[1]) > parseInt(cliNumArray[1]) )
	return true;
    else if ( parseInt(serNumArray[2]) > parseInt(cliNumArray[2]) )
	return true;
    else if ( parseInt(serNumArray[3]) > parseInt(cliNumArray[3]) )
        return true;

    return false;
}

var pluginVersion;

function detectPlugin() {
    // allow for multiple checks in a single pass
    var daPlugins = detectPlugin.arguments;	
    // consider pluginFound to be false until proven true
    var pluginFound = false;
    pluginVersion = "";
    // if plugins array is there and not fake
    if (navigator.plugins && navigator.plugins.length > 0) {
        var pluginsArrayLength = navigator.plugins.length;
        // for each plugin...
        for (pluginsArrayCounter=0; pluginsArrayCounter < pluginsArrayLength; pluginsArrayCounter++ ) {
            // loop through all desired names and check each against the current plugin name
            var numFound = 0;
            for(namesCounter=0; namesCounter < daPlugins.length; namesCounter++) {
                // if desired plugin name is found in either plugin name or description
                if( (navigator.plugins[pluginsArrayCounter].name.indexOf(daPlugins[namesCounter]) >= 0) ||
                    (navigator.plugins[pluginsArrayCounter].description.indexOf(daPlugins[namesCounter]) >= 0) ) {
                    // this name was found
                    numFound++;
                }
            }
            // now that we have checked all the required names against this one plugin,
            // if the number we found matches the total number provided then we were successful
            if(numFound == daPlugins.length) {
                pluginFound = true;
                pluginVersion = navigator.plugins[pluginsArrayCounter].version;
                if (pluginVersion == undefined)
                {
                        pluginVersion = parseVersion(navigator.plugins[pluginsArrayCounter].description);
                }
               // alert(pluginVersion);
                // if we've found the plugin, we can stop looking through at the rest of the plugins
                break;
            }
        }
    }
    return pluginFound;
    //return pluginsArrayCounter;
} // detectPlugin

function detectNCSClient() {
	if(navigator.appVersion.indexOf("Mac") == -1)
	{
		if(productoem == "D-Link")
			pluginFound = detectPlugin('Camera Stream Client Control Object');
		else if(productoem == "Trendnet")
			pluginFound = detectPlugin('Camera Control Class');
		else
			pluginFound = detectPlugin('Network Surveillance Streaming Control Object');
	}
	else
	{
		if(productoem == "D-Link")
			pluginFound = detectPlugin('Camera Stream Client Control Object');
		else if(productoem == "Trendnet")
			pluginFound = detectPlugin('Camera Control Class');
		else
			pluginFound = detectPlugin('Network Surveillance Streaming Control Object');
	}
    return pluginFound;
}

function UpdatePlugins () {
    if (navigator.plugins) {
        navigator.plugins.refresh ();
        //alert ("The plugins collection is updated!");
	window.location.reload();
    }
    else {
        alert ("Your browser does not support this example!");
    }
}
function checknplugin()
{
	var npnotify1 = document.getElementById("testNPPlayer1");
	var npnotify2 = document.getElementById("testNPPlayer2");
	var npnotify3 = document.getElementById("testNPPlayer3");
	var npnotify4 = document.getElementById("testNPPlayer4");

	if(canDetectPlugins())
	{
		if(usePPapi)
		{
			hideDOMById("divInstallNP");
			showDOMById("divembeddNP");
		}
		else if(navigator.appVersion.indexOf("Mac") == -1) //win
		{
		//	navigator.appVersion.indexOf("Mac") == -1
			if((navigator.appVersion.indexOf("Safari") != -1) ) 
			{
				var appVersionStr = navigator.appVersion.split(" ");
				var SubVersionStr;

				for(var i=0;i<appVersionStr.length;i++)
				{
					if(appVersionStr[i].indexOf("Version") == 0)
					{
						SubVersionStr = appVersionStr[i];	
						break;
					}
				}
				var versionstr = SubVersionStr.substring(8,13); 
				var version = parseFloat(versionstr);	
				if(version >= 10.0)
				{
					document.getElementById("divInstallNP").style.display = "none";
					document.getElementById("divembeddNP").style.display = "";
					npnotify3.style.display = "";
				}
				else
				{
					if ( !detectNCSClient() || needInstallNew( pluginVersion, '1.0.0.9929' ) )
					{
						document.getElementById("divInstallNP").style.display = "none";
						document.getElementById("divembeddNP").style.display = "none";
						npnotify1.style.display = "";
					}
					else
					{
						document.getElementById("divembeddNP").style.display = "";
						document.getElementById("divInstallNP").style.display = "none";
						npnotify1.style.display = "none";
					}

				}
			}
			else//firefox browser
			{
				if ( !detectNCSClient() || needInstallNew( pluginVersion, '1.0.0.9929' ) )
				{
					//alert("need to install!");
					document.getElementById("divInstallNP").style.display = "none";
					document.getElementById("divembeddNP").style.display = "none";
					npnotify1.style.display = "";
				}
				else
				{
					document.getElementById("divembeddNP").style.display = "";
					document.getElementById("divInstallNP").style.display = "none";
					npnotify1.style.display = "none";
				}
			}
		}
		else//Mac
		{

			if((navigator.appVersion.indexOf("Safari") != -1))
			{
				var temp1 = navigator.appVersion.indexOf("Safari");
				var appVersionStr = navigator.appVersion.split(" ");
				var SubVersionStr;

				for(var i=0;i<appVersionStr.length;i++)
 				{
					if(appVersionStr[i].indexOf("Version") == 0)
					{
						SubVersionStr = appVersionStr[i];	
						break;
					}
 				}
				var versionstr = SubVersionStr.substring(8,13); 
				var version = parseFloat(versionstr);	
				if(version >= 10.0)
 				{
 					document.getElementById("divInstallNP").style.display = "none";
					document.getElementById("divembeddNP").style.display = "";
					npnotify4.style.display = "";
				}
				else
				{
					if ( !detectNCSClient() || needInstallNew( pluginVersion, '1.0.0.60' ) )
					{
						document.getElementById("divInstallNP").style.display = "";
						document.getElementById("divembeddNP").style.display = "none";
						npnotify2.style.display = "";
					}
					else
					{
						document.getElementById("divembeddNP").style.display = "";
						document.getElementById("divInstallNP").style.display = "none";
						npnotify2.style.display = "none";
					}
 				}


			}
			else
			{
				if ( !detectNCSClient() || needInstallNew( pluginVersion, '1.0.0.60' ) )
				{
					//alert("need to install!");
					document.getElementById("divInstallNP").style.display = "";
					document.getElementById("divembeddNP").style.display = "none";
					npnotify2.style.display = "";
				}
				else
				{
					document.getElementById("divembeddNP").style.display = "";
					document.getElementById("divInstallNP").style.display = "none";
					npnotify2.style.display = "none";
				}
			}

		}
	} 
	npluginField = document.getElementById("divembeddNP");
	npinstallField = document.getElementById("divInstallNP");
	if(usePPapi)
	{
		npluginField.addEventListener('load', NaClLoad, true);
		npluginField.addEventListener('error', NaClError, true);
		npluginField.addEventListener('crash', NaClCrash, true);
		npluginField.addEventListener('message', NaClMessage, true);
		document.addEventListener('visibilitychange', NaClVisible,true);
	}
}
function processNP()
{
	checknplugin();
	npluginField.innerHTML = embednplugin(0,0);
}
function embednplugin(width,height)
{
	var string = "";
	if(usePPapi)
	{
		string += '<embed id="ncscontrol" type="application/x-pnacl" width="' + width + '" height="' + height + '" style="position:relative;background-color:#000;" path="./" src="/ncscontrol.nmf"></embed>';
		string += '<div style="position: absolute; background-color: black;top: 50%;left: 50%;"></div>';
	}
	else if(navigator.appVersion.indexOf("Mac") == -1)
	{
		if(productoem == "D-Link")
		{
			string += '<embed id="ncscontrol" type="application/camclictrl-plug-in" width=" ' + width + '" height="'+ height +'" style="position:relative;"></embed>'
		}
		else if(productoem == "Trendnet")
		{
			string += '<embed id="ncscontrol" type="application/CameraControl" width=" ' + width + '" height="'+ height +'" style="position:relative;"></embed>'
		}
		else
		{
			string += '<embed id="ncscontrol" type="application/ncsctrl-np" width=" ' + width + '" height="'+ height +'" style="position:relative;"></embed>'	
		}
	}
	else
	{
		if(productoem == "D-Link")
		{
			string += '<embed id="ncscontrol" type="application/camclictrl-plug-in" width=" ' + width + '" height="'+ height +'"></embed>';	
		}
		else if(productoem == "Trendnet")
		{
			string += '<embed id="ncscontrol" type="application/CameraControl" width=" ' + width + '" height="'+ height +'"></embed>';	
		}
		else
		{
			string += '<embed id="ncscontrol" type="application/ncsctrl-np" width=" ' + width + '" height="'+ height +'"></embed>';	
		}
	}
	return string;
}


function setIframeSize()
{
	var height = "480";
	var width = "640";
	var a;
	if(window.innerWidth > window.innerHeight && (window.innerWidth/window.innerHeight) > (width/height))
		a = window.innerHeight / height;
	else
		a = window.innerWidth / width;
	a -= 0.01;
	var realWidth = a * width;
	var realHeight = a * height;
	document.getElementById("fullScreen").style.width = window.innerWidth + "px";
	document.getElementById("fullScreen").style.height = (realHeight + 3 ) + "px";
	document.getElementById("mainIframe").style.width = window.innerWidth + "px";
	document.getElementById("mainIframe").style.height = (realHeight  + 2) + "px";
	document.body.bgColor = "#000000";
}
function base64decode1(str) 
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
