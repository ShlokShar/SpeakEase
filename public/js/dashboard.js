
const textInput = document.getElementById("input-element");

const sendText = () => {
    const text = textInput.value;
    textInput.value = "";

    chatContainer.innerHTML += `<div class="flex space-x-2"><p class="grow"></p><p class="max-w-[250px] text-white bg-[#544DEA] p-2 rounded-b-[15px] rounded-l-[15px]">${text}</p></div>`

    fetch("/dashboard/", {
        method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text: text})
    }).then(promise => {
        return promise.json();
    }).then(data => {
        const response = data.response;
        chatContainer.innerHTML += `<div class="flex space-x-2"><p class="text-3xl">🌎</p><p class="max-w-[250px] bg-white p-2 rounded-b-[15px] rounded-r-[15px]">${response}</p></div>`
    })
}

textInput.onkeydown = function(key) {
    let keyCode = key.code || key.key;
    if (keyCode == "Enter") {
        sendText();
    }
}