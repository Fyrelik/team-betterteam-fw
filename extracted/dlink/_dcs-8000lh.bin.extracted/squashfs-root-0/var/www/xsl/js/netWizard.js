function wizardAction()
{
	this.pageNow = 1;

	this.init = function()
	{	
		$("#step" + this.pageNow).show();
	}
	this.nextPage = function()
	{
		
		$("#step" + this.pageNow).slideToggle(200);
		this.pageNow++;
		$("#step" + this.pageNow).show(200, function(){
			resize();										 
		});
	}
	this.prePage = function()
	{
		$("#step" + this.pageNow).slideToggle(200);
		this.pageNow--;
		$("#step" + this.pageNow).show(200, function(){
			resize();									 
		});
	}

	this.leave = function()
	{
		if(parent.isWizardEnterSteps)
			window.location.href='netWizard.cgi';
		else
			window.location.href='adv_wizard.cgi';
	}
}

function timeCheckHours(id,errcode)
{
	var obj = document.getElementById(id); 
	if(isPosInt(obj.value)==false || range(obj.value,0,23)==false)
	{
		alertAndSelect(id,errcode);
		return false;
	}
	return true;
}
function timeCheckMins(id,errcode)
{
	var obj = document.getElementById(id); 
	if(isPosInt(obj.value)==false || range(obj.value,0,59)==false)
	{
		alertAndSelect(id,errcode);
		return false;
	}
	return true;
}

function addDateTime(nowDate, nowTime){
	addComputerTime();
	sepNowDatAndTime(nowDate, nowTime);
}
