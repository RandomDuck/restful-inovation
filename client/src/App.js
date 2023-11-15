import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import queryHandler from './utils/queryHandler';
import './App.css';

function App() {
  const [token, setToken] = useState({login:false})
  const logout = ()=>{setToken({login:false})}
  return (
    <div className="App">
      <header className="App-header">
        {token.login && <button onClick={logout}>Logout</button>}
        {token.login && <NoteUi token={token} />}
        {!token.login && <LoginUi callback={setToken}/>}
      </header>
    </div>
  );
}

function capitalize(target) {
  return target.charAt(0).toUpperCase() + target.slice(1);
}

function NoteUi({token}) {
  const {user: name} = token;
  const [texts, setTexts] = useState([]);

  const removeNote = (i) => {
    texts.splice(i,1)
    setTexts([...texts])
  }

  const newPad = ()=>{
    const index = texts.length
    texts.push("");
    texts[index]="new pad"
    setTexts([...texts])
  }

  useEffect(()=>{
    try {
      queryHandler.get('/notes/'+name).then((res) => {
        setTexts([...res.notes])
      });
    }
    catch {
      queryHandler.post('/notes/', {username: name}).then((res)=>{
        setTexts([...res.notes])
      });
    }
    // eslint-disable-next-line 
  }, []);

  function handleChange(index, event) {
    console.log(event.target.value)
    texts[index] = event.target.value;
    setTexts([...texts])
  }
  
 

  return (
    <>
      <p>Welcome {capitalize(name)}</p>
      <button onClick={newPad}>Add note</button>
      <div style={{display:'flex', flexDirection:'row', maxWidth:'80vw', flexWrap:'wrap'}}>
        {texts.map((val,i) => (
          <div style={{display:'flex', flexDirection:'column'}}>
            <textarea key={i} rows="10" cols="20" onChange={(e)=>handleChange(i, e)} value={val}/>
            <button onClick={()=>removeNote(i)}>Remove note</button>
          </div>
        ))}
      </div>
      <button onClick={()=>queryHandler.patch('/notes/'+name, {notes: texts})}>save</button>
    </>
  )
}

function LoginUi({callback}) {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  async function login() {
    const res = await queryHandler.post(`/users/${name}`, {password: pass})
    callback(res)
  }
  async function register() {
    await queryHandler.post(`/users/`, {username: name, password: pass})
    login();
  }
  
  return (
    <>
        <img src={logo} className="App-logo" alt="logo" />
        <span>Username</span>
        <input type="text" onChange={e=>setName(e.target.value)} value={name} />
        <span>Password</span>
        <input type="password" onChange={e=>setPass(e.target.value)} value={pass} />
        <button onClick={login}>login</button>
        <button onClick={register}>register</button>
    </>
  )
}

export default App;
