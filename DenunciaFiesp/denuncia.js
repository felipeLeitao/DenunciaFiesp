(function($) {
	
    var self = $.denuncia = new function(){};
	
    $.extend(self, {

        // parsed conversations to be saved via API            
        self.conversations = [];

        addButton: function() {
            var menu = $(".pane-chat-header .menu.menu-horizontal");
            var button = "<div class="menu-item"><p>Scrape</p></div>"
            ḿenu.append(button);
        }

        scrapeMessages: function(conversations) {
            var messages = [];

            var l = 1;
            var textNodeType = 3;

            while(l > 0) {
                l = $(".more-messages-button").click().length;
            }

            //get message bubbles
            var bubbles = $(".bubble.bubble-text");
            for(i = 0; i < bubbles; i++) {
                var bubble = bubbles[i].getElementsByClassName("message-text")[0].childNodes;
                var preText = bubble[0].childNodes;
                var message = bubble[1].childNodes;

                var text = "";
                var timestamp = ""
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

                messages.push(message);
            }

            conversations.push(messages);

        },

        saveMessages: function(conversations) {
            //send to API
        }

    });

    //Run on jQuery ready
    $(function(){
        self.addButton();
    });
})(jQuery);
