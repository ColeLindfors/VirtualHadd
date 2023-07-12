import { useState, useEffect } from "react";
import "./Beer.css";

export default function Beer() {
  const [isPouring, setIsPouring] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [isHeadActive, setIsHeadActive] = useState(false);

  useEffect(() => {
    const beerRise = () => {
      setIsFilling(true);
      setIsHeadActive(true);
    };

    const pourBeer = () => {
      setIsPouring(true);
      beerRise();
      setTimeout(() => {
        setIsPouring(false);
        // setIsFilling(false);
      }, 1500);
      setTimeout(() => {
      }, 2500);
    };

    const timer = setTimeout(() => {
      pourBeer();
    }, 500);
  }, []);

  return (
    <div id="container">
      <div className={`glass ${isFilling ? "fill" : ""}`}>
        <div className={`beer ${isFilling ? "fill" : ""}`}></div>
      </div>
      <div className={`head ${isHeadActive ? "active" : ""}`}></div>
      <div className={`pour ${isPouring ? "pouring" : ""}`}></div>
    </div>
  );
}