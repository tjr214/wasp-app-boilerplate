/*
Wasp executes this function on the client before everything else.
It is expected to be asynchronous, and Wasp will await its completion before rendering the page.
The function takes no arguments, and its return value is ignored.

You can use this function to perform any custom setup (e.g., setting up client-side periodic jobs, etc).
*/

export default async function mySetupFunction(): Promise<void> {
	// Run some code
}
