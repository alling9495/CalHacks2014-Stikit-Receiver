var number = 1;
var maxNumber = 4;
var notes = ['Talk To Me'];
var noteWdth = 0;
var noteHt=0;
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
          //Add 0
          //Delete 3
          //Right 2
          //Left 1
          //
          // display the message from the sender
          var data = JSON.parse(event.data);
          if(data.command === 0){
            addText(data);
          }
          else if(data.command === 1){
            decrement();
          }
          else if(data.command === 2){
            increment();
          }
          else if(data.command === 3){
            if($('.note').length > 0){
              deleteNote($('.note')[number-1]);
            }
          }
          // inform all senders on the CastMessageBus of the incoming message event
          // sender message listener will be invoked
          window.messageBus.send(event.senderId, event.data);
        }

        // initialize the CastReceiverManager with an application status message
        window.castReceiverManager.start({statusText: "Application is starting"});
        console.log('Receiver Manager started');
        updatePage();
        noteWdth = $('#container').width()/5;
        noteHt = noteWdth*1.6; //golden number
        $('.note').width(noteWdth);
        $('.note').height(noteHt);

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

function addText(data){
  notes[notes.length] = data.text;
  maxNumber++;
  number = maxNumber;
  displayText(data.text);
  updatePage();
  updateDivOffset();
  $('.note').last().after("<div id=\"notes\" class=\"note\">"+data.text+"</div>");
  $('.note').last().width(noteWdth);
  $('.note').last().height(noteHt);
  $('.note').last().hide();
  $('.note').last().css("margin-top","80%");

  $('.note').last().css("background-color",data.colorInHex);
  $('.note').last().fadeIn("slow", function(){});
  $('.note').last().animate({'margin-top': '10px'}, 1000, 'easeOutExpo');


}

function deleteNote(note)
{
  note.hide( "explode", {pieces: 25 }, 700);
  number--;
  maxNumber--;
}


function increment()
{
  if(number < maxNumber){
    number++;


  }
  updatePage();
  updateDivOffset();
}

function decrement()
{
  if(number > 1)
  {
    number--;

  }
  updatePage();
  updateDivOffset();
}

function setNoteColor(r, g, b)
{
  var handle = "rgba(" + r + "," + b + "," + g + "," + "1.0)";
  $('.note').css("background", handle);
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
  $('#container').animate({'marginLeft':(noteWdth)*3-number*noteWdth});
}