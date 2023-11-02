import React from "react";

function MenuCard({ outlet }) {
  return (
    <div className="w-full h-full bg-gray-900">
      <h1 className="text-center text-lg text-white">{outlet.name}</h1>
      {outlet.medias.backgrounds && outlet.medias.backgrounds[0] && (
        <div
          className="w-full h-96 bg-cover rounded-lg"
          style={{
            backgroundImage: `url(${outlet.medias.backgrounds[0].url})`,
          }}
        />
      )}
    </div>
  );
}

export default MenuCard;
