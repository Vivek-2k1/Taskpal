import { useEffect, useState } from "react";
import axios from "axios";

export default function Home(){
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [info, setInfo] = useState([]);
	const [ans,setAns] = useState("");
  const [date, setDate] = useState();
  const [filter, setFilter] = useState("all");

  useEffect( () => {
		let url = "https://activityscheduler.pythonanywhere.com/api/tasks/";
    axios.get(url)
    .then(res => {
      setInfo(res.data);
      document.querySelector('.task-list').classList.add('loaded');
    })
    .catch( err => console.log("Issue : " + err))
  }, []);

	const save = (event) =>{
		event.preventDefault();
		let data = { title, description, date };
		let url = "https://activityscheduler.pythonanywhere.com/api/tasks/";
		axios.post(url,data)
		.then(res => {
      setAns("Task Created")
      window.location.reload()
    })
		.catch(err => setAns("issue : " + err));
	}

  const deleteTask = (taskId) => {
    let url = `https://activityscheduler.pythonanywhere.com/api/task/${taskId}/`
    axios
      .delete(url)
      .then((res) => {
        setAns("Task Deleted");
        setInfo((prevInfo) => prevInfo.filter((task) => task.id !== taskId))
      })
      .catch((err) => setAns("Issue : " + err));
  }

  const filterTasks = (criteria) => {
    setFilter(criteria);
  }
  const filteredTask = info.filter(task => {
    const taskDate = new Date(task.date);
  
  if (filter === "today") {
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  }

  if (filter === "thisWeek"){
    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    return taskDate >= thisWeek;
  }

  if (filter === "thisMonth"){
    const thisMonth = new Date();
    thisMonth.setDate(1);
    return taskDate >= thisMonth;
  }

  return true;

  })
  
	return(
		<>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"/>
			<h1 className="website-name">TaskPal .</h1>

      <div className="form-container">
        <form onSubmit = {save}>
          <label for="title">Title : </label>
          <input type="text" placeholder="Title" id="title" name="title" className="form-input" onChange={ (event) => {setTitle(event.target.value);} } required/>
          
          <label for="date">Task Date : </label>
          <input type="date" id="date" name="date" className="form-input" onChange={ (event) => {setDate(event.target.value);} } required/>
          
          <label for="description">Description : </label>
          <textarea placeholder="Description" id="description" name="description" className="form-input"onChange={ (event) => {setDescription(event.target.value);} } required/>

          <button type="submit" className="submit-btn">Create</button>
        </form>
      </div>
      
      <div className="task-list">
        <h2>Task Overview</h2>
        <div className="filter-options">
          <button onClick={() => filterTasks('all')} className="filter-btn">All</button>
          <button onClick={() => filterTasks('today')} className="filter-btn">Today</button>
          <button onClick={() => filterTasks('thisWeek')} className="filter-btn">Current Week</button>
          <button onClick={() => filterTasks('thisMonth')} className="filter-btn">Current Month</button>
        </div>
        {filteredTask.length === 0 ?(
          <p>No tasks for selected filter.</p>
        ) : (filteredTask.map(task => (
              <div key={task.id} className="task-item">
                <button onClick={() => deleteTask(task.id)} className="delete-btn">X</button>
                <h3 className="task-title">{ task.title }</h3>
                <p className="task-date">{ task.date }</p>
                <p className="task-description">{ task.description }</p>
              </div>
          ))
        )}
      </div>
		</>
	);
};