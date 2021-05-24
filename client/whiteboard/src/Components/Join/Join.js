import React,{ useState } from 'react';
import {Link} from 'react-router-dom';
import './join.css';
const Join = () => {
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    return ( 
        <div className='JoinOuter'>
            <div className = 'JoinInner'>
                <h1 className='heading'>Join</h1>
                <input type='text' placeholder='Name' id='name' name='name' autoComplete='off' value={name} onChange={(e)=>{setName(e.target.value)}} />
                <br />
                <input type='text' placeholder='Room' id='room' name='room' autoComplete='off' value={room} onChange={(e)=>{setRoom(e.target.value)}} />
                <br />
                <Link onClick={(e)=>(!name || !room)?e.preventDefault():null} to={`/draw?name=${name}&room=${room}`}>
                    <button className='joinbutton' type='submit'>Sign In</button>
                </Link>
            </div>
        </div>
    );
}
 
export default Join;