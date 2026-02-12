import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TakeAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [currDate, setCurrDate] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('/api/students');
        setStudents(res.data);
        // Initialize attendance state
        const initialAttendance = {};
        res.data.forEach(s => {
          initialAttendance[s.roll] = 'absent';
        });
        setAttendance(initialAttendance);
        const today = new Date().toISOString().split('T')[0];
        setCurrDate(today);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to fetch students.' });
      }
    };
    fetchStudents();
  }, []);

  const handleAttendanceChange = (roll, value) => {
    setAttendance(prev => ({ ...prev, [roll]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/attendance', { att: attendance, date: currDate });
      setMessage({ type: 'success', text: 'Attendance data inserted.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to submit attendance.' });
    }
  };

  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2>
            <button className="btn btn-success" onClick={() => navigate('/addstudent')}>Add Student</button>
            <button className="btn btn-info pull-right" onClick={() => navigate('/viewstudent')}>View</button>
          </h2>
        </div>
        <div className="well text-center">
          <h3><strong>Date:</strong> {currDate}</h3>
        </div>
        <div className="panel-body">
          {message && (
            <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} aria-label="Attendance Form">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th width="25%">Serial No.</th>
                  <th width="25%">Student Name</th>
                  <th width="25%">Student Roll</th>
                  <th width="25%">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, index) => (
                  <tr key={s.roll}>
                    <td>{index + 1}</td>
                    <td>{s.name}</td>
                    <td>{s.roll}</td>
                    <td>
                      <label>
                        <input
                          type="radio"
                          name={`attend[${s.roll}]`}
                          value="present"
                          checked={attendance[s.roll] === 'present'}
                          onChange={() => handleAttendanceChange(s.roll, 'present')}
                        /> P
                      </label>
                      <label style={{ marginLeft: '10px' }}>
                        <input
                          type="radio"
                          name={`attend[${s.roll}]`}
                          value="absent"
                          checked={attendance[s.roll] === 'absent'}
                          onChange={() => handleAttendanceChange(s.roll, 'absent')}
                        /> A
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TakeAttendance;
