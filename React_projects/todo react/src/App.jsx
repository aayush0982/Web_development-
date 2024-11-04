import { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from 'react-icons/md';

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("Untitled");
  const [allTodos, setAllTodos] = useState({});

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || {};
    setAllTodos(savedTodos);
    if (savedTodos[title]) {
      setTodos(savedTodos[title]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(allTodos));
  }, [allTodos]);

  const ipchange = (e) => {
    setTodo(e.target.value);
  };

  const addTodo = () => {
    const newTodos = [...todos, { id: uuidv4(), text: todo, isCompleted: false }];
    setTodos(newTodos);
    setTodo("");
    saveTodos(newTodos);
  };

  const tododel = (id) => {
    const remainingTodos = todos.filter(item => item.id !== id);
    setTodos(remainingTodos);
    saveTodos(remainingTodos);
  };

  const toggleCompletion = (id) => {
    const updatedTodos = todos.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const todoedit = (e, id) => {
    let temp = todos.filter(i => i.id === id);
    setTodo(temp[0].text);
    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos); 
  };

  const changeTitle = (e) => {
    setTitle(e.target.value);
  };

  const saveTodos = (newTodos) => {
    setAllTodos(prev => ({ ...prev, [title]: newTodos }));
  };

  const loadTodos = (titleKey) => {
    setTitle(titleKey);
    setTodos(allTodos[titleKey] || []); 
  };

  const deleteTitle = (titleKey) => {
    const updatedTodos = { ...allTodos };
    delete updatedTodos[titleKey];
    setAllTodos(updatedTodos);
    if (titleKey === title) {
      setTitle("Untitled");
      setTodos([]);
    }
  };

  return (
    <>
      <div className="main">
        <div className="sidebar flex-col">
          <h1 className='apph'>FocusFlow</h1>
          {Object.keys(allTodos).map((titleKey) => (
            <div className="maincard" key={titleKey}>
              <div className="cardtemp flex gap-4 items-start">
                <p className="title cursor-pointer" onClick={() => loadTodos(titleKey)}>{titleKey}</p>
                <button className='titledelbtn my-1' onClick={() => deleteTitle(titleKey)}><MdDelete /></button>
              </div>
              <div className="line"></div>
            </div>
          ))}
        </div>
        <div className="container bg-violet-100 p-4">
          <input 
            onChange={changeTitle} 
            className='titleinp w-fit bg-transparent  px-1 h-16 text-3xl' 
            type="text" 
            value={title}
          />
          <div className="ip flex gap-4">
            <input 
              className='input px-4' 
              onChange={ipchange} 
              value={todo} 
              type="text" 
              placeholder='Enter the task/todo' 
            />
            <button onClick={addTodo} className="add bg-green-600">Add</button>
          </div>

          <div className="textcontainer">
            <div className="pending_todos">
              <p className="h">Pending Todos</p>
              <div className="todoel">
                {todos.filter(item => !item.isCompleted).length === 0 && <div className="write px-2">No todos to display</div>}
                {todos.filter(item => !item.isCompleted).map(item => (
                  <div className="todotextcontainer flex items-start gap-2" key={item.id}>
                    <input
                      type="checkbox"
                      className='donecheck mt-1'
                      checked={item.isCompleted}
                      onChange={() => toggleCompletion(item.id)}
                    />
                    <div className="t w-96">{item.text}</div>
                    <button className='editbtn mt-1' onClick={(e) => { todoedit(e, item.id) }}><MdModeEdit /></button>
                    <button className='delbtn mt-1' onClick={() => tododel(item.id)}><MdDelete /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="linetodo"></div>

            <div className="completed_todos">
              <p className="h">Completed Todos</p>
              <div className="todoel">
                {todos.filter(item => item.isCompleted).length === 0 && <div className="write px-2">No completed todos</div>}
                {todos.filter(item => item.isCompleted).map(item => (
                  <div className="todotextcontainer flex items-start gap-2" key={item.id}>
                    <input
                      type="checkbox"
                      className='donecheck mt-1'
                      checked={item.isCompleted}
                      onChange={() => toggleCompletion(item.id)}
                    />
                    <div className="t w-96">{item.text}</div>
                    <button className='delbtn mt-1' onClick={() => tododel(item.id)}><MdDelete /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
