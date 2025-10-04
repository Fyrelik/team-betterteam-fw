function checkPosAndInRange(obj,form,to,errcode)
{
	if(isPosInt(obj.value)==false || range(obj.value,form,to)==false)
	{
		alertAndSelect(obj,errcode);
		return false;
	}
	return true;
	
}
function checkNTP(obj, serverError)
{
	var data = document.getElementById(obj);
	var re = /^[\w-]+\.+([\w-]+)*/;
	if(!data.value.match(re)){
		alert(serverError);
		return false;
	}
	return true;
}

function sepDatAndTime(startTimeValue,endTimeValue)
{
	var splitOffset;
	var splitStartTime;
	var splitStartTimeA;
	var splitStartTimeB;
	var splitEndTime;
	var splitEndTimeA;
	var splitEndTimeB;

	//part1
	splitStartTime = startTimeValue.split("/");
	splitStartTimeA = splitStartTime[0].split(".");
	if(splitStartTimeA[0].length == 2)
		document.form1.startTimeMon.value = splitStartTimeA[0].substring(1,2);
	else
		document.form1.startTimeMon.value = splitStartTimeA[0].substring(1,3);
	document.form1.startTimeWeek.value = splitStartTimeA[1];
	document.form1.startTimeDayOfWeek.value = splitStartTimeA[2];
	//part2
	splitStartTimeB = splitStartTime[1].split(":");
	document.form1.startTimeHours.value =parseInt(splitStartTimeB[0]);
	document.form1.startTimeMins.value =parseInt(splitStartTimeB[1]);

	//part1
	splitEndTime = endTimeValue.split("/");
	splitEndTimeA = splitEndTime[0].split(".");
	if(splitEndTimeA[0].length == 2)
		document.form1.endTimeMon.value = splitEndTimeA[0].substring(1,2);
	else
		document.form1.endTimeMon.value = splitEndTimeA[0].substring(1,3);
	document.form1.endTimeWeek.value = splitEndTimeA[1];
	document.form1.endTimeDayOfWeek.value = splitEndTimeA[2];
	//part2
	splitEndTimeB = splitEndTime[1].split(":");
	document.form1.endTimeHours.value = parseInt(splitEndTimeB[0]);
	document.form1.endTimeMins.value = parseInt(splitEndTimeB[1]);

}
function changeDayByYear(){ 
	var month = document.getElementById("computerMonth");
	changeDayByMonth(month);	
}
function isLeapYear(){
	var year = document.getElementById("computerYear").value;
	if ((year%4==0&&year%100!=0)||(year%400==0))
		return true;
	else
		return false;
}
function changeDayByMonth(obj)
{
	var day = document.getElementById("computerDay").value;
	if(obj.value == "1" || obj.value == "3"|| obj.value == "5"|| obj.value == "7"|| obj.value == "8"|| obj.value == "10"|| obj.value == "12")
		AddOptionByNumber('computerDay',1,31,1,day);
	else
	{   if (obj.value == "2"){
			if (isLeapYear()==true)			
	        	AddOptionByNumber('computerDay',1,29,1,day);
			else 
				AddOptionByNumber('computerDay',1,28,1,day);
			}
		else
			{  
			  if(day > 30)
			     AddOptionByNumber('computerDay',1,30,1,"1");
	    	  else
		    	 AddOptionByNumber('computerDay',1,30,1,day);
	}
  }
}
function addOption()
{
	AddOptionByNumber('startTimeMon',1,12,1,10);
	AddOptionByNumber('startTimeWeek',1,5,1,1);
	AddOptionByNumber('startTimeHours',0,23,1,1);
	AddOptionByNumber('startTimeMins',0,59,1,1);
	AddOptionByNumber('endTimeHours',0,23,1,1);
	AddOptionByNumber('endTimeMins',0,59,1,1);
	AddOptionByNumber('endTimeMon',1,12,1,10);
	AddOptionByNumber('endTimeWeek',1,5,1,1);
	
	addComputerTime();
}
function addComputerTime()
{
	var now = new Date();
	
	AddOptionByNumber('computerYear',now.getFullYear(), 2023,1,now.getFullYear());
	AddOptionByNumber('computerHour',0,23,1,10);
	AddOptionByNumber('computerMonth',1,12,1,10);
	AddOptionByNumber('computerMinute',0,59,1,10);
	AddOptionByNumber('computerDay',1,31,1,10);
	AddOptionByNumber('computerSecond',0,59,1,10);
}
function sepNowDatAndTime(nowDateValue,nowTimeValue)
{
	var splitNowDate = nowDateValue.split("/");
	var splitNowTime = nowTimeValue.split(":");
	
	if(!IsExistItem('computerYear',splitNowDate[0]))
	{
		var today=new Date();
		var nowYear = today.getFullYear();
		var startYear = splitNowDate[0]-9;
		var endYear = splitNowDate[0]-0;
		if (nowYear < startYear || nowYear > endYear) {
			if (nowYear > endYear && nowYear <= endYear + 9) {
				AddOptionByNumber('computerYear',endYear, endYear + 9,1,splitNowDate[0]);
			} else {
				var years = new Array(10); 
				var i,j;
				if (nowYear < startYear) {
					years[9] = endYear;
					i = 0;
				} else {
					years[0] = endYear;
					i = 1;
				}
				j = i + 9;
				for (;i < j;i++) {
					years[i] = nowYear++;
				}

				AddOptionByArray('computerYear', years, splitNowDate[0]);
			}
		} else {
			AddOptionByNumber('computerYear',startYear, endYear,1,splitNowDate[0]);
		}
	}

	document.form1.computerYear.value = splitNowDate[0];
	document.form1.computerMonth.value = parseFloat(splitNowDate[1]);
	document.form1.computerDay.value = parseFloat(splitNowDate[2]);
	document.form1.computerHour.value =  parseFloat(splitNowTime[0]);
	document.form1.computerMinute.value = parseFloat(splitNowTime[1]);
	document.form1.computerSecond.value = parseFloat(splitNowTime[2]);
}
function computerTime()
{
	var today=new Date();
	
	if(!IsExistItem('computerYear',today.getFullYear()))
	{
		AddOptionByNumber('computerYear',today.getFullYear(), today.getFullYear()+9,1,today.getFullYear());
	}
	else
	{
		$("#computerYear").val(today.getFullYear());
	}
    $("#computerMonth").val(today.getMonth()+1);
	$("#computerDay").val(today.getDate());
	$("#computerHour").val(today.getHours());
	$("#computerMinute").val(today.getMinutes());
	$("#computerSecond").val(today.getSeconds());
}
function refineNTPserver(obj,NTPaddress)
{
	var serverdata = document.getElementById(obj);
	var re = /^[\w-]+\.+([\w-]+)*/;
	if(!serverdata.value.match(re))
	{
		serverdata.value = NTPaddress;
	}
	var result;
	for (var i=0; i< serverdata.value.length; i++){
		result = serverdata.value.charCodeAt(i); 
		if (result < 45 || result > 122 || (result > 57 && result < 65) || (result > 90 && result < 95) || result == 47 || result == 96){
			serverdata.value = NTPaddress;
		}
		if(result == 46)
		{
			result = serverdata.value.charCodeAt(i+1); 
			if((1 == serverdata.value.length) || (result == 46))
			{
				serverdata.value = NTPaddress;
			}
		}
	}
	return serverdata.value;
}
