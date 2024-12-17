import type { CustomizationOptions } from "wasp/client/auth";

export const authAppearance: CustomizationOptions["appearance"] = {
	colors: {
		// Custom Color Scheme:
		brand: "#5969b8", // blue
		brandAccent: "#de5998", // pink
		submitButtonText: "white",

		// Built-in Wasp Color Scheme:
		waspYellow: "#ffcc00",
		gray700: "#a1a5ab",
		gray600: "#d1d5db",
		gray500: "gainsboro",
		gray400: "#f0f0f0",
		red: "#FED7D7",
		darkRed: "#fa3838",
		green: "#C6F6D5",

		// brand: "$waspYellow",
		// brandAccent: "#ffdb46",
		errorBackground: "$red",
		errorText: "#2D3748",
		successBackground: "$green",
		successText: "#2D3748",

		// submitButtonText: "black",

		formErrorText: "$darkRed",
	},
	fontSizes: {
		// sm: "0.875rem",
		sm: "1rem",
	},
};

/*
colors: {
      waspYellow: '#ffcc00',
      gray700: '#a1a5ab',
      gray600: '#d1d5db',
      gray500: 'gainsboro',
      gray400: '#f0f0f0',
      red: '#FED7D7',
      darkRed: '#fa3838',
      green: '#C6F6D5',

      brand: '$waspYellow',
      brandAccent: '#ffdb46',
      errorBackground: '$red',
      errorText: '#2D3748',
      successBackground: '$green',
      successText: '#2D3748',

      submitButtonText: 'black',

      formErrorText: '$darkRed',
    },
	fontSizes: {
		sm: "0.875rem",
	},
*/
