import "./Users.scss";
import { formatDateTimeMoscow } from "../../shared/utils/dateUtils";

export const LogsTable = ({ logs }) => {
  return (
    <div>
      <table className="users-table">
        <thead>
          <tr>
            <th>Id сервера</th>
            <th>Сервер</th>
            <th>Время подключения</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log._id}</td>
              <td>{log.country}</td>
              <td>{formatDateTimeMoscow(log.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
