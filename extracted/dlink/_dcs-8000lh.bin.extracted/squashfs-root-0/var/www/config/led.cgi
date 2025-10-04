#!/bin/sh

onGetSetting() {
    status=404
    eval $(pibinfo Peripheral)
}

onUpdateSetting() {
    [ "$FrontLED" -eq 1 ] || return
    if [ "$led" ]; then
        if [ "$led" = "on" ]; then
            light led on
        elif [ "$led" = "off" ]; then
            light led off
        fi
    fi
}

onDumpInf() {
    if [ "$FrontLED" -eq 1 ]; then
        pair 'led' $(sniff led)
        infOK
    else
	infFail "$status"
    fi
}

. ../infMain.sh

# vi: et sw=4 sts=4
