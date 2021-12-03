import { useState } from "react";
import { CSVLink } from "react-csv";

import { formatData, getRunByUserName } from "./util";
import "./styles.css";

const headers = [
  { label: "Game", key: "game" },
  { label: "Level", key: "level" },
  { label: "Category", key: "category" },
  { label: "Video", key: "videos" },
  { label: "Comment", key: "comment" },
  { label: "Other players", key: "players" },
  { label: "Date", key: "date" },
  { label: "RTA", key: "rta" },
  { label: "IGT", key: "igt" },
  { label: "RTA (no loads)", key: "rta_noloads" },
  { label: "Platform", key: "platform" },
  { label: "Emulator", key: "emulator" },
  { label: "Region", key: "region" },
];

const Input = () => {
  const [name, setName] = useState("");
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);

  const getFormattedData = () => {
    setData(null);
    setStatus("Loading...");
    getRunByUserName(name).then((res) => {
      if (!res) {
        return setStatus("User not found");
      }
      const formattedData = formatData(res, name);
      setData(formattedData);
      setStatus(null);
    });
  };

  return (
    <div className="main">
      <h1>SRC profile export</h1>
      <input
        onChange={(e) => setName(e.target.value)}
        value={name}
        placeholder="speedrun.com username"
      ></input>
      <button onClick={getFormattedData} disabled={status === "Loading..."}>
        Fetch runs
      </button>

      {status && <div>{status}</div>}

      {data && (
        <CSVLink data={data} headers={headers} filename={`src_${name}.csv`}>
          Download CSV
        </CSVLink>
      )}
    </div>
  );
};

export default Input;
