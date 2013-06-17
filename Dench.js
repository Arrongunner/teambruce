function delay() {
	setTimeout("load();", 6000);
	setTimeout(function(){RoomUser.audience.roomElements = []; RoomUser.redraw();}, 4000);
	setTimeout("chatListener()", 10000);
}

function load() {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'http://cookies.googlecode.com/svn/trunk/jaaulde.cookies.js';
	script.onload = readCookies;
	head.appendChild(script);
}

function readCookies() {
	var currentDate = new Date();
	currentDate.setFullYear(currentDate.getFullYear() + 1);
    	var newOptions = {
    		expiresAt: currentDate
    	}
    	jaaulde.utils.cookies.setOptions(newOptions);
    	var value = jaaulde.utils.cookies.get(COOKIE_WOOT);
    	autowoot = value != null ? value : false;
    	value = jaaulde.utils.cookies.get(COOKIE_QUEUE);
    	autoqueue = value != null ? value : false;
    	value = jaaulde.utils.cookies.get(COOKIE_STREAMING);
    	streaming = value != null ? value: true;
    	value = jaaulde.utils.cookies.get(COOKIE_HIDE_VIDEO);
    	hideVideo = value != null ? value : false;
    	var value = jaaulde.utils.cookies.get(COOKIE_EMOTES);
    	emotes = value != null ? value : true;
    	var value = jaaulde.utils.cookies.get(COOKIE_AUDIENCE);
    	audience = value != null ? value : true;
    	var value = jaaulde.utils.cookies.get(COOKIE_LEFT);
    	left = value != null ? value : false;
	onCookiesLoaded();
}

function onCookiesLoaded() {
	if (autowoot) {
		setTimeout("$('#button-vote-positive').click();", 7000);
	}
	if (autoqueue && !isInQueue()) {
		joinQueue();
	}
	if (hideVideo) {
		$('#yt-frame').animate({'height': (hideVideo ? '0px' : '271px')}, {duration: 'fast'});
		$('#playback .frame-background').animate({'opacity': (hideVideo ? '0' : '0.91')}, {duration: 'medium'});
	}
	if (left) {
		$(".sidebar#side-left").animate({"left": left ? "0px" : "-190px"}, 300, "easeOutCirc");
	}
	if (emotes) {
		Emoji.emojify = function(a) {
			var b=!1;": "==a.substr(0,2)&&(b=!0,a=a.substr(2));for(var c in Emoji._cons)var d=c,e=Emoji._cons[c],d=d.replace("<","&lt;").replace(">","&gt;"),d=RegExp("(\\s|^)("+Emoji._regexEscape(d)+")(?=\\s|$)","g"),a=a.replace(d,"$1:"+e+":");for(c=Emoji._matchStr.exec(a);c;)e=c[1].toLowerCase(),d="&colon;"+e+"&colon;",Emoji._map[e]&&(d='<span class="emoji-glow"><span class="emoji emoji-'+Emoji._map[e]+'"></span></span>'),a=a.substr(0,c.index)+d+a.substr(c.index+c[0].length),c=Emoji._matchStr.exec(a);return(b?": ":"")+a
		}
	}
	if (!emotes) Emoji.emojify = function(data) {
		return data;
	}
	if (!audience) {
		$('#audience').hide();
	}
    	initAPIListeners();
    	displayUI();
    	initUIListeners();
    	populateUserlist();
}

var words = {
"Points" : "Ratings!",
"Now Playing" : "Now Spinning!",
"Time Remaining" : "Time Remaining!",
"Volume" : "Pump the Volume!",
"Current DJ" : "Disk Jockey",
"Crowd Response" : "Crowd Reaction!",
"Fans":"Followers!"};

String.prototype.prepareRegex = function() {
return this.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, "\\$1");
};

function isOkTag(tag) {
return (",pre,blockquote,code,input,button,textarea".indexOf(","+tag) == -1);
}

var regexs=new Array(),
    replacements=new Array();
for(var word in words) {
if(word != "") {
regexs.push(new RegExp("\\b"+word.prepareRegex().replace(/\*/g,'[^ ]*')+"\\b", 'gi'));
replacements.push(words[word]);
}
}

var texts = document.evaluate(".//text()[normalize-space(.)!='']",document.body,null,6,null), text="";
for(var i=0,l=texts.snapshotLength; (this_text=texts.snapshotItem(i)); i++) {
	if(isOkTag(this_text.parentNode.tagName.toLowerCase()) && (text=this_text.textContent)) {
	for(var x=0,l=regexs.length; x<l; x++) {
	text = text.replace(regexs[x], replacements[x]);
	this_text.textContent = text;
	}
	}
}

var mentioned = false;
var clicked = false;
var predictor = false;
var timeToWait = 600000;
var clickWait = 5000;
var timePassed = 0;
var clickPassed = 0;
var predictPassed = 0;
var timer = null;
var clickTimer = null;
var predictTimer = null;
var COOKIE_WOOT = 'autowoot';
var COOKIE_QUEUE = 'autoqueue';
var COOKIE_STREAMING = 'streaming';
var COOKIE_HIDE_VIDEO = 'hidevideo';
var COOKIE_EMOTES = 'emotes';
var COOKIE_AUDIENCE = 'audience';
var COOKIE_LEFT = 'left';
var MAX_USERS_WAITLIST = 50;

