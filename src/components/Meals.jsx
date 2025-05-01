import { useMemo } from "react";
import useHttp from "../hooks/useHttp";
import MealItems from "./MealItem";
import Error from "./Error";
export default function Meals() {
  const config = useMemo(() => ({ method: 'GET' }), []);
  const {
    data: loadedMeals,
    loading,
    error,
  } = useHttp("http://localhost:3000/meals", config, []);
  
  if(loading) {
    return <p className="center">Fetching meals...</p>
  }

  if(error) {
    return <Error title="Failed to fetc h meals" message={error}/>
  }
  return (
    <ul id="meals">
      {loadedMeals?.map((meal) => (
        <MealItems key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
