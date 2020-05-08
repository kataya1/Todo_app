const todoTextInput = document.querySelector("#todo_post");
const todoinputForm = document.querySelector("form.todo");
const listTextInput = document.querySelector("#list_post")
const listInputForm = document.querySelector("form.list")
const ul = document.querySelector("ul.todo");
const listUl = document.querySelector("ul.list")
const errorMessage = document.querySelector("#todo_error")
const checkboxes = document.querySelectorAll(".check-completed")
const deleteButtons = document.querySelectorAll('.delete_button')

const active_list = document.querySelector("#active_list")







giveError = (error) => {
    errorMessage.classList = '';
    errorMessage.innerHTML = error.message;}
    
onDeleteClick = (e) => {
    e.preventDefault()
    link = `/delete/${e.path[2].classList[0]}/${e.target.dataset.id}`
    console.log(link)
    fetch( link, {
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
    console.log(e)
    
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

check_boxes_listen = (checkbox) => {
    checkbox.addEventListener('change', onCheckboxChange);
}

delete_buttons_listen = (deleteButton) => {
    deleteButton.addEventListener('click', onDeleteClick)
}
// assign event listeners
for(let i=0; i < deleteButtons.length; i++)
{
    check_boxes_listen(checkboxes[i])
    delete_buttons_listen(deleteButtons[i])
}
    // resolve between todo and list
    // function resolve(e){
//     if(e.path[0] === 'input.')
// }
todoinputForm.addEventListener("submit", onSubmit);
listInputForm.addEventListener("submit", onSubmitList);
function onSubmit(e){
    e.preventDefault()
    console.log(e)
    active_list_id = active_list.getAttribute('data-id')
    link = "/todo/create/" + active_list_id
    console.log("link", link)
    fetch(link, {
        method: "POST",
        body: JSON.stringify({
            description: todoTextInput.value
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
            
            l.innerHTML = `${todoTextInput.value}`
            //function to add onCheckboxChange event litener
            console.log(data);
            ul.appendChild(l);
            errorMessage.classList = 'hidden'
        }
    ).catch(giveError)
}
function onSubmitList(e){
    e.preventDefault()
    console.log(e)
    
    fetch("/list/create" , {
        method: "POST",
        body: JSON.stringify({
            name: listTextInput.value
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
            
            l.innerHTML = `${listTextInput.value}`
            //function to add onCheckboxChange event litener
            console.log(data);
            listUl.appendChild(l);
            errorMessage.classList = 'hidden'
        }
    ).catch(giveError)
}