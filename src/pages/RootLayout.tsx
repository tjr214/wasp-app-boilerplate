// This page defines the layout for the entire application.
// It includes a place for the page content to be rendered (Outlet).

import "../styles/style.css";

import { Outlet } from "react-router-dom";

export default function Root() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
