import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AttendanceDetails = () => {
  const { dt } = useParams();
  const navigate = useNavigate();
  const [attendances, setAttendances] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/attendance?date=${dt}`);
        setAttendances(res.data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to fetch attendance details.' });
      }
    };
    fetchData();
  }, [dt]);

  const handleUpdate = async () => {
    try {
      // Prepare data for update
      const updatedData = {};
      attendances.forEach(a => {
        updatedData[a.roll] = a.attend;
      });
      await axios.put('/api/attendance', { att: updatedData, date: dt });
      setMessage({ type: 'success', text: 'Attendance updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update attendance.' });
    }
  };

  const handleRadioChange = (roll, value) => {
    setAttendances(prev => prev.map(a => a.roll === roll ? { ...a, attend: value } : a));
  };

  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2>
            <button className="btn btn-success" onClick={() => navigate('/addstudent')}>Add Student</button>
            <button className="btn btn-info pull-right" onClick={() => navigate('/viewstudent')}>Back</button>
          </h2>
        </div>
        <div className="well text-center">
          <h3><strong>Date:</strong> {dt}</h3>
        </div>
        <div className="panel-body">
          {message && (
            <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
              {message.text}
            </div>
          )}
          <form aria-label="Attendance Details">
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
                {attendances.map((a, index) => (
                  <tr key={a.roll}>
                    <td>{index + 1}</td>
                    <td>{a.name}</td>
                    <td>{a.roll}</td>
                    <td>
                      <label>
                        <input
                          type="radio"
                          name={`attend[${a.roll}]`}
                          value="present"
                          checked={a.attend === 'present'}
                          onChange={() => handleRadioChange(a.roll, 'present')}
                        /> P
                      </label>
                      <label style={{ marginLeft: '10px' }}>
                        <input
                          type="radio"
                          name={`attend[${a.roll}]`}
                          value="absent"
                          checked={a.attend === 'absent'}
                          onChange={() => handleRadioChange(a.roll, 'absent')}
                        /> A
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update</button>
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

export default AttendanceDetails;
