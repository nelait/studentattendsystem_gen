import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewAttendanceDates = () => {
  const [dates, setDates] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await axios.get('/api/attendance/dates');
        setDates(res.data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to fetch dates.' });
      }
    };
    fetchDates();
  }, []);

  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2>
            <button className="btn btn-success" onClick={() => navigate('/addstudent')}>Add Student</button>
            <button className="btn btn-info pull-right" onClick={() => navigate('/')}>Take Attendance</button>
          </h2>
        </div>
        <div className="well text-center">
          <h3><strong>Date:</strong> {new Date().toISOString().split('T')[0]}</h3>
        </div>
        <div className="panel-body">
          {message && (
            <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
              {message.text}
            </div>
          )}
          <form aria-label="Attendance Dates">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th width="30%">Serial No.</th>
                  <th width="50%">Date</th>
                  <th width="20%">Action</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((d, index) => (
                  <tr key={d.att_time}>
                    <td>{index + 1}</td>
                    <td>{d.att_time}</td>
                    <td>
                      <a className="btn btn-primary" href={`/student_view?dt=${d.att_time}`}>View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendanceDates;
