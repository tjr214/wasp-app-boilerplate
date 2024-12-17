import { SignupForm } from "wasp/client/auth";
// Wasp's type-safe Link component
import { Link } from "wasp/client/router";
import { authAppearance } from "./appearance";

export function SignupPage() {
	return (
		<main>
			{/** Wasp has built-in auth forms & flows, which you can customize or opt-out of, if you wish :)
			 * https://wasp-lang.dev/docs/guides/auth-ui
			 */}
			<Layout>
				<SignupForm appearance={authAppearance} />
				<br />
				<span>
					I already have an account (<Link to="/login">go to login</Link>).
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
