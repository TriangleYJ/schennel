const error_handler = res =>
    new Promise((resolve, reject) => {
        if(res.status === 200){
            //console.log(res)
            resolve(res)
        }
        else{
            console.log("An error occured!", res.status)
            reject(Error("API Error"))
        }
    })

const list_render = (query) => {
    fetch("/api/todo" + (query ?? "?filter=title"))
    .then(res => error_handler(res))
    .then(res => res.json())
    .then(json => {
        document.querySelector("#list").innerHTML = ""
        for(let i of json){
            document.querySelector("#list").innerHTML += 
                `<dt>${i.title}</dt>
                <dd>${i.subtitle}</dd>
                <dd>Due date: ${i.date}</p>
                <button onclick="item_edit(${i.id})">edit</button>
                <button onclick="item_delete(${i.id})">delete</button>
                <hr />`
        }
    })
}

const filter = () => {
    const filter_select = document.querySelector("#filter")
    const value = filter_select.options[filter_select.selectedIndex].value
    switch(value){
        case "date_new":
            list_render("?filter=date_new")
            break;
        case "title":
            list_render("?filter=title")
            break;
        case "unknown":
            break;
    }
}

const submit_form = () => {
    const id = document.querySelector("#edit_id").value
    const title = document.querySelector("#title").value
    const subtitle = document.querySelector("#subtitle").value
    const date = document.querySelector("#date").value
    const serial = {title, subtitle, date}

    const method = id ? "PUT" : "POST"
    const url = '/api/todo' + (id ? '/' + id : '')
    fetch(url, {method, body: JSON.stringify(serial), headers: {"Content-Type": 'application/json'}})
    .then(res => error_handler(res))
    .then(() => {
        edit_cancel()
        list_render()    
    })
    return false;
}

const set_input = (id, title, subtitle, date) => {
    document.querySelector("#edit_id").value = id
    document.querySelector("#title").value = title
    document.querySelector("#subtitle").value = subtitle
    document.querySelector("#date").value = date
}

const edit_cancel = () => {
    set_input("", "", "", "")
    document.querySelector("#header_text").textContent = "Enter your Todo"
    document.querySelector("#cancel").style = "visibility: collapse;"
}

const item_edit = (id) => {
    document.querySelector("#header_text").textContent = "Edit your Todo"
    document.querySelector("#cancel").style = "visibility: visible;"
    fetch(`/api/todo/${id}`)
    .then(res => error_handler(res))
    .then(res => res.json())
    .then(({id, title, subtitle, date}) => {
        set_input(id, title, subtitle, date)
    })
}

const item_delete = (id) => {
    fetch(`/api/todo/${id}`, {method: "DELETE"})
    .then(res => error_handler(res))
    .then(() => list_render())
}

window.onload = () => {
    list_render()
}