var loveMsg = ["I love this song! Makes me want to jizz in my pants.", "I love this song like a black man loves chicken!", "This... song... is... DENCH!!", "Absolute fucking classic!", "#DenchTune"];
var mehMsg = ["Not sure if i love or hate this :S", "meh.. not the best :L", "decent, but i've heard better..."];
var hateMsg = ["wtf is this song.. #LeaveIT", "my ears are fucking bleeding, turn this shit off", "this song is worse than Dafuq League."];
var sleepMsg = ["Off for a fap before bed, night!", "sleeping now, peace out mandems", "so tired, *sleeps* zzzZZ!", "tiredness... must sleep... feel like a fucking zombie!", "Going to bed, night night <3"];
var workMsg = ["Going to do some work, mention if needed!", "I'm gonna be busy, do not disturb!"];
var afkMsg = ["I'm going for a fap, be back soon!", "Going to shag your mum!", "Going for a spray tan! #Essex #Reem", "Going to hunt the galaxy, be back soon!", "Going to go report Dafuq League!", "Gonna' go download some more RAM!"];
var backMsg = ["Just got back from Denchville, two twos now.", "I'm baaacckkk bitches!", "Guess who's back? ME! I'm back :D", "I just came, what did I miss?"];

var autoAwayMsg = ["I'm currently AFK", "Selling weed, brb. (afk)", "Gone for a wank, be back soon!", "Not present at keyboard."];
var autoSlpMsg = ["I'm currently sleeping", "I'm shagging Megan Fox in my dream, do not disturb!", "I've hit the sack", "I'm asleep in bed with your mum."];
var autoWrkMsg = ["I'm currently working", "I'm busy", "I'm pretending to work, but really I'm just ignoring you...", "Trying to earn a dollar, your mum charges high rates!"];

var styles = [
            '.sidebar {position: fixed; top: 0; height: 100%; width: 200px; z-index: 99999; background-image: linear-gradient(bottom, #000000 0%, #3F3F3F 100%);background-image: -o-linear-gradient(bottom, #000000 0%, #3F3F3F 100%);background-image: -moz-linear-gradient(bottom, #000000 0%, #3F3F3F 100%);background-image: -webkit-linear-gradient(bottom, #000000 0%, #3F3F3F 100%);background-image: -ms-linear-gradient(bottom, #000000 0%, #3F3F3F 100%);background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0, #000000),color-stop(1, #3F3F3F));}',
            '.sidebar#side-right {right: -190px;z-index: 99999;}',
            '.sidebar#side-left {left: -190px; z-index: 99999; }',
            '.sidebar-handle {width: 12px;height: 100%;z-index: 99999;margin: 0;padding: 0;background: rgb(216, 216, 216);box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .9);cursor: "ne-resize";}',
            '.sidebar-handle span {display: block;position: absolute;width: 10px;top: 50%;text-align: center;letter-spacing: -1px;color: #000;}',
            '.sidebar-content {position: absolute;width: 185px;height: 100%; padding-left: 15px}',
            '.sidebar-content2 {position: absolute;width: 185px;height: 100%; overflow: auto}',
            '.sidebar-content2 h3 {font-weight: bold; padding-left: 5px; padding-bottom: 5px; margin: 0;}',
            '.sidebar-content2 a {font-weight: bold; font-size: 13px; padding-left: 5px;}',
            '#side-right .sidebar-handle {float: left;}',
            '#side-left .sidebar-handle {float: right;}',
            '#side-right a {display: block;min-width: 100%;cursor: pointer;padding: 4px 5px 8px 5px;border-radius: 4px;font-size: 13px;}',
            '.sidebar-content2 span {display: block; min-width: 94%;cursor: pointer;border-radius: 4px; padding: 0 5px 0 5px; font-size: 12px;}',
            '#side-right a span {padding-right: 8px;}',
            '#side-right a:hover {background-color: rgba(97, 146, 199, 0.65);text-decoration: none;}',
            '.sidebar-content2 span:hover {background-color: rgba(97, 146, 199, 0.65);text-decoration: none;}',
            '.sidebar-content2 a:hover {text-decoration: none;}',
            'html{background: url(http://i.imgur.com/gLXM3Vl.jpg) no-repeat scroll center top #000000;}',
            '#room-wheel {z-index: 2;position: absolute;top: 2px;left: 0;width: 1044px;height: 394px;background: url(http://) no-repeat;display: none;}',
            '.chat-bouncer {background: url(http://i.imgur.com/9qWWO4L.png) no-repeat 0 5px;padding-left: 17px;width: 292px;}',
            '.chat-manager {background: url(http://i.imgur.com/hqqhTcp.png) no-repeat 0 5px;padding-left: 17px;width: 292px;}',
            '.chat-cohost {background: url(http://i.imgur.com/njajqVG.png) no-repeat 0 5px;padding-left: 17px;width:292px;}',
            '.chat-host {background: url(http://i.imgur.com/njajqVG.png) no-repeat 0 5px;padding-left: 17px;width: 292px;}',
            '#dj-console, #dj-console {background-image: url(http://i.imgur.com/gqdMdaz.gif);min-height:33px;min-width:131px;}',
            '.chat-from-you {color: #0099FF;font-weight: bold;margin-top: 0px; padding-top: 0px;}',
            '.chat-from-featureddj {color: rgb(255, 0, 135); font-weight: bold; margin-top: 0px; padding-top: 0px;}',
            '.chat-from-bouncer {color: rgb(199, 0, 199); font-weight: bold; margin-top: 0px; padding-top: 0px;}',
            '.chat-from-manager {color: rgb(255, 199, 148); font-weight: bold; margin-top: 0px; padding-top: 0px;}',
            '.chat-from-cohost {color: rgb(255, 92, 0); font-weight: bold; margin-top: 0px; padding-top: 0px;}',
            '.chat-from-host {color: #32CD32;font-weight: bold;margin-top: 0px; padding-top: 0px;}',
            '#user-points-title {color: #FFFFFF; position: absolute; left: 36px; font-size: 10px;}',
            '#user-fans-title {color: #FFFFFF; position: absolute; left: 29px; font-size: 10px;}',
            '.meta-header span {color: rgba(255, 255, 255, 0.79); position: absolute; left: 15px; font-size: 10px;}',
            '#button-lobby {background-image: url(http://i.imgur.com/brpRaSY.png);}',
            '#volume-bar-value {background-image: url(http://i.imgur.com/xmyonON.png) ;}',
            '.chat-message:nth-child(2n), .chat-mention:nth-child(2n), .chat-skip:nth-child(2n), .chat-moderation:nth-child(2n), .chat-emote:nth-child(2n), .chat-update:nth-child(2n) {background-color: rgba(26, 26, 26, 0.65);}',
            '.frame-background {background-color: rgba(0, 0, 0, 0.8);}',
            '#hr-div {height: 100%; width: 100%;margin: 0;padding-left: 12px;}',
            '#hr2-div2 {height: 100%; width: 100%;margin: 0;}',
            '#hr-style {position: absolute;display: block;height: 20px;width: 100%;bottom: 0%;background-image: url(http://i.imgur.com/jQhf3BW.png);}',
            '#hr2-style2 {position: absolute;display: block;height: 20px;width: 94%%;bottom: 0%;background-image: url(http://i.imgur.com/jQhf3BW.png);}',
            '#side-left h3 {padding-left: 5px}',
            '::-webkit-scrollbar {height: 6px; width: 6px;}',
            '::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); -webkit-border-radius: 6px;border-radius: 6px;}',
            '::-webkit-scrollbar-thumb {-webkit-border-radius: 2px;border-radius: 6px;background: rgba(232,37,236,0.8); -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.5);}',
            '::-webkit-scrollbar-thumb:window-inactive {background: rgba(232,37,236,0.4);}',
];

