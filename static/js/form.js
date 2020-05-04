let textInput = document.querySelector("#post");
const inputForm = document.querySelector("form");
const ul = document.querySelector("ul");
const errorMessage = document.querySelector("#error")
inputForm.addEventListener("submit", onSubmit);

function onSubmit(e){
    e.preventDefault()
    fetch("/todos/create", {
        method: "POST",
        body: JSON.stringify({
            description: textInput.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        if(res.ok){
            return res.json()
        }
    }).then(
        (data) => {
            let l = document.createElement('li');
            l.innerHTML = textInput.value;
            console.log(data);
            ul.appendChild(l);
            errorMessage.classList = 'hidden'
        }
    ).catch((error) => {
        errorMessage.classList = '';
        errorMessage.innerHTML = error.message;})
}
