function onYouTubeIframeAPIReady(){player=new YT.Player("main-product-video",{width:"100%"})}var player,tag=document.createElement("script");tag.src="https://www.youtube.com/iframe_api";var firstScriptTag=document.getElementsByTagName("script")[0];firstScriptTag.parentNode.insertBefore(tag,firstScriptTag),function($){youtubeUrlToId=function(t){var e=/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,i=t.match(e);return i&&11==i[7].length?i[7]:!1},$("[data-video-src]").each(function(){var t;if(t=youtubeUrlToId($(this).attr("data-video-src"))){var e=$(this);infoUrl="https://gdata.youtube.com/feeds/api/videos/"+t+"?alt=json",$.getJSON(infoUrl,function(i){var a=i.entry.title.$t,o=i.entry.media$group.media$thumbnail[0].url;e.find("img").first().attr("src",o),e.attr("data-original-title","Video: "+a),e.tooltip(),e.click(function(){$("#main-product-video").show(),$("#main-product-image").hide(),player.loadVideoById(t),$("[data-image-swap]").click(function(){$("#main-product-video").hide(),$("#main-product-image").show(),player.stopVideo()})}),console.log(o)})}})}(window.jQuery);