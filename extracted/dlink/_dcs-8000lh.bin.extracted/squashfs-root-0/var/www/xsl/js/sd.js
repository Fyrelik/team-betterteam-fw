function sdManager(sddata)
{
	this.colSize = 3;
	this.title = titleCategory;
	this.rowSize;
	this.data;
	
	var contentIndex = Array(this.colSize);
	var count = 0;
	for(var i in titleCategory)
	{
		contentIndex[count] = i;
		count++;	
	}
	this.createTable = function(id,filesperpage,folderpath)
	{
		var titleFlag = false;
		var table = "<table class=\"sdTable\">";
		table += getTitle(this.title);
		if(this.rowSize > filesperpage )
			this.rowSize = filesperpage;
		for(var j =0 ; j < this.rowSize ; j++)
		{
			table += "<tr class=\"sdContent\">";
			
			for(var i = 0 ; i < contentIndex.length ; i++)
			{
				
				switch(contentIndex[i])
				{
					case 'del':
						table += "<td class=\"" + contentIndex[i] + "\">";
						table += "<input type=\"checkbox\" value=\""+this.data.urlText[j] +"\" />";
					break;
					case 'name':
						table += "<td>";
						if(this.data.size[j] != "")
							table += "<a href=\"../../cgi/admin/getSDFile.cgi?file="+this.data.urlText[j]+"&path="+this.data.url[j]+"\">"+ this.data.urlText[j] +"</a>";
						else
							table += "<a href=\""+this.data.url[j] +"\">"+ this.data.urlText[j] +"</a>";
					break;
					case 'size':
						table += "<td>";
						table += this.data.size[j];
					break;
					
				}	
				table += "</td>";
			}
			table += "<tr>";
		}
		table += "</table>";
		$("#" + id).html(table);
	}
	this.getContentData = function(data, folderPath,model)
	{
		var aryfile = data.split("*"); //0: file, 1: type, 2:size
		var fileInfo;
		var size = aryfile.length;
		//var path = "sdcard";
		var format = new dataformat(size);
		if(folderPath != "")
			folderPath += "/";
		for(var i = 0 ; i < aryfile.length ; i++)
		{
			if(aryfile[i] == "")	
				continue;
			fileInfo = aryfile[i].split(":");
			format.urlText[i] = fileInfo[0];
			if(fileInfo[1] == "f")
			{
				format.url[i] =  model + "/" + folderPath + fileInfo[0];
				format.size[i] = fileInfo[2];
			}
			else
			{
				format.size[i] = "";
				format.url[i] = "adv_sdcard.cgi?folderpath=" + folderPath+ fileInfo[0] + "&command=video&" + "filesperpage=" + filesperpage;
			}
		}
		
		this.rowSize = size - 1;
		this.data = format;
	}
	this.setSDInfo = function(filesperpage, currentpage,totalpage,status, folderPath, model)
	{
		if(totalpage == 0)
			AddOptionByNumber("page_count",0,totalpage,1,currentpage);
		else
			AddOptionByNumber("page_count",1,totalpage,1,currentpage);
		if(filesperpage == "")
			filesperpage = 5; //defalut
		
		$("#files_per_page").val(filesperpage);
		$("#sdstatus").html(status);
		
		var aryPath = folderPath.split("/");
		var html = "";
		var path = "";
		
		html += "<a href=\"adv_sdcard.cgi?folderpath=" + path + "&command=video&filesperpage=" + filesperpage +  "\">"+ model +"</a>&nbsp;/&nbsp;";
		for(var i = 0 ; i < aryPath.length ; i++)
		{
			if(aryPath[i] == "")
				continue;
			path += aryPath[i] + "/";	
			html +="<a href=\"adv_sdcard.cgi?folderpath=" + path + "&command=video&filesperpage=" + filesperpage + "\">"+ aryPath[i] +"</a>";
			html += "&nbsp;/&nbsp;";
		}
		$("#sdPath").html(html);
	}
	
	var getTitle = function(title)
	{
		var temp = "";
		temp += "<tr class=\"sdTitle\">";
		for(var i in title)
		{
			temp += "<td class=\"" + i +"\">";
			temp += title[i];
			if(i == "del")
				temp += "<input type=\"checkbox\" onclick=\"selectAll(this)\" /><input type=\"button\" value="+sddata+" id=\"ok_id\" name=\"ok\"  onclick=\"doThings('delete')\"/>";
			temp += "</td>"
		}
		temp += "</tr>";
		return temp;
	}

}
function selectAll(obj)
{
	$(".sdContent input").attr("checked", function() {
		//alert($(this).attr("checked"));	
		$(this).attr("checked", obj.checked);							  
	})
}
function doThings(type, value)
{
	var command = "video";
	var foldername = "";
	var maskmsg="";
	switch(type)
	{
		case 'pages':
			currentpage = value;
			maskmsg = "process";
		break;
		case 'perPage':
			filesperpage = value;
			maskmsg = "process";
		break;
		case 'delete':
			command = "delete";
			$(".sdContent input").attr("checked", function() {
				if($(this).attr("checked"))
				{
					foldername = $(this).val() + "*" + foldername;
				}
			})
			if(foldername == "")
			{
				alert(deleteConfirm1);
				return;
			}
			if(!confirm(deleteConfirm))
				return;
			
			$("#FolderName").val(foldername);
			maskmsg = "process";
		break;
		case 'reflash':
			/*no nothing*/
			maskmsg = "process";
			break;
		case 'path':
			folderpath = value;
			break;
		case 'format':
			if(!confirm(formatConfirm))
				return;
			if(oem=="D-Link")
			{}
			else
			{
				if(sdstatus == 4)//no sd card
				{
					alert(formatalert);
					return;
				}
				else if(sdstatus == 3)//protected
				{
					alert(formatalert1);
					return;
				}
			}
			command = "format";
			maskmsg = "process";
			break;
		default:
		break;			
	}
	$("#command").val(command);
	$("#filesperpage").val(filesperpage);
	$("#currentpage").val(currentpage);
	$("#folderpath").val(folderpath);
	
	send_submit("form1", maskmsg);	
}
function checkPerformance(name,value)
{	
		if(name < value)
		{
			if(name > 0)
				return true;
			else
				return false;
		}
		else
			return false;
}
function checkPerformance2(name,value)
{	
		if(name < value)		
				return true;
		else
			return false;
}
