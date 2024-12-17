// This page defines the layout for the entire application.
// It includes a header, footer, and a place for the page content to be rendered (Outlet).

import { Outlet } from "react-router-dom";

export default function Root() {
	return (
		<div>
			<header>
				<h1>My App Test Header</h1>
			</header>
			<Outlet />
			<footer>
				<p>My App Test Footer</p>
			</footer>
		</div>
	);
}
