import React from "react";

function TodoItem({ id, item, onCheck, onDelete }) {
    const eventListen = (event) => {
        if(event.target.classList[0] === "task") {
            onCheck(id);
        }
        else onDelete(id);
    }
    return (
        <>
        <li
            style = {{textDecoration: item.completed ? "line-through":""}}
            onClick={eventListen}
        >
            <span className="task">{item.task}</span>
            <span className="xmark">X</span>
        </li>
         
        </>
    )
}

export default TodoItem;