var scripts = [
            '(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery)',
            'if (jQuery.easing.easeOutCirc === undefined) jQuery.easing.easeOutCirc = function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a}',
            '$("#side-right").hoverIntent(function() {var timeout_r = $(this).data("timeout_r");if (timeout_r) {clearTimeout(timeout_r);}$(this).animate({"right": "0px"}, 500, "easeOutCirc");}, function() {$(this).data("timeout_r", setTimeout($.proxy(function() {$(this).animate({"right": "-190px"}, 500, "easeOutCirc");}, this), 500));});',
];

function initAPIListeners() {
	API.addEventListener(API.DJ_ADVANCE, djAdvanced);
  	API.addEventListener(API.CHAT, autoRespond);
  	API.addEventListener(API.DJ_UPDATE, queueUpdate);
  	API.addEventListener(API.VOTE_UPDATE, function (obj) {
            	populateUserlist();

    	});
	API.addEventListener(API.USER_JOIN, function (user) {
          	populateUserlist();
    	});
    	API.addEventListener(API.USER_LEAVE, function (user) {
            	populateUserlist();
    	});
}

function displayUI() {
	var colorWoot = autowoot ? '#3FFF00' : '#ED1C24';
    	var colorQueue = autoqueue ? '#3FFF00' : '#ED1C24';
    	var colorStream = streaming ? '#3FFF00' : '#ED1C24';
    	var colorVideo = hideVideo ? '#3FFF00' : '#ED1C24';
    	var colorEmotes = emotes ? '#3FFF00' : '#ED1C24';
    	var colorAudience = audience ? '#3FFF00' : '#ED1C24';
	$('#side-right .sidebar-content').append(
			'<a title="Commands" style="color:#FFFFF">Commands:</a>'
		+	'<a id="plug-btn-woot" title="Toggle AutoWoot" style="color:' + colorWoot + '">AutoWoot</a>'
		+ 	'<a id="plug-btn-queue" title="Toggle AutoQueue" style="color:' + colorQueue + '">AutoQueue</a>'
		+ 	'<a id="plug-btn-stream" title="Toggle Video Stream" style="color:' + colorStream + '">Video Streaming</a>'
		+ 	'<a id="plug-btn-hidevideo" title="Toggle Video" style="color:' + colorVideo + '">Hide Video</a>'
		+	'<a id="plug-btn-emotes" title="Toggle Emoticons" style="color:' + colorEmotes + '">Emoticons</a>'
		+	'<a id="plug-btn-audience" title="Toggle Audience" style="color:' + colorAudience + '">Audience</a>'
		+	'<a title="Comment on song" style="color:#FFFFF">Comment on song:</a>'
		+	'<a id="plug-btn-lovesong" title="Sends love song message" style="color:#FF8C00">Love this song!</a>'
		+	'<a id="plug-btn-mehsong" title="Sends meh song message" style="color:#FF8C00">Not fan of song!</a>'
		+	'<a id="plug-btn-hatesong" title="Sends hate song message" style="color:#FF8C00">Hates this song!</a>'
		+	'<a title="Changes your status" style="color:#FFFFF">Status:</a>'
		+	'<a id="plug-btn-sleeping" title="Sends sleep message and sets status to sleeping" style="color:#FF8FEE">Sleeping</a>'
		+	'<a id="plug-btn-working" title="Sends work message and sets status to working" style="color:#FF8FEE">Working</a>'
		+	'<a id="plug-btn-afk" title="Sends afk message and sets status to afk" style="color:#FF8FEE">AFK</a>'
		+	'<a id="plug-btn-back" title="Sends available message and sets status to available" style="color:#FF8FEE">Available</a>'
		+	'<a  onclick="rules()" title="Displays Rules" style="color:#FFFFFF">Click for Rules!</a>'
        +	'<div id="spacer_div"></br></br></div>'
		+	'<a  onclick="dench()" title="Displays Dench" style="color:#FFFFFF">Dench!</a>'
    );
}

