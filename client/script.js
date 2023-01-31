import bot from './assets/bot.svg';
import user from './assets/user.svg';

//creating the HTML element manually 
//call which is created exactly in index.html
//form we didnt get by ID but we got by tag name because this is the only form 
const form = document.querySelector('form'); 
const chatContainer = document.querySelector('#chat_container');

//its a varibale
let loadInterval;

//create a function called loader is used for how the message is loading
function loader(element){
    element.textContent='';

    loadInterval=setInterval(() => {
      element.textContent += '.';

      if(element.textContent === '...') {
        element.textContent = '';
      }
    }, 300)
}

//going to accept the elements and text as per parameters
function typeText(element, text) {
  let index=0;

  let interval = setInterval(() => {
    if(index < text.length ) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId() {
   const timestamp = Date.now();
   const randomNumber = Math.random();
   const hexadecimalstring = randomNumber.toString(16);

   return `id-${timestamp}-${hexadecimalstring}`;
}

function chatStripe(isAi, value, uniqueId) {

  return (
    `
    
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
          <img
            src=${isAi ? bot : user}
            alt="${isAi ? 'bot' : 'user'}" />
          </div>
          <div class="message" id= ${uniqueId}> ${value} </div>
        </div>      
      </div>    
    
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chatstripe

  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  //bot chatstripe

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, "", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  //fetch newly create div
  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // fetch the data from the server -> bot responce

  const responce = await fetch('https://codex-ai-z6r6.onrender.com/', {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);

  messageDiv.innerHTML = '';

  if(responce.ok) {
    const data = await responce.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await responce.text();

    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }

}

form.addEventListener('submit', handleSubmit);

form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    handleSubmit(e);
  }
})