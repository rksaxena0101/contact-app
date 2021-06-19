import React from "react";

const PopUp = () => {
  const popup = alert("Do you really want to delete that contact?");
  return <div className="ui popup">{popup}</div>;
};

export default PopUp;
