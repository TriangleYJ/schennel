const list_render = () => {
    fetch("/api/todo")
    .then(res => res.json())
    .then(json => {
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

const item_edit = (id) => {
    fetch(`/api/todo/${id}`)
    .then(res => res.json())
    .then(json => {
        document.querySelector("#edit_id").value = json.id
        document.querySelector("#title").value = json.title
        document.querySelector("#subtitle").value = json.subtitle
        document.querySelector("#date").value = json.date
    })
}

const item_delete = (id) => {
    fetch(`/api/todo/${id}/delete`, {method: "DELETE"})
    .then(res => {
        if(res.status === 200) console.log("Successfully Deleted!")
        else console.log("An error occured during deletion!", res.status)
    })
    list_render()
}

window.onload = () => {
    list_render()
}

