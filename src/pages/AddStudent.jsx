import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddStudent = () => {
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !roll.trim() || isNaN(roll)) {
      setMessage({ type: 'error', text: 'Please enter valid name and roll.' });
      return;
    }
    try {
      await axios.post('/api/students', { name, roll: parseInt(roll, 10) });
      setMessage({ type: 'success', text: 'Student added successfully.' });
      setName('');
      setRoll('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Error adding student.' });
    }
  };

  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2>
            <button className="btn btn-success" onClick={() => navigate('/')}>Add Student</button>
            <Link to="/" className="btn btn-info pull-right">Back</Link>
          </h2>
        </div>
        <div className="panel-body">
          {message && (
            <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} aria-label="Add Student Form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                className="form-control medium"
                style={{ width: '480px', height: '45px' }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="roll">Roll</label>
              <input
                id="roll"
                className="form-control medium"
                style={{ width: '480px', height: '45px' }}
                type="number"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