function rules() {
	alert("Rules: \n1) House and EDM only! \n2) No songs over 8 minutes \n3) No flaming \n4) No spamming \n5) Respect Staff \n6) Stay Dench!");
}

function dench() {
	alert("Definition: \n When something is dench, denchable, denchtastic, denchalicious or even dencherific. Dench is out of this world. Dench is amazing. Dench is everything good in your life. #StayDench or get Frimpong'd.");
}

function initUIListeners() {
	$(".sidebar-handle").on("click", function() {
		left = !left;
		$(".sidebar#side-left").animate({"left": left ? "0px" : "-190px"}, 300, "easeOutCirc");
		jaaulde.utils.cookies.set(COOKIE_LEFT, left);
	});
	$("#plug-btn-woot").on("click", function() {
		autowoot = !autowoot;
		$(this).css("color", autowoot ? "#3FFF00" : "#ED1C24");
		if (autowoot) {
			setTimeout("$('#button-vote-positive').click();", 7000);
		}
		jaaulde.utils.cookies.set(COOKIE_WOOT, autowoot);
	});
	$("#plug-btn-queue").on("click", function() {
		autoqueue = !autoqueue;
        	$(this).css('color', autoqueue ? '#3FFF00' : '#ED1C24');
        	if (autoqueue && !isInQueue()) {
        		joinQueue();
        	}
        	jaaulde.utils.cookies.set(COOKIE_QUEUE, autoqueue);
	});
	$("#plug-btn-stream").on("click", function() {
		streaming = !streaming;
		$(this).css("color", streaming ? "#3FFF00" : "#ED1C24");
		API.sendChat(DB.settings.streamDisabled ? '/stream on' : '/stream off');
		jaaulde.utils.cookies.set(COOKIE_STREAMING, streaming);
	});
	$("#plug-btn-hidevideo").on("click", function() {
		hideVideo = !hideVideo;
		$(this).css("color", hideVideo ? "#3FFF00" : "#ED1C24");
		$("#yt-frame").animate({"height": (hideVideo ? "0px" : "271px")}, {duration: "fast"});
		$("#playback .frame-background").animate({"opacity": (hideVideo ? "0" : "0.91")}, {duration: "medium"});
		jaaulde.utils.cookies.set(COOKIE_HIDE_VIDEO, hideVideo);
	});
	$("#plug-btn-emotes").on("click", function() {
		emotes = !emotes;
		$(this).css("color", emotes ? "#3FFF00" : "#ED1C24");
		if (emotes) {
			Emoji.emojify = function(a) {
				var b=!1;": "==a.substr(0,2)&&(b=!0,a=a.substr(2));for(var c in Emoji._cons)var d=c,e=Emoji._cons[c],d=d.replace("<","&lt;").replace(">","&gt;"),d=RegExp("(\\s|^)("+Emoji._regexEscape(d)+")(?=\\s|$)","g"),a=a.replace(d,"$1:"+e+":");for(c=Emoji._matchStr.exec(a);c;)e=c[1].toLowerCase(),d="&colon;"+e+"&colon;",Emoji._map[e]&&(d='<span class="emoji-glow"><span class="emoji emoji-'+Emoji._map[e]+'"></span></span>'),a=a.substr(0,c.index)+d+a.substr(c.index+c[0].length),c=Emoji._matchStr.exec(a);return(b?": ":"")+a
			}
		}
		if (!emotes) Emoji.emojify = function(data) {
			return data;
		}
		jaaulde.utils.cookies.set(COOKIE_EMOTES, emotes);
	});
	$("#plug-btn-audience").on("click", function() {
		audience = !audience;
		$(this).css("color", audience ? "#3FFF00" : "#ED1C24");
		if (audience) {
			$('#audience').show();
		}
		if (!audience) {
			$('#audience').hide();
		}
		jaaulde.utils.cookies.set(COOKIE_AUDIENCE, audience);
	});
	$("#plug-btn-lovesong").on("click", function() {
  	if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			API.sendChat(loveMsg[Math.floor(Math.random() * loveMsg.length)]);
		}
	});
	$("#plug-btn-mehsong").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			API.sendChat(mehMsg[Math.floor(Math.random() * mehMsg.length)]);
		}
	});
	$("#plug-btn-hatesong").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			API.sendChat(hateMsg[Math.floor(Math.random() * hateMsg.length)]);
		}
	});
	$("#plug-btn-sleeping").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			if (Models.user.data.status != 3) {
				API.sendChat(sleepMsg[Math.floor(Math.random() * sleepMsg.length)]);
				Models.user.changeStatus(3);
			}
		}
	});
	$("#plug-btn-working").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			if (Models.user.data.status != 2) {
				API.sendChat(workMsg[Math.floor(Math.random() * workMsg.length)]);
				Models.user.changeStatus(2);
			}
		}
	});	
	$("#plug-btn-afk").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			if (Models.user.data.status != 1) {
				API.sendChat(afkMsg[Math.floor(Math.random() * afkMsg.length)]);
				Models.user.changeStatus(1);
			}
		}
	});
	$("#plug-btn-back").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval(function() {checkClicked()}, 1000);
			if (Models.user.data.status != 0) {
				API.sendChat(backMsg[Math.floor(Math.random() * backMsg.length)]);
				Models.user.changeStatus(0);
			}
		}
	});
}

