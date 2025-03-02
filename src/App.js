import React from "react";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./routes/AppRouter"; // For User Routes
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <div>
      {/* Combine both routers in App.js */}
      <RouterProvider router={AppRouter} />
      
    </div>
  );
};

export default App;
