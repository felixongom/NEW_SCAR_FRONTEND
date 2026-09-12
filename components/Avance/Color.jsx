import React from "react";

export default function ColorShadesDisplay({ colors }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-9 gap-4 p-4">
      {Object.entries(colors).map(([name, hex]) => (
        <div
          key={name}
          className="rounded-xl shadow-md overflow-hidden border cursor-pointer"
        >
          <div
            className="h-10"
            style={{ backgroundColor: hex }}
          />
          <div className="p-2 text-center text-sm">
            <div className="font-medium">{name}</div>
            <div className="text-gray-600">{hex}</div>
          </div>
        </div>
      ))}
    </div>
  );
}


