import { LoginForm } from "wasp/client/auth";
// Wasp's type-safe Link component
import { Link } from "wasp/client/router";
import { authAppearance } from "./appearance";

export function LoginPage() {
	return (
		<main>
			{/** Wasp has built-in auth forms & flows, which you can customize or opt-out of, if you wish :)
			 * https://wasp-lang.dev/docs/guides/auth-ui
			 */}
			<Layout>
				<LoginForm appearance={authAppearance} />
				<br />
				<span>
					I don't have an account yet (<Link to="/signup">go to signup</Link>).
				</span>
				<p></p>
				<span>Current Client URL: {import.meta.env.REACT_APP_WASP_WEB_CLIENT_URL}</span>
				<p></p>
				<span>
					<Link to="/">go to landing</Link>
				</span>
			</Layout>
		</main>
	);
}

// A layout component to center the content
export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-full w-full bg-white">
			<div className="flex min-h-[75vh] min-w-full items-center justify-center">
				<div className="h-full w-full max-w-sm bg-white p-5">
					<div>{children}</div>
				</div>
			</div>
		</div>
	);
}
