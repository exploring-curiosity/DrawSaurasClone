import React from 'react';
import {BrowserRouter as Router , Route} from 'react-router-dom';
import Join from './Components/Join/Join';
// import Chat from './components/Chat/Chat';
import Container from './Components/container/Container';
function App() {

  return (
    <Router>
      <div className="App">
        <Route path='/' exact component={Join}/>
        {/* <Route path='/chat' component={Chat}/> */}
        <Route path='/draw' component={Container}/>
      </div>
    </Router>
  );
}

export default App;