function queueUpdate() {
	if (autoqueue && !isInQueue()) {
		joinQueue();
    	}
}

function isInQueue() {
	var self = API.getSelf();
    	return API.getWaitList().indexOf(self) !== -1 || API.getDJs().indexOf(self) !== -1;
}

function joinQueue() {
	if ($('#button-dj-play').css('display') === 'block') {
		$('#button-dj-play').click();
    	} 
	else if (API.getWaitList().length < MAX_USERS_WAITLIST) {
        API.waitListJoin();
    	}
}

function autoRespond(data) {
	var a = data.type == "mention" && Models.room.data.staff[data.fromID] && Models.room.data.staff[data.fromID] >= Models.user.BOUNCER, b = data.message.indexOf('@') >0;
	if (data.type == "mention" && mentioned == false) {
		if (API.getUser(data.fromID).status == 0) {
			mentioned = true;
			timer = setInterval("checkMentioned();", 1000);
			if (Models.user.data.status == 1) {
				API.sendChat("@" + data.from + " automsg: " + autoAwayMsg[Math.floor(Math.random() * autoAwayMsg.length)]);
			}
			if (Models.user.data.status ==2) {
				API.sendChat("@" + data.from + " automsg: " + autoWrkMsg[Math.floor(Math.random() * autoWrkMsg.length)]);
			}
			if (Models.user.data.status ==3) {
				API.sendChat("@" + data.from + " automsg: " + autoSlpMsg[Math.floor(Math.random() * autoSlpMsg.length)]);
			}
		}
	}
}

function djAdvanced(obj) {
	if (hideVideo) {
		$("#yt-frame").css("height", "0px");
		$("#playback .frame-background").css("opacity", "0.0");
	}
	if (autowoot) {
		setTimeout("$('#button-vote-positive').click();", 5000);
	}
	if (predictor == false) {
		predictor = true;
		predictTimer = setInterval("checkPredict()", 1000);
	}
}

function populateUserlist() {
	var currentdj = '';
	var mehlist = '';
    	var wootlist = '';
    	var undecidedlist = '';
	var a = API.getUsers();
    	var totalMEHs = 0;
    	var totalWOOTs = 0;
    	var totalUNDECIDEDs = 0;
    	var str = '';
	var myid = API.getSelf().id;
	for (i in a) {
		if (a[i].admin) {
			a[i].permission = 99;
		}
		if (a[i].ambassador) {
			a[i].permission = 50;
		}
        	str = '<span class="chat-from-clickable ';
        	if (typeof (a[i].permission) !== 'undefined' && a[i].permission == 99) {
            		str += 'chat-from-admin ';
        	} else if (typeof (a[i].permission) !== 'undefined' && a[i].permission == 50) {
            		str += 'chat-from-ambassador ';
        	}
        	else if (typeof (a[i].permission) !== 'undefined' && a[i].permission == 5) {
            		str += 'chat-from-host ';
        	}
        	else if (typeof (a[i].permission) !== 'undefined' && a[i].permission == 4) {
            		str += 'chat-from-cohost ';
        	}
        	else if (typeof (a[i].permission) !== 'undefined' && a[i].permission == 3) {
            		str += 'chat-from-manager ';
        	}
        	else if (typeof (a[i].permission) !== 'undefined' && a[i].permission == 2) {
            		str += 'chat-from-bouncer ';
        	}
        	else if (typeof (a[i].permission) !== 'undefined' && a[i].permission == 1) {
            		str += 'chat-from-featureddj ';
        	}
        	if (a[i].id === myid) {
            		str += 'chat-from-you ';
        	}
        	str += '" onclick="$(\'#chat-input-field\').val($(\'#chat-input-field\').val() + \'@' + a[i].username + ' \').focus();" title="Click to mention">' + a[i].username + '</span>';
        	if (typeof (a[i].vote) !== 'undefined' && a[i].vote == -1) {
            		totalMEHs++;
            		mehlist += str; 
        	} 
        	else if (typeof (a[i].vote) !== 'undefined' && a[i].vote == +1) {
            		totalWOOTs++;
            		wootlist += str; 
        	}
        	else if (a[i].id == Models.room.data.currentDJ) {
        		currentdj += str;
        	}
        	else {
            		totalUNDECIDEDs++;
            		undecidedlist += str; 
        	}
    	}
    	var totalDECIDED = totalWOOTs + totalMEHs;
    	var totalUSERS = totalDECIDED + totalUNDECIDEDs;
    	var totalMEHsPercentage = Math.round((totalMEHs / totalUSERS) * 100);
    	var totalWOOTsPercentage = Math.round((totalWOOTs / totalUSERS) * 100);
    	if (isNaN(totalMEHsPercentage) || isNaN(totalWOOTsPercentage)) {
        	totalMEHsPercentage = totalWOOTsPercentage = 0;
    	}
    	currentdj = ' ' + currentdj;
	mehlist = '<a title="Total">' + ' ' + totalMEHs.toString() + '</a><a title="Percentage">' + ' (' + totalMEHsPercentage.toString() + '&#37;)' + '</a>' + mehlist;
    	wootlist = '<a title="Total">' + ' ' + totalWOOTs.toString() + '</a><a title="Percentage">' + ' (' + totalWOOTsPercentage.toString() + '&#37;)' + '</a>' + wootlist;
    	undecidedlist = ' ' + totalUNDECIDEDs.toString() + undecidedlist;
	if ($('#side-left .sidebar-content2').children().length > 0) {
            	$('#side-left .sidebar-content2').append();
	}
        $('#side-left .sidebar-content2').html('<h3 class="Users" title="Number of users in the room">Users: ' + API.getUsers().length + '</h3>');
        var spot = Models.room.getWaitListPosition();
        var waitlistDiv = $('<h3 title="Waitlist position"></h3>').addClass('waitlistspot').text('Waitlist: ' + (spot !== null ? spot + ' / ' : '') + Models.room.data.waitList.length);
        var waitpostime = Models.room.getWaitListPosition() * 240;
        var offset = API.getMedia().duration - 240;
        var approxtime = waitpostime + offset;
        var timeDiv = $('<h3 title="approx. wait time until on the booth"</h3>').addClass('timewait').text('wait: ' + (spot !== null ? sts(decodeURIComponent(approxtime)) + ' ' : ''));
        $('#side-left .sidebar-content2').append(waitlistDiv);
        $('#side-left .sidebar-content2').append(spot !== null ? timeDiv : '');
        $('#side-left .sidebar-content2').append('<div class="meanlist"></div>');
        $(".meanlist").append( 
        		'<div id="spacer_div"></br></br></div>'
        	+	'<div id="currentdj_div" style="border: 2px solid rgb(0, 112, 255);"><a title="Current DJ">Current DJ:</a>' +   currentdj + '</div>'
        	+	'<div id="spacer_div"></br></br></div>'
        	+ 	'<div id="mehlist_div" style="border: 2px solid rgb(233, 6, 6);"><a title="Meh list">Meh list:</a>' +   mehlist + '</div>' 
        	+	'<div id="spacer_div"></br></br></div>'
        	+ 	'<div id="wootlist_div" style="border: 2px solid rgb(2, 140, 7);"><a title="Woot list">Woot list:</a>' + wootlist + '</div>'
        	+	'<div id="spacer_div"></br></br></div>'
        );
}

