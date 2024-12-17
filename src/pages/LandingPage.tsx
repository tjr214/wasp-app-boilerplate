import React from "react";
import { Link } from "wasp/client/router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { logout } from "wasp/client/auth";

export function LandingPage(): React.JSX.Element {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
			{/* Hero Section */}
			<div className="container mx-auto px-4 py-24">
				<div className="text-center space-y-8">
					<h1 className="text-6xl font-bold tracking-tighter">
						Welcome to{" "}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
							MyWaspShadcdUIApp
						</span>
					</h1>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto">
						A modern web application built with Wasp, React, and Shadcn/UI. Experience the perfect blend of
						powerful backend capabilities and beautiful UI components.
					</p>

					<div className="flex justify-center gap-4">
						<Link to="/test_page">
							<Button size="lg" variant="default" className="hover:bg-green-600 hover:text-white">
								Main Page
							</Button>
						</Link>
						<Link to="/signup">
							<Button size="lg" variant="default" className="hover:bg-blue-500 hover:text-white">
								Sign Up
							</Button>
						</Link>
					</div>
				</div>

				{/* Feature Cards */}
				<div className="grid md:grid-cols-3 gap-8 mt-24">
					<Card className="p-6 bg-gray-800/50 border-gray-700">
						<h3 className="text-xl font-semibold mb-2 text-white">Type-Safe Development</h3>
						<p className="text-gray-400">
							Built with TypeScript for robust, error-free development experience.
						</p>
					</Card>

					<Card className="p-6 bg-gray-800/50 border-gray-700">
						<h3 className="text-xl font-semibold mb-2 text-white">Modern UI Components</h3>
						<p className="text-gray-400">
							Leveraging Shadcn/UI for beautiful, accessible, and customizable components.
						</p>
					</Card>

					<Card className="p-6 bg-gray-800/50 border-gray-700">
						<h3 className="text-xl font-semibold mb-2 text-white">Full-Stack Framework</h3>
						<p className="text-gray-400">
							Powered by Wasp for seamless integration between frontend and backend.
						</p>
					</Card>
				</div>
			</div>
		</div>
	);
}
