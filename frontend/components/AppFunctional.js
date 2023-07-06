import React, { useState } from 'react';
import axios from 'axios';

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
 
  const [state, setState] = useState({
    message: initialMessage,
    email: initialEmail,
    steps: initialSteps,
    index: initialIndex
  })

  function getXY() {

    return [state.index%3+1, Math.floor(state.index/3 +1)]

  }

  function getXYMesaj() {
    const [x, y]= getXY();
    return `Koordinatlar (${x},${y})`
  }

  function reset() {
    setState({
    message: initialMessage,
    email: initialEmail,
    steps: initialSteps,
    index: initialIndex
    })
  }

  function sonrakiIndex(yon) {
    const [x, y]= getXY();
    if(yon == 'left' && x!== 1 ){
      setState({...state, index: state.index-1, message:"", steps: state.steps+1})
    }
    else if(yon == 'right'  && x!== 3){
      setState({...state, index: state.index+1, message:"", steps: state.steps+1})
    }
    else if(yon == 'up'  && y!== 1){
      setState({...state, index: state.index-3, message:"", steps: state.steps+1})
    }
    else if(yon == 'down'  && y!== 3){
      setState({...state, index: state.index+3, message:"", steps: state.steps+1})
    };

    if(yon == 'left' && x=== 1 ){
      setState({...state,  message:"Sola gidemezsiniz"})
    }
    else if(yon == 'right'  && x=== 3){
      setState({...state,  message:"Sağa gidemezsiniz"})
    }
    else if(yon == 'up'  && y=== 1){
      setState({...state,  message:"Yukarıya gidemezsiniz"})
    }
    else if(yon == 'down'  && y=== 3){
      setState({...state,  message:"Aşağıya gidemezsiniz"})
    };
    
  }

  function ilerle(evt) {
    sonrakiIndex(evt.target.id);
  }

  function onChange(evt) {
    setState({...state, email:evt.target.value});
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const [x, y]= getXY();
    const payload = {x: x,y: y, steps: state.steps, email: state.email}
    axios 
      .post(`http://localhost:9000/api/result`, payload)
      .then(res=>{
        setState({...state,  message: res.data.message, email:""})
      })
      .catch(err=>{
        setState({...state,  message: err.response.data.message, email:""})
      })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{state.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === state.index ? ' active' : ''}`}>
              {idx === state.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>SOL</button>
        <button id="up" onClick={ilerle}>YUKARI</button>
        <button id="right" onClick={ilerle}>SAĞ</button>
        <button id="down" onClick={ilerle}>AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" value={state.email} placeholder="email girin" onChange={onChange}></input>
        <input id="submit" type="submit" ></input>
      </form>
    </div>
  )
}