function sts(secs) {
	var nohrs = Math.floor((secs % 86400) / 3600);
	var nomins = Math.floor(((secs % 86400) % 3600) / 60);
	if (nohrs > 0) {
		if (nomins >9) {
			return nohrs + ":" + nomins
		} else {
			return nohrs + ":0" + nomins
		}
	} else {
		if (nomins > 1) {
			return nomins + " mins"
		}
	}
}

function checkMentioned() {
	if(timePassed >= timeToWait) {
		clearInterval(timer);
		mentioned = false;
		timePassed = 0;
	}
	else {
		timePassed = timePassed + 1000;
	}
}

function checkClicked() {
	if (clickPassed >= clickWait) {
		clearInterval(clickTimer);
		clicked = false;
		clickPassed = 0;
	}
	else {
		clickPassed = clickPassed + 1000;
	}
}

function checkPredict() {
	if (predictPassed >= API.getMedia().duration) {
		clearInterval(predictTimer);
		predictor = false;
		predictPassed = 0;
	}
	else {
		predictPassed = predictPassed + 1;
	}
}

String.prototype.equalsIgnoreCase = function(other) { 
	return typeof other !== 'string' ? false : this.toLowerCase() === other.toLowerCase();
}

ccm = Class.extend({
	init: function() {
        	Models.chat.chatCommand = this.customChatCommand;
        	ChatModel.chatCommand   = this.customChatCommand;
     	},
	customChatCommand: function(a) {
		var b;
	 	if ("/commands" == a) {
			return log('<span><strong>Extra Commands:</strong></br>/ca &nbsp; Change Avatar</br>/strobe off &nbsp; Deactivate Strobes</span>'), !0;
		}        
		if ("/ca" == a) {
			return Models.user.changeAvatar("halloween" + prompt("Enter Avatar Number:\r\r01 - Male Vampire\r02 - Female Vampire\r03 - Male Frankenstein\r04 - Female Frankenstein\r05 - Male Skeleton\r06 - Female Skeleton\r07 - Male Mummy\r08 - Female Mummy\r09 - Male Ghost\r10 - Male Werewolf\r11 - Pumpkin Man\r12 - Female Werewolf\r13 - Male Zombie", "01")), !0;
	        }
		if ("/strobe off" == a) {
			log('<span>strobes deactivated!</span>'); 
			return RoomUser.audience.strobeMode(false), !0;
		}
		if ("strobe on" == a) {
			return log('<span>command invalid!</span>');
		}
		if ("/help" == a) return a = {type: "update"}, a.message =Lang.chat.help, this.receive(a), !0;
		if ("/users" == a) return UserListOverlay.show(), !0;
            	if ("/hd on" == a) return Playback.setHD(!0), !0;
            	if ("/hd off" == a) return Playback.setHD(!1), !0;
            	if ("/chat big" == a) return this.expand(), !0;
            	if ("/chat small" == a) return this.collapse(), !0;
            	if ("/afk" == a) return Models.user.changeStatus(1), !0;
            	if ("/back" == a) return Models.user.changeStatus(0), !0;
            	if (0 == a.indexOf("/ts ")) return b = a.split(" ").pop(), DB.settings.chatTS = "12" == b ? 12 : "24" == b ? 24 : !1, this.dispatchEvent("timestampUpdate", {
                    	value: DB.settings.chatTS
                    }),
            	DB.saveSettings(), !0;
            	if (0 == a.indexOf("/cap ")) {
                	if (a = parseInt(a.split(" ").pop()), 0 < a && 201 > a) return RoomUser.audience.gridData.avatarCap = a, RoomUser.redraw(), DB.settings.avatarcap = a, DB.saveSettings(), log(Lang.messages.cap.split("%COUNT%").join("" + a)), !0
            	} else {
                	if ("/cleanup" == a) return DB.reset(), Dialog.alert(Lang.alerts.updateMessage, $.proxy(Utils.forceRefresh, Utils), Lang.alerts.update, !0), !0;
                	if ("/stream on" == a) DB.settings.streamDisabled = !1, DB.saveSettings(), Playback.media && Playback.play(Playback.media,
                        	Playback.mediaStartTime), b = "Video/audio streaming enabled.";
                	else if ("/stream off" == a) DB.settings.streamDisabled = !0, DB.saveSettings(), Playback.stop(), b = "<strong>Video/audio streaming has been stopped.</strong> Type <em>/stream on</em> to enable again.";
               		else {
                    		if ("/clear" == a) return this.dispatchEvent("chatClear"), _gaq.push(["_trackEvent", "Chat", "Clear", Models.room.data.id]), !0;
                    		Models.room.ambassadors[Models.user.data.id] ? "/fixbooth" == a && (new ModerationBoothCleanupService, b = "Fixing Booth") : Models.room.admins[Models.user.data.id] &&
                        		("/fixbooth" == a ? (new ModerationBoothCleanupService, b = "Fixing Booth") : 0 == a.indexOf("/audience ") ? (a = parseInt(a.split(" ").pop()), 0 < a ? (RoomUser.testAddAvatar(a), b = "Adding " + a + " fake avatars to audience") : (RoomUser.clear(), RoomUser.setAudience(Models.room.getAudience()), RoomUser.setDJs(Models.room.getDJs()), b = "Cleared fake avatars from audience")) : 0 == a.indexOf("/ping ") ? (DB.settings.showPings = "/ping on" == a ? !0 : !1, DB.saveSettings(), b = "Ping messages are " + (DB.settings.showPings ? "on" : "off")) : 0 == a.indexOf("/speed ") &&
                        		(b = parseInt(a.split(" ").pop()), animSpeed = 0 < b ? b : 83, b = "Setting animation speed to " + animSpeed))
                	}
            	}
		return b ? (a = {
			type: "system"
		}, a.message = b, this.receive(a), !0) : !1
	},
});

