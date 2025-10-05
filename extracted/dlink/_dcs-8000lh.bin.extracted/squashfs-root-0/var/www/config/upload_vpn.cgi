#!/bin/sh


# get current setting from tdb
# format looks like VariableName_type
onGetSetting() {
	result="ok"
	enableVPN=`tdb get OpenVPN Enable_byte`
}


checkSetting() {
	noParameter=1
	gotUploadedFile=no
	
	result=fail
	if [ "$UPLOAD" != "" ]; then 
		#result=fail
		[ -f "$UPLOAD" ] || return 1
		chmod u+x "$UPLOAD"

		result=invalidImage
		cd /tmp/db/
		tar xzf "$UPLOAD"  || return 1
	
		result=untarFileError
		[ -f "/tmp/db/ca.crt" ] || return 1
		[ -f "/tmp/db/client.crt" ] || return 1
		[ -f "/tmp/db/client.key" ] || return 1
		[ -f "/tmp/db/client.ovpn" ] || return 1

		noParameter=0
		gotUploadedFile=yes
		#result=uploaded
	fi

	#echo "$enable" > /dev/console
	#debuglog "$QUERY_STRING"
	#echo "$QUERY_STRING" > /dev/console

	if [ "$enable" != "" ]; then 
		[ "$enable" = "on" ] || [ "$enable" = "off" ] || return 1
		
		noParameter=0
	fi
	
	if [ "$gotUploadedFile" = "yes" ]; then 
		result=uploaded	
	else
		result=ok
	fi

	return $noParameter
}

saveSetting() {
	#result=saveFail
	if [ "$enable" = "off" ]; then 
		tdb set OpenVPN Enable_byte=0
		enableVPN=0
	else
		tdb set OpenVPN Enable_byte=1
		enableVPN=1
	fi
	
	tdb flush || return 1
	return 0
}

# make sure, ...
# 1. $result is set
# 2. variables in dumpXml are all set
onUpdateSetting() {
	# 1. check parameters
	if ! checkSetting; then
		/etc/rc.d/init.d/openvpn.sh restart > /dev/null 2> /dev/null
		return 1
	fi

	# 1.9, make language files into cache, before mess up flash.
	cat tools_default.xsl frame.lang tools-left.lang tools_default.lang > /dev/null 2> /dev/null
	# 2. save to NOR flash
	if ! saveSetting; then
		if [ "$enableVPN" = "1" ] ; then
			/etc/rc.d/init.d/openvpn.sh restart > /dev/null 2> /dev/null
		else
			/etc/rc.d/init.d/openvpn.sh stop > /dev/null 2> /dev/null
		fi
		
		return 1
	fi
	# 3. make it sync
	#result=updateOK
	sleep 3
}

onDumpInf() {
	status="200"
	pair 'result' "$result"
	#if [ "$result" = "updateOK" ]; then
        #       pair    'upload'      "ok"
        #else
        #       pair    'upload'      "fail"
        #fi
        
        if [ "$enableVPN" = "0" ]; then
                pair    'enable'      "off"
        else
                pair    'enable'      "on"
        fi
        
	infOK
	/etc/rc.d/init.d/openvpn.sh restart > /dev/null 2> /dev/null
}

enableVPN=0

. ../infMain.sh

