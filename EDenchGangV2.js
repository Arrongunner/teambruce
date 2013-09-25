function delay() {
        setTimeout("load();", 500);
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
	if (!audience) {
		$('#audience').hide();
	}
    	initAPIListeners();
    	displayUI();
    	initUIListeners();
    	populateUserlist();
    	displayEmoticons();
}

var words = {
"Points" : "Beats!",
"Now Playing" : "Now Spinning!",
"Time Remaining" : "Time Remaining!",
"Volume" : "Crank the Volume!",
"Current DJ" : "Disk Jockey",
"Crowd Response" : "Crowd Reaction!",
"Fans":"Stalkers!"};

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
var skipped = false;
var predictor = false;
var timeToWait = 600000;
var clickWait = 5000;
var skipWait = 2000;
var timePassed = 0;
var clickPassed = 0;
var skipPassed = 0;
var predictPassed = 0;
var timer = null;
var clickTimer = null;
var skipTimer = null;
var predictTimer = null;
var COOKIE_WOOT = 'autowoot';
var COOKIE_QUEUE = 'autoqueue';
var COOKIE_STREAMING = 'streaming';
var COOKIE_HIDE_VIDEO = 'hidevideo';
var COOKIE_LEFT = 'left';
var MAX_USERS_WAITLIST = 50;

var sleepMsg = ["Bye, i am out for today!", "Going to sleep now.", "Bed time!", "tiredness... taking... over... must sleep"];
var workMsg = ["I'm working so mention me if I'm needed.", "I'm going to be busy for a while, mention if needed."];
var afkMsg = ["Stepping away for a moment.", "Going AFK for a while, be back soon!"];
var backMsg = ["I have returned", "I'm baaacckkk"];

var autoAwayMsg = ["I'm currently AFK", "I'm AFK", "I'm on an adventure (afk)", "gone away for a moment", "not present at keyboard"];
var autoSlpMsg = ["I'm currently sleeping", "I'm counting sheep in my dreams", "I've hit the sack", "I'm asleep", "I've gone to sleep"];
var autoWrkMsg = ["I'm currently working", "I'm busy", "I shall get back to you when i can."];

var styles = [
            '.sidebar {position: fixed; top: 0; height: 100%; width: 200px; z-index: 99999; background-image: linear-gradient(bottom, #000000 0%, #3B5678 100%);background-image: -o-linear-gradient(bottom, #000000 0%, #3B5678 100%);background-image: -moz-linear-gradient(bottom, #000000 0%, #3B5678 100%);background-image: -webkit-linear-gradient(bottom, #000000 0%, #3B5678 100%);background-image: -ms-linear-gradient(bottom, #000000 0%, #3B5678 100%);background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0, #000000),color-stop(1, #3B5678));}',
            '.sidebar#side-right {right: -190px;z-index: 99999;}',
            '.sidebar#side-left {left: -190px; z-index: 99999; }',
            '.sidebar-handle {width: 12px;height: 100%;z-index: 99999;margin: 0;padding: 0;background: rgb(96, 141, 197);box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .9);cursor: "ne-resize";}',
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
	API.on(API.DJ_ADVANCE, djAdvanced);
  	API.on(API.CHAT, autoRespond);
  	API.on(API.DJ_UPDATE, queueUpdate);
  	API.on(API.VOTE_UPDATE, function (obj) {
            	populateUserlist();

    	});
	API.on(API.USER_JOIN, function (user) {
          	populateUserlist();
    	});
    	API.on(API.USER_LEAVE, function (user) {
            	populateUserlist();
    	});
    	API.on(API.WAIT_LIST_UPDATE, function (user){
    		populateUserlist();
    	});
}