var cc = new ccm();

function chatListener() {
  	var antispam, strobeOnCommand, Command, User, apiHooks, chatCommandDispatcher, chatUniversals, cmds, data, hook, initHooks, initialize, populateUserData, settings, undoHooks, unhook,
    	__bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    	__indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    	__hasProp = {}.hasOwnProperty,
    	__extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  	settings = (function() {
    		function settings() {
      			this.getRoomUrlPath = __bind(this.getRoomUrlPath, this);
      			this.startup = __bind(this.startup, this);
		}
    		settings.prototype.users = {};
    		settings.prototype.roomUrlPath = null;
    		settings.prototype.launchTime = null;
    		settings.prototype.startup = function() {
      		this.launchTime = new Date();
      		return this.roomUrlPath = this.getRoomUrlPath();
    		};
    		settings.prototype.getRoomUrlPath = function() {
      			return window.location.pathname.replace(/\//g, '');
    		};
    		return settings;
  	})();
  	data = new settings();
  	User = (function() {

    		function User(user) {
      			this.user = user;
      			this.getIsDj = __bind(this.getIsDj, this);
     			this.getUser = __bind(this.getUser, this);
    		}
    		User.prototype.getUser = function() {
      			return this.user;
    		};
    		User.prototype.getIsDj = function() {
      			var DJs, dj, _i, _len;
      			DJs = API.getDJs();
      			for (_i = 0, _len = DJs.length; _i < _len; _i++) {
        			dj = DJs[_i];
        			if (this.user.id === dj.id) {
          				return true;
        			}
      			}
      			return false;
    		};
    		return User;
	})(); 
  	populateUserData = function() {
    		var u, users, _i, _len;
    		users = API.getUsers();
    		for (_i = 0, _len = users.length; _i < _len; _i++) {
      			u = users[_i];
      			data.users[u.id] = new User(u);
    		}
  	};
  	initialize = function() {
    		populateUserData();
    		initHooks();
    		data.startup();
  	};
  	Command = (function() {
    		function Command(msgData) {
      			this.msgData = msgData;
      			this.init();
    		}
    		Command.prototype.init = function() {
      			this.parseType = null;
      			this.command = null;
      			return this.rankPrivelege = null;
    		};
    		Command.prototype.functionality = function(data) {};
    		Command.prototype.hasPrivelege = function() {
      			var user;
     			user = data.users[this.msgData.fromID].getUser();
     			switch (this.rankPrivelege) {
        			case 'host':
          				return user.permission === 5;
        			case 'cohost':
          				return user.permission >= 4;
        			case 'mod':
          				return user.permission >= 3;
        			case 'manager':
          				return user.permission >= 3;
        			case 'bouncer':
          				return user.permission >= 2;
        			case 'featured':
          				return user.permission >= 1;
        			default:
          				return true;
      			}
    		};
    		Command.prototype.commandMatch = function() {
      			var command, msg, _i, _len, _ref;
      			msg = this.msgData.message;
      			if (typeof this.command === 'string') {
        			if (this.parseType === 'exact') {
          				if (msg === this.command) {
            					return true;
          				} else {
            					return false;
          				}
        			} else if (this.parseType === 'startsWith') {
          				if (msg.substr(0, this.command.length) === this.command) {
            					return true;
          				} else {
            					return false;
          				}
        			} else if (this.parseType === 'contains') {
          				if (msg.indexOf(this.command) !== -1) {
            					return true;
          				} else {
            					return false;
          				}
        			}
      			} else if (typeof this.command === 'object') {
        			_ref = this.command;
        			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          				command = _ref[_i];
          				if (this.parseType === 'exact') {
            					if (msg === command) {
              						return true;
            					}
          				} else if (this.parseType === 'startsWith') {
            					if (msg.substr(0, command.length) === command) {
              						return true;
            					}
          				} else if (this.parseType === 'contains') {
            					if (msg.indexOf(command) !== -1) {
              						return true;
            					}
          				}
        			}
        			return false;
      			}
    		};
    		Command.prototype.evalMsg = function() {
      			if (this.commandMatch() && this.hasPrivelege()) {
        			this.functionality();
        			return true;
      			} else {
        			return false;
      			}
    		};
    		return Command;
  	})();
  	strobeOnCommand = (function(_super) { 
    		__extends(strobeOnCommand, _super);
    		function strobeOnCommand() {
        		return strobeOnCommand.__super__.constructor.apply(this, arguments);
    		}
    		strobeOnCommand.prototype.init = function() {
        		this.command = '/strobe on';
        		this.parseType = 'exact';
        		return this.rankPrivelege = 'manager';
    		};
    		strobeOnCommand.prototype.functionality = function() {
      			return RoomUser.audience.strobeMode(true);
    		}
    		return strobeOnCommand;
  	})(Command);
  	cmds = [strobeOnCommand];
  	chatCommandDispatcher = function(chat) {
    		var c, cmd, _i, _len, _results;
    		chatUniversals(chat);
    		_results = [];
    		for (_i = 0, _len = cmds.length; _i < _len; _i++) {
      			cmd = cmds[_i];
      			c = new cmd(chat);
      			if (c.evalMsg()) {
        			break;
      			} else {
        			_results.push(void 0);
      			}
    		}
    		return _results;
  	};
  	antispam = function(chat) {
  		var plugRoomLinkPatt, sender;
  		plugRoomLinkPatt = /(\bhttps?:\/\/(www.)?adf\.ly[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  		if (plugRoomLinkPatt.exec(chat.message)) {
    			sender = API.getUser(chat.fromID);
    			if (!sender.ambassador && !sender.moderator && !sender.owner && !sender.superuser) {
    				API.sendChat("@" + sender.username + " " + spamMsg[Math.floor(Math.random() * spamMsg.length)]);
       				return API.moderateDeleteChat(chat.chatID);
     			}
   		}
   		return antispam;
 	};
  	chatUniversals = function(chat) {
      		antispam(chat);
  	};
  	hook = function(apiEvent, callback) {
    		return API.addEventListener(apiEvent, callback);
  	};
  	unhook = function(apiEvent, callback) {
    		return API.removeEventListener(apiEvent, callback);
  	};
  	apiHooks = [
    		{
      			'event': API.CHAT,
      			'callback': chatCommandDispatcher
    		}
  	];
  	initHooks = function() {
    		var pair, _i, _len, _results;
    		_results = [];
    		for (_i = 0, _len = apiHooks.length; _i < _len; _i++) {
      			pair = apiHooks[_i];
      			_results.push(hook(pair['event'], pair['callback']));
    		}
    		return _results;
  		};
  	undoHooks = function() {
    		var pair, _i, _len, _results;
   		 _results = [];
    		for (_i = 0, _len = apiHooks.length; _i < _len; _i++) {
      			pair = apiHooks[_i];
      			_results.push(unhook(pair['event'], pair['callback']));
    		}
    		return _results;
  	};
  	initialize();
}

delay();
$('#plugbot-js').remove();
log("Welcome to ►House & EDM◄ Coded by Nitro Ghost. Stay Dench! Version: 1.0.0");
log("type '/commands' to see extra commands");
$('body').prepend('<style type="text/css" id="plug-css">' + "\n" + styles.join("\n") + "\n" + '</style>');
$('body').append('</div><div id="side-right" class="sidebar">' + '<div class="sidebar-handle"><span>|||</span></div>' + '<div class="sidebar-content"></div>' + '<div id="hr-div"><div><div id="hr-style"></div></div></div>' + '</div><div id="side-left" class="sidebar">' + '<div class="sidebar-handle" title="show/hide userlist"><span>|||</span></div>' + '<div class="sidebar-content2"></div>' + '<div id="hr2-div2"><div><div id="hr2-style2"></div></div></div>' + '</div>');
$('body').append('<script type="text/javascript" id="plug-js-extra">' + "\n" + scripts.join("\n") + "\n" + '</script>');
