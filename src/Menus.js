import React from "react";
import MenuCard from "./MenuCard";

function Menus({ outlets }) {
  return (
    <div className="grid grid-cols-3 gap-5 grid-flow-row w-full">
      {outlets.map((outlet, index) => (
        <MenuCard key={index} outlet={outlet} />
      ))}
    </div>
  );
}

export default Menus;
