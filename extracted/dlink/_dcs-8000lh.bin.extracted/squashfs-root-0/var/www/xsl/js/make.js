(function(){
        $.extend($.fn,{
            mask: function(msg,maskDivClass){
                this.unmask();
 
                var op = {
                    opacity: 0.8,
                    z: 10000,
                    bgcolor: '#ccc'
                };
                var original=$(document.body);
                var position={top:0,left:0};
                            if(this[0] && this[0]!==window.document){
                                original=this;
                                position=original.position();
                            }
                var maskDiv=$('<div class="maskdivgen">&nbsp;</div>');
                maskDiv.appendTo(original);
                var maskWidth=original.outerWidth();
                if(!maskWidth){
                    maskWidth=original.width();
                }
                var maskHeight=original.outerHeight();
                if(!maskHeight){
                    maskHeight=original.height();
                }
                maskDiv.css({
                    position: 'fixed',
                    top: position.top,
                    left: position.left,
                    'z-index': op.z,
                  	width: maskWidth,
                    height: maskHeight,
                    'background-color': op.bgcolor,
                    opacity: 0
                });
                if(maskDivClass){
                    maskDiv.addClass(maskDivClass);
                }
                if(msg){
                    var msgDiv=$('<div class="loding" style=""><div id="loadmsg" class="lodingContent">'+msg+'</div></div>');
                    msgDiv.appendTo(maskDiv);
					var contentHeight = document.getElementById("main").scrollHeight;
					var contentWidth = document.getElementById("main").scrollWidth;
					if(contentHeight > document.body.clientHeight)
						contentHeight = document.body.clientHeight;
						
                    var widthspace=(contentWidth-msgDiv.width());
                    var heightspace=(contentHeight-msgDiv.height());
					var mot = document.getElementById("motGroup");
					var img = document.getElementById("imgGroup");
					
					if(heightspace > 150){
                    	msgDiv.css({
							cursor:'wait',
							top:(heightspace/2-40),
							//top: 150,
							left:(widthspace/2-2)
							});
					}else{
						msgDiv.css({
							cursor:'wait',
							top:(heightspace/2),
							//top: 150,
							left:(widthspace/2-2)
							});
					}
					
					var url = window.location.href.split("admin/");

					url = url[1];
					url = url.replace(".cgi", "");
					if ((url == "adv_record") && (oem == "Trendnet") && msg.length>20)
					{
						document.getElementById("loadmsg").style.fontSize = 16+"px";
						document.getElementById("loadmsg").style.width = 500 + "px";
						if(heightspace > 130){
                    		msgDiv.css({
								cursor:'default',
								top:((maskHeight-msgDiv.height())/2-40),
								//top: 150,
								left:((contentWidth-msgDiv.width())/2-2)
							});
						}else{
							msgDiv.css({
								cursor:'default',
								top:(heightspace/2),
								//top: 150,
								left:((contentWidth-msgDiv.width())/2-2)
								});
						}
					}
					
					if(url == "cam_control")
					{
						if(productoem=="Alphanetworks")	
						{
							msgDiv.css({
								cursor:'wait',
								top:(maskHeight/2-40),
								left:(maskWidth/2-50)
								});
						}
					
					}
					
					if(mot || (url == "netWizard")) //special for netWizard and motWizard
					{
						if ((url == "netWizard") && (oem == "Trendnet")){
							msgDiv.css({
								cursor:'wait',
								top:(heightspace/2-2),
								left:(widthspace/2 + 10)  
                     		});
						}
						else if ((url == "netWizard") && (oem == "Alphanetworks")){
							msgDiv.css({
								cursor:'wait',
								top:(heightspace/2-2),
								left:(widthspace/2)  
                     		});
						}
						else{
							msgDiv.css({
									cursor:'wait',
									top:(heightspace/2-2),
									left:(widthspace/2+138)  //special for Setup/Motion Detection page
                      		});
						}
					}
					
					if(img)
					{
						if(productoem!="Trendnet")
						{
							msgDiv.css({
									cursor:'wait',
								   	top:(heightspace/2+165), //special for Setup/Image page
									left:(widthspace/2-2)
							});	
						}
						else
						{
							msgDiv.css({
									cursor:'wait',
								   	top:(heightspace/2+25), //special for Setup/Image page
									left:(widthspace/2-2)
							});		
						}
					}
					
                  }
                  maskDiv.show('fast', function(){
                    $(this).fadeTo('fast', op.opacity);
                })
                return maskDiv;
            },
         unmask: function(){
                     var original=$(document.body);
                         if(this[0] && this[0]!==window.document){
                            original=$(this[0]);
                      }
                      original.find("> div.maskdivgen").fadeOut('slow',0,function(){
                          $(this).remove();
                      });
            }
        });
    })();
