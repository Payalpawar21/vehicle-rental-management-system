import React from "react";

function SearchBar({ search, setSearch }) {
  return (

    <div className="d-flex justify-content-end mb-3">

      <div className="input-group" style={{ width: "300px" }}>

        <span className="input-group-text">
          🔍
        </span>

        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

    </div>

  );
}

export default SearchBar;