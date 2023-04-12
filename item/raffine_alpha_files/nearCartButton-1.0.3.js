(function(_W,_D,_N,_L){
	if(typeof jQuery=="undefined"){return 0;};
	jQuery.noConflict();
	var $=jQuery;
	
	if(typeof s=="undefined"){
			return -1;
		};
		
	_W.clickNearCart = function(){	try{
			
		var s=s_gi(s_account);
		s.linkTrackVars="prop1,prop6";

		$("#scrollUp").click(function(){
		
			var box = $(this).attr("id");
			
			if(s.prop9 && s.prop34){
				s.prop1=s.prop9+"_on";
				s.prop6=s.prop34+"_on";
			}
			else
				return;

			s.tl(this,'o',"nearCartButton");
		});
	}catch(e){return -10;}return 1;

	};
}(window,document,navigator,location))

// edited by Gihyun Ro - 2013/02/06 -
// This code will send values for prop1 and prop6 when the Cart Button is clicked. 

		
 