import React, {useEffect, useState } from 'react';
import TodoItem from "./components/TodoItem";
import './App.css';

function App() {
    const [input, setInput] = useState("");
    const [items, setItems] = useState([]);

    function addItem(event) {
        const newData = {
            task :input,
            completed: false
        }

        fetch("http://localhost:9999/todo", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(newData),
        })
        .then((res) => res.json())
        .then((data) => {
            let tempList = [...items];
            tempList.push(data);
            setItems(tempList);
        });
        getData();
        
        setInput("");
    }

    function removeItem(id) {
        let tempList = [...items];
        const reqBody = { id: tempList[id].id };
        fetch("http://localhost:9999/todo", {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(reqBody),
        }).then((res) => {
          tempList.splice(id, 1);
          setItems(tempList);
        });

    }

    const taskCompleted = (id) => {
        let tempList = [...items];
        const reqBody = {id:items[id].id, task:items[id].task, completed: !items[id].completed}
        fetch("http://localhost:9999/todo", {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(reqBody),
        })
        .then((res) => {
            tempList[id] = reqBody;
            setItems(tempList);
        });
        
    };

    const getData = ()=> {
        fetch("http://localhost:9999/todo")
          .then((res) => res.json())
          .then((data) => {
            data.sort((a, b) => Number(a.id) - Number(b.id));
            setItems(data);
          });
    };

    useEffect(() => {
        getData();
      }, []);

    return (
      <div className="todolist">
          <div className="heading">
              <h1 className="title">To-Do List</h1>
          </div>
              <input
                  type="text"
                  value={input}
                  onChange={(event) => {setInput(event.target.value)}}
              />
              <button onClick={addItem}>Add</button>

          <div className="items">
            <ul>
                {items.map((item, index) => (
                    <TodoItem
                        key={index}
                        id={index}
                        item={item}
                        onDelete={removeItem}
                        onCheck={taskCompleted}
                    />
                ))}
            </ul>
          </div>
      </div>
    );
}

export default App;