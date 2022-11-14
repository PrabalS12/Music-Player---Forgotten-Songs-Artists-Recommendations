import React from "react";
import DecadesCard from "./Cards";

const years = [
  {
    decade: "T10s",
    imgUrl: "https://i.scdn.co/image/ab67706f000000036532a0c7c8aa3e40a5851d8c",
  },
  {
    decade: "T00s",
    imgUrl: "https://i.scdn.co/image/ab67706f0000000330ef8caeeaa88e4dad4a65e9",
  },
  {
    decade: "T90s",
    imgUrl: "https://i.scdn.co/image/ab67706f0000000328860b22ec5c969ef81fb459",
  },
  {
    decade: "T80s",
    imgUrl: "https://i.scdn.co/image/ab67706f000000032889672163c2480fde79c7fd",
  },
  {
    decade: "T70s",
    imgUrl: "https://i.scdn.co/image/ab67706f00000003fbd00a8170cc83366f1a651a",
  },
  {
    decade: "retro",
    imgUrl: "https://i.scdn.co/image/ab67706f000000036800079a717dd3dddee3c82e",
  },
];
function Decades() {
  return (
    <>
      <div id="Main_Item_Container">
        {years.map((element, i) => {
          return (
            <>
              <DecadesCard
                key={i}
                decade={element.decade}
                imgUrl={element.imgUrl}
              />
            </>
          );
        })}
      </div>
    </>
  );
}

export default Decades;