function displayUI() {
	var colorWoot = autowoot ? '#3FFF00' : '#ED1C24';
    	var colorQueue = autoqueue ? '#3FFF00' : '#ED1C24';
    	var colorStream = streaming ? '#3FFF00' : '#ED1C24';
    	var colorVideo = hideVideo ? '#3FFF00' : '#ED1C24';
	$('#side-right .sidebar-content').append(
			'<a title="Settings" style="color:#FFFFF">Settings:</a>'
		+	'<a id="plug-btn-woot" title="Toggle AutoWoot" style="color:' + colorWoot + '">Auto Woot</a>'
		+ 	'<a id="plug-btn-queue" title="Toggle AutoQueue" style="color:' + colorQueue + '">Auto Queue</a>'
		+ 	'<a id="plug-btn-stream" title="Toggle Video Stream" style="color:' + colorStream + '">Video Streaming</a>'
		+ 	'<a id="plug-btn-hidevideo" title="Toggle Video" style="color:' + colorVideo + '">Hide Video</a>'
		+	'<a title="Changes your status" style="color:#FFFFF">Status:</a>'
		+	'<a id="plug-btn-sleeping" title="Sends sleep message and sets status to sleeping" style="color:#FF8FEE">Sleeping</a>'
		+	'<a id="plug-btn-working" title="Sends work message and sets status to working" style="color:#FF8FEE">Working</a>'
		+	'<a id="plug-btn-afk" title="Sends afk message and sets status to afk" style="color:#FF8FEE">AFK</a>'
		+	'<a id="plug-btn-back" title="Sends available message and sets status to available" style="color:#FF8FEE">Available</a>'
		+	'<a title="Moderation" style="color:#FFFFF">Moderation:</a>'
		+	'<a id="plug-btn-skip" title="Skips current DJ" style="color:#E90E82">Skip</a>'
		+	'<a id="plug-btn-lock" title="Locks booth" style="color:#E90E82">Lock</a>'
		+	'<a id="plug-btn-unlock" title="Unlocks booth" style="color:#E90E82">Unlock</a>'
		+	'<a id="plug-btn-lockskip" title="Locks booth, skips DJ, then unlocks booth" style="color:#E90E82">Lockskip</a>'
    );
}

function initUIListeners() {
	$(".sidebar-handle").on("click", function() {
		left = !left;
		$(".sidebar#side-left").animate({"left": left ? "0px" : "-190px"}, 300, "easeOutCirc");
		jaaulde.utils.cookies.set(COOKIE_LEFT, left);
	});
	$("#plug-btn-woot").on("click", function() {
		autowoot = !autowoot;
		if (autowoot) {
			$('#button-vote-positive').click();
		}
		jaaulde.utils.cookies.set(COOKIE_WOOT, autowoot);
	});
	$("#plug-btn-queue").on("click", function() {
		autoqueue = !autoqueue;
        	if (autoqueue && !isInQueue()) {
        		joinQueue();
        	}
        	jaaulde.utils.cookies.set(COOKIE_QUEUE, autoqueue);
	});
	$("#plug-btn-stream").on("click", function() {
		streaming = !streaming;
		API.sendChat(DB.settings.streamDisabled ? '/stream on' : '/stream off');
		jaaulde.utils.cookies.set(COOKIE_STREAMING, streaming);
	});
	$("#plug-btn-hidevideo").on("click", function() {
		hideVideo = !hideVideo;
		$("#yt-frame").animate({"height": (hideVideo ? "0px" : "271px")}, {duration: "fast"});
		$("#playback .frame-background").animate({"opacity": (hideVideo ? "0" : "0.91")}, {duration: "medium"});
		jaaulde.utils.cookies.set(COOKIE_HIDE_VIDEO, hideVideo);
	});
	$("#plug-btn-noskip").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval("checkClicked();", 1000);
			API.sendChat(skipMsg[Math.floor(Math.random() * skipMsg.length)]);
		}
	});
	$("#plug-btn-waffles").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval("checkClicked();", 1000);
			API.sendChat(wafflesMsg[Math.floor(Math.random() * wafflesMsg.length)]);
		}
	});
	$("#plug-btn-sleeping").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval("checkClicked();", 1000);
			if (API.getUser().status != 3) {
				API.sendChat(sleepMsg[Math.floor(Math.random() * sleepMsg.length)]);
				API.setStatus(API.STATUS.SLEEPING);
			}
		}
	});
	$("#plug-btn-working").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval("checkClicked();", 1000);
			if (API.getUser().status != 2) {
				API.sendChat(workMsg[Math.floor(Math.random() * workMsg.length)]);
				API.setStatus(API.STATUS.WORKING);
			}
		}
	});	
	$("#plug-btn-afk").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval("checkClicked();", 1000);
			if (API.getUser().status != 1) {
				API.sendChat(afkMsg[Math.floor(Math.random() * afkMsg.length)]);
				API.setStatus(API.STATUS.AFK);
			}
		}
	});
	$("#plug-btn-back").on("click", function() {
		if (clicked == false) {
			clicked = true;
			clickTimer = setInterval("checkClicked();", 1000);
			if (API.getUser().status != 0) {
				API.sendChat(backMsg[Math.floor(Math.random() * backMsg.length)]);
				API.setStatus(API.STATUS.AVAILABLE);
			}
		}
	});
	$("#plug-btn-skip").on("click", function() {
		if (skipped == false) {
			skipped = true;
			skipTimer = setInterval("checkSkipped();", 500);
			API.moderateForceSkip();
		}
	});
	$("#plug-btn-lock").on("click", function() {
		API.moderateRoomProps(true, true);
	});
	$("#plug-btn-unlock").on("click", function() {
		API.moderateRoomProps(false, true);
	});
	$("#plug-btn-lockskip").on("click", function() {
		if (skipped == false) {
			skipped = true;
			skipTimer = setInterval("checkSkipped();", 500);
			API.moderateRoomProps(true, true);
			API.moderateForceSkip();
			API.moderateRoomProps(false, true);
		}
	});
};

