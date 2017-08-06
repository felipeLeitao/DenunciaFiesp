(function($) {
	
//    var self = $.denuncia = function(){};
//    $.extend(self, {});

    //run when jQuery is ready
    $(function(){
        if(window.location.href.indexOf("web.whatsapp.com") < 0) {
            console.log("not whatApp");
            return;
        }

        //wait for page to load
        setTimeout(function(){
            console.log("whatsApp plugin running");

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
                    console.log(load + " " + load == null);
                    console.log("try again");
                    scrapeMessages();
                } 

                // gambiarras pra tentar lidar com a assincronicidade 
                while(load !== null && typeof load !== "undefined") {
                    load.click();
                    load = $(".more-messages-button");
                }

                //get message bubbles
                var bubbles = document.getElementsByClassName("bubble-text");
                console.log(bubbles);
                for(var i = 0; i < bubbles.length; i++) {
                    var bubble = bubbles[i].getElementsByClassName("message-text");
                    var preText = bubble[0].getElementsByClassName("message-pre-text")[0];
                    var message = bubble[0].getElementsByClassName("selectable-text")[0];

                    // document.getElementsByClassName("bubble-text")[0].getElementsByClassName("message-text")[0].getElementsByClassName("message-pre-text");

                    if(message == null) {
                        continue;
                    }

                    var text = "";
                    var timestamp = "";
                    var phone = "";

                    for(var j = 0; j < message.childNodes.length; j++) {
                        if(message.childNodes[j].nodeType == textNodeType) {
                            text += message.childNodes[j].nodeValue;
                        }
                    }

                    if(preText !== null && typeof preText !== "undefined") {
                        for(var k = 0; k < preText.childNodes.length; k++) {
                            if(preText.childNodes[k].nodeType == textNodeType && preText.childNodes[k].nodeValue.indexOf("/") > -1) {
                                timestamp = preText.childNodes[k].nodeValue;
                            } else if(preText.childNodes[k].nodeType == textNodeType && preText.childNodes[k].nodeValue.indexOf("+") > -1) {
                                phone = preText.childNodes[k].nodeValue;
                            }
                        }
                    }

                    var msg = {
                        "texto": text,
                        "nomeContato": "",
                        "numeroTelefone": phone,
                        "dataEnvio": timestamp,
                    };

                    messages.push(msg);
                }

                conversations.push(messages);
                console.log(conversations);

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

            startScraping();

        }, 25000);
    });
})(jQuery);
