import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import App from "./App"
export default function AppRoute() {
  return (
    <Router>
      <Route path={"/"} component={App}></Route>
    </Router>
  )
}