setTimeout(function() {
	history = [];
	var data = API.getHistory();
        for (var i in data) {
        	var a = data[i],
                obj = {
                       	id: a.media.id,
                       	author: a.media.author,
                       	title: a.media.title,
                       	time: new Date().toLocaleTimeString(),
                       	user: {
                      		id: a.user.id.toString(),
                       		username: a.user.username
                       	}
                };
                history.push(obj);
	}
}, 2000);

function queueUpdate() {
	if (autoqueue && !isInQueue()) {
		joinQueue();
    	}
}

function isInQueue() {
	var self = API.getUser();
    	return API.getWaitList().indexOf(self) !== -1 || API.getDJs().indexOf(self) !== -1;
}

function joinQueue() {
	if ($('#button-dj-play').css('display') === 'block') {
		$('#button-dj-play').click();
    	} 
	else if (API.getWaitList().length < MAX_USERS_WAITLIST) {
        API.djJoin();
    	}
}

function autoRespond(data) {
	var a = data.type == "mention" && API.getStaff[data.fromID] && API.getStaff[data.fromID] >= API.ROLE.BOUNCER, b = data.message.indexOf('@') >0;
	if (data.type == "mention" && mentioned == false) {
		if (API.getUser(data.fromID).status == 0) {
			mentioned = true;
			timer = setInterval("checkMentioned();", 1000);
			if (API.getUser().status == 1) {
				API.sendChat("@" + data.from + " automsg: " + autoAwayMsg[Math.floor(Math.random() * autoAwayMsg.length)]);
			}
			if (API.getUser().status == 2) {
				API.sendChat("@" + data.from + " automsg: " + autoWrkMsg[Math.floor(Math.random() * autoWrkMsg.length)]);
			}
			if (API.getUser().status == 3) {
				API.sendChat("@" + data.from + " automsg: " + autoSlpMsg[Math.floor(Math.random() * autoSlpMsg.length)]);
			}
		}
	}
}

function djAdvanced(data) {
	History(data.media.id);
	var obj = {
             	id: data.media.id,
              	author: data.media.author,
          	title: data.media.title,
          	time: new Date().toLocaleTimeString(),
           	user: {
            		id: data.dj.id,
              		username: data.dj.username
              	}
        };
        history.unshift(obj);
        history.splice(50, history.length - 50);
	if (hideVideo) {
		$("#yt-frame").css("height", "0px");
		$("#playback .frame-background").css("opacity", "0.0");
	}
	if (autowoot) {
		$('#button-vote-positive').click();
	}
	if (predictor == false) {
		predictor = true;
		predictTimer = setInterval("checkPredict()", 1000);
	}
}

