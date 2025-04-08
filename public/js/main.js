
const textInputElement = document.getElementById("textInput");

const sendText = () => {
    // POST text to server
    fetch("/dashboard", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({text: textInputElement.value})
    }).then((data) => {
        return data.text();
    }).then((data) => {
        console.log(data);
    })
}