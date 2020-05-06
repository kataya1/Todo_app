let textInput = document.querySelector("#post");
const inputForm = document.querySelector("form");
const ul = document.querySelector("ul");
const errorMessage = document.querySelector("#error")
const checkboxes = document.querySelectorAll(".check-completed")
const deleteButtons = document.querySelectorAll('.delete-button')







check_boxes_listen = (checkbox) => {
    checkbox.addEventListener('change', onCheckboxChange);
}

delete_buttons_listen = (deleteButton) => {
    deleteButton.addEventListener('click', onDeleteClick)
}


giveError = (error) => {
    errorMessage.classList = '';
    errorMessage.innerHTML = error.message;}
    
onDeleteClick = (e) => {
    e.preventDefault()
    console.log(e.target.dataset.id)
    fetch('/todo/'+ e.target.dataset.id + '/delete_todo', {
        method: 'DELETE',
        headers: {
            "Content-Type": 'application/json'
        }
    }).then(res => res.json())
    .then((data) =>{
        if(data['deleted']){
            console.log(e.target.parentElement)
            e.target.parentElement.remove()
        }
    })
}
onCheckboxChange = (e) => {
    e.preventDefault()
    let checkbox_state = e.target.checked
    let cbox_id = e.target.dataset['id']

    fetch('/todo/'+ cbox_id + '/set_completed', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'completed': checkbox_state
        })
    })
    .then((res) => res.json())
    .then((data)=> {
        console.log(data);
        errorMessage.classList = 'hidden'})
        .catch(giveError)
    }
    
for(let i=0; i < checkboxes.length; i++)
{
    check_boxes_listen(checkboxes[i])
    delete_buttons_listen(deleteButtons[i])
}

inputForm.addEventListener("submit", onSubmit);
function onSubmit(e){
    console.log(e)
    e.preventDefault()
    fetch("/todo/create", {
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
            // comment tdrsarsrassdtsdtsdtsd
            
            l.innerHTML = `${textInput.value}`
            //function to add onCheckboxChange event litener
            console.log(data);
            ul.appendChild(l);
            errorMessage.classList = 'hidden'
        }
    ).catch(giveError)
}