function History(id) {
	var found = -1;
	for (var i in history) {
		var a = history[i];
		if (a.id == id && (~~i + 2) < 51) {
			found = ~~i + 2;
			return API.chatLog("Song is in History " + found + "/" + history.length), true;
		}
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
	var myid = API.getUser().id;
	for (i in a) {
        	str = '<span class="chat-from-clickable ';
        	if (typeof (a[i].permission) !== 'undefined' && a[i].permission == 10) {
            		str += 'chat-from-admin ';
        	} else if (typeof (a[i].permission) !== 'undefined' && a[i].permission == 9) {
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
        	str += '" onclick="$(\'#chat-input-field\').val($(\'#chat-input-field\').val() + \'@' + a[i].username + ' \').focus();" title="click to mention">' + a[i].username + '</span>';
        	if (typeof (a[i].vote) !== 'undefined' && a[i].vote == -1) {
            		totalMEHs++;
            		mehlist += str; 
        	} 
        	else if (typeof (a[i].vote) !== 'undefined' && a[i].vote == +1) {
            		totalWOOTs++;
            		wootlist += str; 
        	}
        	else if (a[i].id == API.getDJs()[0]) {
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
	mehlist = '<a title="total mehs">' + ' ' + totalMEHs.toString() + '</a><a title=" meh percentage">' + ' (' + totalMEHsPercentage.toString() + '&#37;)' + '</a>' + mehlist;
    	wootlist = '<a title="total woots">' + ' ' + totalWOOTs.toString() + '</a><a title=" woot percentage">' + ' (' + totalWOOTsPercentage.toString() + '&#37;)' + '</a>' + wootlist;
    	undecidedlist = ' ' + totalUNDECIDEDs.toString() + undecidedlist;
	if ($('#side-left .sidebar-content2').children().length > 0) {
            	$('#side-left .sidebar-content2').append();
	}
        $('#side-left .sidebar-content2').html('<h3 class="users" title="number of users in the room">users: ' + API.getUsers().length + '</h3>');
        var spot = API.getWaitListPosition();
        var waitlistDiv = $('<h3 title="waitlist posisition"></h3>').addClass('waitlistspot').text('waitlist: ' + (spot !== -1 ? spot + ' / ' : '') + API.getWaitList().length);
        var waitpostime = API.getWaitListPosition() * 240;
        var offset = API.getMedia().duration - 240;
        var approxtime = waitpostime + offset;
        var timeDiv = $('<h3 title="approx. wait time until on the booth"</h3>').addClass('timewait').text('wait: ' + (spot !== -1 ? sts(decodeURIComponent(approxtime)) + ' ' : ''));
        $('#side-left .sidebar-content2').append(waitlistDiv);
        $('#side-left .sidebar-content2').append(spot !== -1 ? timeDiv : '');
        $('#side-left .sidebar-content2').append('<div class="meanlist"></div>');
        $(".meanlist").append( 
        		'<div id="currentdj_div" style="border: 1px solid rgb(0, 112, 255);"><a title="current dj">current dj:</a>' +   currentdj + '</div>'
        	+ 	'<div id="mehlist_div" style="border: 1px solid rgb(233, 6, 6);"><a title="meh list">meh list:</a>' +   mehlist + '</div>' 
        	+ 	'<div id="wootlist_div" style="border: 1px solid rgb(2, 140, 7);"><a title="woot list">woot list:</a>' + wootlist + '</div>'
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

function checkSkipped() {
	if (skipPassed >= skipWait) {
		clearInterval(skipTimer);
		skipped = false;
		skipPassed = 0;
	}
	else {
		skipPassed = skipPassed + 500;
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

delay();
$('body').prepend('<script type="text/javascript" id="omg-js" src="https://raw.github.com/NitroGhost/EDMbassy/master/blacklist.js" />');
$('body').prepend('<script type="text/javascript" id="game-js" src="https://raw.github.com/NitroGhost/EDMbassy/master/game.js" />');
$('body').prepend('<style type="text/css" id="plug-css">' + "\n" + styles.join("\n") + "\n" + '</style>');
$('body').prepend('<script type="text/javascript" id="commands-js" src="https://raw.github.com/Snipeglider/Plug/master/modcommands.js" />');
$('body').append('</div><div id="side-right" class="sidebar">' + '<div class="sidebar-handle"><span>|||</span></div>' + '<div class="sidebar-content"></div>' + '<div id="hr-div"><div><div id="hr-style"></div></div></div>' + '</div><div id="side-left" class="sidebar">' + '<div class="sidebar-handle" title="show/hide userlist"><span>|||</span></div>' + '<div class="sidebar-content2"></div>' + '<div id="hr2-div2"><div><div id="hr2-style2"></div></div></div>' + '</div>');
$('body').append('<script type="text/javascript" id="plug-js-extra">' + "\n" + scripts.join("\n") + "\n" + '</script>');
