var number = 1;
var maxNumber = 4;
var notes = ['Talk To Me'];
var noteWdth = 0;
var nodeHt=0;
window.onload = function(){

        cast.receiver.logger.setLevelValue(0);
        window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
        console.log('Starting Receiver Manager');
        
        // handler for the 'ready' event
        castReceiverManager.onReady = function(event) {
          console.log('Received Ready event: ' + JSON.stringify(event.data));
          window.castReceiverManager.setApplicationState("Application status is ready...");
        };
        
        // handler for 'senderconnected' event
        castReceiverManager.onSenderConnected = function(event) {
          console.log('Received Sender Connected event: ' + event.data);
          console.log(window.castReceiverManager.getSender(event.data).userAgent);
        };
        
        // handler for 'senderdisconnected' event
        castReceiverManager.onSenderDisconnected = function(event) {
          console.log('Received Sender Disconnected event: ' + event.data);
          if (window.castReceiverManager.getSenders().length == 0) {
	        window.close();
	      }
        };
        
        // handler for 'systemvolumechanged' event
        castReceiverManager.onSystemVolumeChanged = function(event) {
          console.log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
              event.data['muted']);
        };

        // create a CastMessageBus to handle messages for a custom namespace
        window.messageBus =
          window.castReceiverManager.getCastMessageBus(
              'urn:x-cast:com.google.cast.sample.helloworld');

        // handler for the CastMessageBus message event
        window.messageBus.onMessage = function(event) {
          console.log('Message [' + event.senderId + ']: ' + JSON.stringify(event.data));
          // display the message from the sender
          addText(event.data);
          // inform all senders on the CastMessageBus of the incoming message event
          // sender message listener will be invoked
          window.messageBus.send(event.senderId, event.data);
        }

        // initialize the CastReceiverManager with an application status message
        window.castReceiverManager.start({statusText: "Application is starting"});
        console.log('Receiver Manager started');
        updatePage();
        noteWdth = $('#container').width()/5;
        nodeHt = $('#container').height()*0.8;
        $('.note').width(noteWdth);
        $('.note').height(nodeHt);

        updateDivOffset();
      };

// utility function to display the text message in the input field
function displayText(text) {
  notes[notes.length] = text;
  console.log(text);
  //document.getElementById("message").innerHTML=text;
  window.castReceiverManager.setApplicationState(text);
};
function focusOn(numNote){
  number = numNote;
  updatePage();
  updateDivOffset();
};

function addText(dataJson){
  var data = JSON.parse(dataJson);
  notes[notes.length] = data.text;
  maxNumber++;
  number = maxNumber;
  displayText(data.text);
  updatePage();
  updateDivOffset();
  $('.note').last().after("<div id=\"notes\" class=\"note\">"+data.text+"</div>");
  $('.note').last().width(noteWdth);
  $('.note').last().height(nodeHt);
  $('.note').last().hide();
  $('.note').last().css("margin-top","80%");
  $('.note').css("background-color",'#'+data.colorInHex.split("$")[1]);
 $('.note').last().fadeIn("slow", function(){});
 $('.note').last().animate({'margin-top': '10px'}, 1000, 'easeOutExpo');


}
function increment()
{
  if(number < maxNumber){
    number++;
    displayText(notes[number-1]);
    updatePage();
  updateDivOffset();
  }
}

function decrement()
{
  if(number > 1)
  {
    number--;
    displayText(notes[number-1]);
  }
  updatePage();
  updateDivOffset();
}

// $("#increment").click(function(){
//   increment();
//   updatePage();
//   updateDivOffset();
//   console.log(number + "/" + maxNumber);
// });

// $("#decrement").click(function(){
//   decrement();
//   updatePage();
//   updateDivOffset();
//   console.log(number + "/" + maxNumber);
// });

function updatePage()
{
  $('#page').text(number + "/" + maxNumber);
}
function updateDivOffset()
{
  var offset = $('#container').offset();
  $('#container').width((noteWdth+20)*(maxNumber+1));
  $('#container').animate({'marginLeft':noteWdth*2-number*noteWdth});
}