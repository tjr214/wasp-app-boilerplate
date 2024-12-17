# Wasp Application Development Guide

## Table of Contents

1. [Project Structure](#project-structure)
2. [Main Configuration](#main-configuration)
3. [Database Schema](#database-schema)
4. [Authentication](#authentication)
5. [Routes and Pages](#routes-and-pages)
6. [Operations](#operations)
7. [Frontend Components](#frontend-components)
8. [Common Patterns](#common-patterns)
9. [Shadcn/UI Components](#shadcn-ui-components)

## Project Structure

A typical Wasp project has the following structure:

```
my-wasp-app/
├── main.wasp           		# Main Wasp configuration file
├── schema.prisma       		# Database and Entity schema
└── src/
    ├── assets/         		# Static assets (images, etc.)
    ├── auth/           		# Authentication (Login/Signup) related files
    ├── components/     		# Reusable React components (UI, etc.)
    ├── lib/            		# Utility functions (mostly used by Shadcn/ui components)
    ├── pages/          		# React Page components
    ├── styles/         		# CSS styles
    └── entities/       		# Wasp and Database Entities
        └── [wasp-entity]/ 	# Actions/Queries for a specific Wasp or dB Entity
           └── actions.ts	 	# Backend Actions for `wasp-entity`
           └── queries.ts	 	# Backend Queries for `wasp-entity`
```

## Main Configuration

The `main.wasp` file is where you define your app's configuration:

```wasp
app MyApp {
  wasp: {
    version: "^0.15.0"
  },
  title: "My Wasp App",

  // Authentication configuration
  auth: {
    userEntity: User,
    methods: {
      usernameAndPassword: {},
      google: {},
      gitHub: {},
      email: {}
    },
    onAuthFailedRedirectTo: "/login"
  }
}
```

## Database Schema

Define your data models in `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id       Int      @id @default(autoincrement())
  username String   @unique
  password String
  posts    Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
}
```

## Authentication

### Login Page Component

```typescript
import { LoginForm } from "wasp/client/auth";
import { Link } from "wasp/client/router";

export function LoginPage() {
	return (
		<main>
			<LoginForm />
			<Link to="/signup">Sign up</Link>
		</main>
	);
}
```

## Routes and Pages

### Defining Routes in main.wasp

```wasp
route RootRoute { path: "/", to: MainPage }
page MainPage {
  authRequired: true,
  component: import { MainPage } from "@src/pages/MainPage"
}

route PostRoute { path: "/post/:id", to: PostPage }
page PostPage {
  component: import { PostPage } from "@src/pages/PostPage"
}
```

### Page Component Example

```typescript
import { useParams } from "wasp/client/router";
import { useQuery } from "wasp/client/operations";

export function PostPage() {
	const { id } = useParams();
	const { data: post, isLoading } = useQuery(getPost, { id: parseInt(id) });

	if (isLoading) return <div>Loading...</div>;

	return (
		<div>
			<h1>{post.title}</h1>
			<p>{post.content}</p>
		</div>
	);
}
```

## Operations

### Queries

In main.wasp:

```wasp
query getPosts {
  fn: import { getPosts } from "@src/posts/queries",
  entities: [Post]
}
```

Implementation (src/posts/queries.ts):

```typescript
import { GetPosts } from "wasp/server/operations";

export const getPosts: GetPosts<void, Post[]> = async (args, context) => {
	if (!context.user) throw new HttpError(401);

	return context.entities.Post.findMany({
		where: { authorId: context.user.id },
		orderBy: { createdAt: "desc" },
	});
};
```

### Actions

In main.wasp:

```wasp
action createPost {
  fn: import { createPost } from "@src/posts/actions",
  entities: [Post]
}
```

Implementation (src/posts/actions.ts):

```typescript
import { CreatePost } from "wasp/server/operations";

type CreatePostInput = {
	title: string;
	content: string;
};

export const createPost: CreatePost<CreatePostInput, Post> = async ({ title, content }, context) => {
	if (!context.user) throw new HttpError(401);

	return context.entities.Post.create({
		data: {
			title,
			content,
			author: { connect: { id: context.user.id } },
		},
	});
};
```

## Frontend Components

### Using Queries

```typescript
import { useQuery } from "wasp/client/operations";

function PostsList() {
	const { data: posts, isLoading, error } = useQuery(getPosts);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			{posts.map((post) => (
				<div key={post.id}>
					<h2>{post.title}</h2>
					<p>{post.content}</p>
				</div>
			))}
		</div>
	);
}
```

### Using Actions

```typescript
import { createPost } from "wasp/client/operations";

function CreatePostForm() {
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		try {
			await createPost({
				title: formData.get("title") as string,
				content: formData.get("content") as string,
			});
		} catch (error) {
			console.error("Failed to create post:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input name="title" placeholder="Title" />
			<textarea name="content" placeholder="Content" />
			<button type="submit">Create Post</button>
		</form>
	);
}
```

## Common Patterns

### Protected Routes

```wasp
page DashboardPage {
  authRequired: true,
  component: import { Dashboard } from "@src/pages/Dashboard"
}
```

### Error Handling

```typescript
try {
	await createPost({ title, content });
} catch (error) {
	if (error.code === "UNAUTHORIZED") {
		// Handle unauthorized error
	} else {
		// Handle other errors
	}
}
```

### Data Fetching with Relations

```typescript
const getPosts = async (_args, context) => {
	return context.entities.Post.findMany({
		include: {
			author: true,
			comments: true,
		},
	});
};
```

### Real-time Updates

```typescript
// In main.wasp
action createComment {
  fn: import { createComment } from "@src/comments/actions",
  entities: [Comment, Post]
}

// In React component
const { data: comments, isLoading } = useQuery(getComments, { postId });
// Wasp automatically updates the UI when related entities change
```

## Shadcn/UI Components

Wasp integrates seamlessly with Shadcn/UI, a collection of beautifully designed, accessible React components. Here's how to use them:

### Installing Components

To add Shadcn/UI components to your project, use the following command pattern:

```bash
npx shadcn@latest add <component-name>
```

For example, to add a button component:

```bash
npx shadcn@latest add button
```

This will:

1. Create the component in your `src/components/ui` directory
2. Add necessary dependencies and utilities
3. Set up the component with proper styling and accessibility features

### Using Components

Once installed, you can import and use Shadcn/UI components like any other React component:

```typescript
// Note: we are using `../components/` instead of `@/components/` to make Shadcn compatible with Wasp
import { Button } from "../components/ui/button";

export function MyComponent() {
	return (
		<div>
			<Button variant="default">Click me</Button>
			<Button variant="destructive">Delete</Button>
			<Button variant="outline">Cancel</Button>
		</div>
	);
}
```

### Available Variants

Most Shadcn/UI components come with multiple variants. For example, the Button component includes:

- `default` - Primary action
- `destructive` - Dangerous or destructive actions
- `outline` - Secondary actions
- `secondary` - Alternative styling
- `ghost` - Minimal styling
- `link` - Appears as a link

### Customizing Components

You can customize components by modifying their source files in `src/components/ui`. The styling is based on Tailwind CSS classes and can be adjusted to match your design system.

Example of customizing button variants:

```typescript
const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
				destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				// Add your custom variants here
				custom: "bg-purple-500 text-white hover:bg-purple-600",
			},
			// Add more variant types as needed
		},
		defaultVariants: {
			variant: "default",
		},
	}
);
```

### Common Components

Here are some frequently used Shadcn/UI components you might want to add:

```bash
# Basic UI elements
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card

# Form elements
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add checkbox

# Feedback & Overlay
npx shadcn@latest add toast
npx shadcn@latest add dialog
npx shadcn@latest add alert
```

For more detailed information about available components and their usage, refer to the [Shadcn/UI Components documentation](https://ui.shadcn.com/components).

---

This guide covers the core concepts and patterns for building Wasp applications. For more detailed information, refer to the [official Wasp documentation](https://wasp-lang.dev/docs).
