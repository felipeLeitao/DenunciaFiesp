(function($) {
	
//    var self = $.denuncia = function(){};
//    $.extend(self, {});

    //run when jQuery is ready
    $(function(){
        if(window.location.href.indexOf("web.whatsapp.com") < 0) {
            console.log("not whatApp");
            return;
        }

        console.log("whatsApp plugin running");

        //wait for page to load
        setTimeout(function(){

            // array of parsed conversations to be saved via API            
            var conversations = [];

            var addHeader = function(){
                var div = $(".app .two");
                var header = "<div id='denuncia'>Selecione uma conversa e clique <a onClick='startScraping(); return true;'>aqui</a> para vasculhá-la</div>";
                div.prepend(header);
            };

            var scrapeMessages = function() {
                console.log("begin scraping");
                var messages = [];
                var textNodeType = 3;

                var load = $(".more-messages-button");

                if(load == null) {
                    setTimeout(function(){
                        scrapeMessages();
                    }, 2000);
                } 

                while(load !== null && typeof load !== "undefined") {
                    console.log("oi");
                    load.click();
                    load = $(".more-messages-button");
                }

                //get message bubbles
                var bubbles = $(".message-list");
                bubbles = bubbles.getElementsByClassName("bubble-text");
                for(i = 0; i < bubbles.length; i++) {
                    var bubble = bubbles.childNodes[i].getElementsByClassName("message-text");
                    var preText = bubble[0].childNodes;
                    var message = bubble[1].childNodes;

                    var text = "";
                    var timestamp = "";
                    var phone = "";

                    for(j = 0; j < message.length; j++) {
                        if(message[j].nodeType == textNodeType) {
                            text += childNodes[j];
                        }
                    }

                    for(k = 0; k < preText.length; k++) {
                        if(preText[k].nodeType == textNodeType && preText[k].indexOf("/") > -1) {
                            timestamp = preText[k];
                        } else if(preText[k].nodeType == textNodeType && preText[k].indexOf("+") > -1) {
                            phone = preText[k];
                        }
                    }

                    message = {
                        "texto": text,
                        "nomeContato": "",
                        "numeroTelefone": phone,
                        "dataEnvio": timestamp,
                    };

                    console.log(message);

                    messages.push(message);
                }

                conversations.push(messages);
                console.log("scraping conversation " + i);

            };

            var saveConversations = function() {
                var jsonFile = require('jsonfile');
                jsonFile.writeFile ("conversations.json", JSON.stringify(conversations), function(err) {
                    console.log(err);
                });
            };

            var scrapeConversations = function() {
                var chatList = $(".infinite-list-viewport").children;
                chatList[0].click();
                for(i = 0; i < chatList.length; i++) {
                    chatList[i].click();
                    scrapeMessages(conversations);
                }
                saveConversations(conversations);
            };

            var uploadConversations = function() {
                $.post("bla", function(data, conversations){
                    console.log("Dados foram enviados ao servidor e serão analisados");
                });
            };

            var startScraping = function() {
                var bubbles = $(".message-list");
                if(typeof bubbles == "undefined") {
                    alert("Não foi selecionada uma conversa");
                } else {
                    console.log("scrape");
                    scrapeMessages();
                }
            };

            // startScraping();

        }, 14000);
    });
})(jQuery);
