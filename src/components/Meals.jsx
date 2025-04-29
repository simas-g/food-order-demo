import { useState } from "react";
import { useEffect } from "react";
import MealItems from "./MealItem";

export default function Meals() {
  const [loadedMeals, setLoadedMeals] = useState([]);
  useEffect(() => {
    async function getData() {
      const res = await fetch("http://localhost:3000/meals");
      if (!res.ok) {
      }
      const meals = await res.json();
      setLoadedMeals(meals)
    }
    getData();
  }, []);
  return <ul id="meals">{loadedMeals.map((meal) => (
    <MealItems key={meal.id} meal={meal}/>
  ))}</ul>;
}
