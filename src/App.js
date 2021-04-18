import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DenseAppBar from "./components/navBar";
import TextField from "@material-ui/core/TextField";
import "./App.css";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import Alert from "@material-ui/lab/Alert";

const App = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [page, setPage] = useState(1);

  const filteredArray = userInput
    ? data.filter((item) =>
        item.name.toLowerCase().includes(userInput.toLowerCase())
      )
    : data;

  const fetchCharacters = useCallback(() => {
    axios({
      url: `https://rickandmortyapi.com/api/character/?page=${page}`,
      method: "GET",
    })
      .then((response) => {
        setLoading(false);
        setData(response.data.results);
      })
      .catch((err) => {
        setError(err?.response.data.message);
      });
  }, [page]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const searchByNameHandler = useCallback((name) => {
    setUserInput(name);
  }, []);

  if (loading) {
    return <LinearProgress />;
  } else if (!loading && error) {
    return <Alert severity="error">Something went wrong ! </Alert>;
  }

  return (
    <div className="App">
      <DenseAppBar />
      <div className="search">
        <TextField
          id="standard-basic"
          label="Search character by name"
          fullWidth
          value={userInput}
          onChange={(e) => searchByNameHandler(e.target.value)}
        />
      </div>
      <div className="wrapper">
        {filteredArray ? (
          filteredArray.map((data, index) => (
            <div key={data.id} className="img-wrapper">
              <div className="img-div">
                {" "}
                <img src={data.image} className="img" alt="#" />
              </div>
              <div className="img-info">
                <p>{`Name: ${data.name}`}</p>
                <p>{`ID: ${data.id}`}</p>
                <p>{`Gender: ${data.gender}`}</p>
                <p>{`Species: ${data.species}`}</p>
                <p>{`Status: ${data.status}`}</p>
              </div>
            </div>
          ))
        ) : (
          <h1>No results!</h1>
        )}
      </div>
      <div className="pagination-div">
        <Typography>Page: {page}</Typography>
        <Pagination count={34} page={page} onChange={handleChange} />
      </div>
    </div>
  );
};

export default App;
