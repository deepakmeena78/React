import React, { useState, useEffect } from 'react';
import { getposts, getRandomUser } from "./api/index.js";
import './App.css';
import PostCard from './components/PostCard.jsx';
import UserCard from './components/UserCard.jsx';

function App() {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getposts().then((posts) => { setData(posts); });
  }, []);

  useEffect(() => {
    getRandomUser().then(user => setUserData(user.results[0]));
  }, []);

  const refresh = () => {
    getRandomUser().then(user => setUserData(user.results[0]))
  };

  return (
    <div className="App">
      {userData && <UserCard data={userData} />}
      <button onClick={refresh}>Refresh User</button>
      {data ? (
        data.map((e) => <PostCard key={e.id} title={e.title} body={e.body} />)
      ) : (
        <p>No Data</p>
      )}
    </div>
  );
}

export default App;
