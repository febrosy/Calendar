/**
 * author by BoShao
 */
var calendar=(function(){
	var calendar=function(obj){
		var date=new Date();
		
		this.obj=obj;
		this.mianCalendar=null;
		this.calendarflag=0;
		this.NowYear=date.getFullYear();
		this.NowMonth=date.getMonth();
		this.NowDay=date.getDate();
		this.PreMonth=this.NowMonth;
		this.PreYear=this.NowYear;
		this.NextMonth=(this.NowMonth+1<12)?this.NowMonth+1:0;
		this.NextYear=this.NowYear;
		
		this.dateBegin;
		this.dateEnd;
		
		this.calewidth=0;
		this.caleheight=0;
		this.CalendarWidth=0;
		this.animateflag=true;
		
		this.setting={
			BeforeDayHide:true
		}
		$.extend(this.setting, this.getSetting());
		
		this.Calendar(this.NowYear,this.NowMonth);
		
		
	}
	calendar.prototype={
		isLeapYear:function(year){
			return (year%100==0?(year%400==0?1:0):(year%4==0?1:0));
		},
		YearMonthDay:function(year){
			return new Array(31,28+this.isLeapYear(year),31,30,31,31,30,31,30,31,30,31);
		},
		fristWeekDay:function(year,month){
			return new Date(year,month,1).getDay();
		},
		lineList:function(year,month){
			return Math.ceil((this.YearMonthDay(year)[month]+this.fristWeekDay(year,month))/7);
		},
		CalendarList:function(year,month,type){
			this.calendarflag+=1;
			
			var m_day=this.YearMonthDay(year);
			var fristweekDay=this.fristWeekDay(year,month);
			var line=this.lineList(year,month);
			if(type=="append"){
				this.mianCalendar.append("<div class='calendar calendar"+this.calendarflag+"'></div>");
			}else if(type=="prepend"){
				this.mianCalendar.prepend("<div class='calendar calendar"+this.calendarflag+"'></div>");
			}
			
			this.mianCalendar.children(".calendar"+this.calendarflag).append("<div class='calendarTopic'><p>"+year+"-"+(month+1)+"</p></div>");
			this.mianCalendar.children(".calendar"+this.calendarflag).append("<table class='tableMain'></table>");
			
			for(var i=-1;i<line;i++){
				$(".tableMain").append("<tr class='date'></tr>");
				for(var k=0;k<7;k++){
					
					if(i==-1){
						var weekDay_str=new Array("Sun","Mon","Tues","Wed","Thur","Fri","Sat")
						this.mianCalendar.children(".calendar"+this.calendarflag).find(".date").last().append("<td class='weekday'>"+weekDay_str[k]+"</td>");
					}else{
						var idx=i*7+k;
						var td=document.createElement("td");
						td.className="day";
						var date=idx-fristweekDay+1;
						(date<=0||date>m_day[month])?date="":date=idx-fristweekDay+1;
						if(this.setting.BeforeDayHide){
							if((year>this.NowYear&&date!="")||(year>=this.NowYear&&month>this.NowMonth&&date!="")||(year>=this.NowYear&&month==this.NowMonth&&date>=this.NowDay)){
								td.className=td.className+" afterDay";
								if(k==0||k==6){
									td.className=td.className+" weekend";
								}
							}
						}else{
							if(date!=""){
								td.className=td.className+" afterDay";
								if(k==0||k==6){
									td.className=td.className+" weekend";
								}
							}
						}
						
						td.append(date);
						this.mianCalendar.children(".calendar"+this.calendarflag).find(".date").last().append(td);
					}
				}
			}
		},
		Calendar:function(year,month){
			var _this_=this;
			this.obj.append("<div class='calendar-main'></div>");
			this.obj.append("<div class='calendar-left-btn'></div>");
			this.obj.append("<div class='calendar-right-btn'></div>");
			this.mianCalendar=this.obj.children(".calendar-main");
			this.CalendarList(this.NowYear,this.NowMonth,"append");
			this.CalendarList(this.NowYear,this.NextMonth,"append");
			
			this.calewidth=this.mianCalendar.children(".calendar")[0].offsetWidth;
			
			this.mianCalendar.children(".calendar").each(function(){
				if($(this)[0].offsetHeight>_this_.caleheight){
					_this_.caleheight=$(this)[0].offsetHeight;
				}
			});
			
			this.obj.width(this.calewidth*2);
			this.obj.height(this.caleheight);
			this.BtnClik();
			this.CalendarShow();
		},
		CalendarSelect:function(){
			var _this_=this;
			
			$(".afterDay").off("click").on("click",function(){
				if($(".afterDaySelect").size()<2){
					$(this).addClass("afterDaySelect");
					
					if($(".afterDaySelect").size()==2){
						$(".afterDaySelect").each(function(index){
							var Day=$(this).html();
							var YearMonth=$(this).closest(".calendar").children(".calendarTopic").children("p").html();
							var date=YearMonth+"-"+Day;
							if(index==0){
								_this_.dateBegin=new Date(date);
								$(".beginDate").html(_this_.dateBegin.toLocaleDateString());
							}else if(index==1){
								_this_.dateEnd=new Date(date);
								$(".endDate").html(_this_.dateEnd.toLocaleDateString());
							}
						});
					}
					
				}else{
					$(".afterDay").removeClass("afterDaySelect");
					$(this).addClass("afterDaySelect");
				}
			});
			
			$(".afterDay").off("mouseover").on("mouseover",function(){
				var _hoverthis_=this;
				var size=$(".afterDaySelect").size();
				if(size==1){
					var selectIndex=$(".afterDaySelect").index(".afterDay");
					var hoverIndex=$(_hoverthis_).index(".afterDay");
					$(".afterDay").each(function(index,obj){
						if((index<hoverIndex&&index>selectIndex)||(index>hoverIndex&&index<selectIndex)){
							$(obj).addClass("interval");
						}else{
							$(obj).removeClass("interval");
						}
					});
				}
				
			}).on("mouseout",function(){
				if($(".afterDaySelect").size()<2){
					$(".afterDay").removeClass("interval");
				}
			});
		},
		NextCalendar:function(){
			this.NextMonth+=1;
			if(this.NextMonth>=12){
				this.NextYear+=1;
				this.NextMonth=0;
			}
			
			this.CalendarList(this.NextYear,this.NextMonth,"append");
		},
		PreCalendar:function(){
			this.PreMonth-=1;
			if(this.PreMonth<0){
				this.PreYear-=1;
				this.PreMonth=11;
			}
			this.CalendarList(this.PreYear,this.PreMonth,"prepend");
		},
		BtnClik:function(){
			var _this_=this;
			_this_.CalendarSelect();
			
			$(".calendar-right-btn").on("click",function(){
				if(_this_.animateflag){
					_this_.animateflag=false;
					
					_this_.NextCalendar();
					_this_.CalendarSelect();
					var animateleft=_this_.mianCalendar[0].offsetLeft-_this_.calewidth;
					
					_this_.mianCalendar.animate({
						left:animateleft
					},function(){
						_this_.animateflag=true;
					});
				}
				
			});
			
			$(".calendar-left-btn").on("click",function(){
				if(_this_.animateflag){
					_this_.animateflag=false;
					
					_this_.PreCalendar();
					_this_.CalendarSelect();
					var Mainleft=_this_.mianCalendar[0].offsetLeft-_this_.calewidth;
					_this_.mianCalendar.css("left",Mainleft);
					var animateleft=_this_.mianCalendar[0].offsetLeft+_this_.calewidth;
					_this_.mianCalendar.animate({
						left:animateleft
					},function(){
						_this_.animateflag=true;
					});
				}
			});
		},
		getSetting:function(){
			var setting=this.obj.attr("data-setting");
			if(setting!=""&&setting){
				return JSON.parse(setting);
			}else{
				return {};
			}
		},
		CalendarShow:function(){
			var _this_=this;
			$("#calendarBar").on("click",function(){
				if(_this_.obj.hasClass("visible")){
					_this_.obj.removeClass("visible");
				}else{
					_this_.obj.addClass("visible");
				}
			});
		}
	
	}
	
	return calendar;
}());


;(function(){
	calendar.init=function(obj){
		new calendar(obj);
	}
	window["calendar"]=calendar;
})(jQuery);
