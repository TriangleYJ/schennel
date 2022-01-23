const list_render = () => {
    fetch("/api/todo")
    .then(res => res.json())
    .then(json => {
        for(let i of json){
            document.querySelector("#list").innerHTML += 
                `<dt>${i.title}</dt>
                <dd>${i.subtitle}</dd>
                <dd>Due date: ${i.date}</p>
                <button onclick="event(${i.id})">edit</button>
                <button id="delete-${i.id}">delete</button>
                <hr />`
            
        }
    })
}

const event = (id) => {
    console.log(id)
}

window.onload = () => {
    list_render()
}

