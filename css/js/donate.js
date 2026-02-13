function saveDonate() {

    const text = document.getElementById("topTextInput").value;
    const phone = document.getElementById("phoneInput").value;

    localStorage.setItem("donateText", text);
    localStorage.setItem("donatePhone", phone);

    document.getElementById("fixedText").innerText = text;
}

window.onload = function() {

    const savedText = localStorage.getItem("donateText");
    const savedPhone = localStorage.getItem("donatePhone");

    if(savedText){
        document.getElementById("fixedText").innerText = savedText;
    }

    if(savedPhone){
        document.getElementById("phoneInput").value = savedPhone;
    }
}
