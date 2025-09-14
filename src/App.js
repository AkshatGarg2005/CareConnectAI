import React, { useState } from 'react';
import './App.css';

export default function App(){
  const [messages,setMessages]=useState([{role:'assistant',text:'Hi! I\'m CareConnectAI. How can I help you today?'}]);
  const [input,setInput]=useState('');
  const [busy,setBusy]=useState(false);

  const sendMessage=async e=>{
    e.preventDefault();
    const trimmed=input.trim();
    if(!trimmed||busy) return;

    const next=[...messages,{role:'user',text:trimmed}];
    setMessages(next);
    setInput('');
    setBusy(true);

    try{
      const res=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:trimmed})});
      const data=await res.json();
      const reply=data?.reply??'Sorry, something went wrong.';
      setMessages([...next,{role:'assistant',text:reply}]);
    }catch{
      setMessages([...next,{role:'assistant',text:'Network error. Please try again in a moment.'}]);
    }finally{
      setBusy(false);
    }
  };

  return(
    <div className="app">
      <header className="header">
        <h1>CareConnectAI</h1>
        <p className="tagline">Powered by gpt-5-nano</p>
      </header>
      <main className="chat">
        {messages.map((m,i)=>(<div key={i} className={`bubble ${m.role}`}>{m.text}</div>))}
      </main>
      <footer>
        <form onSubmit={sendMessage} className="composer">
          <input type="text" placeholder="Ask something…" value={input} onChange={e=>setInput(e.target.value)} disabled={busy}/>
          <button type="submit" disabled={busy||!input.trim()}>{busy?'Sending…':'Send'}</button>
        </form>
        <p className="disclaimer">⚠️ For education/support only. Not a medical diagnosis or emergency service.</p>
      </footer>
    </div>
  );
}
