import "./Users.scss";

export const UsersLogs = ({ logs }) => {
  return (
    <div>
      <table className="logs-table">
        <thead>
          <tr>
            <th>Страна</th>
            <th>Время подключения</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.country}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
