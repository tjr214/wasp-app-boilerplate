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

## Project Structure

A typical Wasp project has the following structure:

```
my-wasp-app/
├── main.wasp           # Main configuration file
├── schema.prisma       # Database schema
└── src/
    ├── assets/         # Static assets (images, etc.)
    ├── auth/           # Authentication (Login/Signup) related files
    ├── components/     # Reusable React components (UI, etc.)
    ├── lib/            # Utility functions (mostly used by Shadcn/ui components)
    ├── pages/          # React Page components
    ├── styles/         # CSS styles
    └── [db-entity]/    # Actions/Queries for a specific database entity
        └── actions.ts  # Backend actions
        └── queries.ts  # Backend queries
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
  },

  // Optional: dependencies
  dependencies: [
    ("react-icons", "^4.12.0")
  ]
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

### Configuration in main.wasp

```wasp
auth: {
  userEntity: User,
  methods: {
    usernameAndPassword: {},
    google: {
      clientID: env("GOOGLE_CLIENT_ID"),
      clientSecret: env("GOOGLE_CLIENT_SECRET")
    }
  },
  onAuthFailedRedirectTo: "/login"
}
```

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
  fn: import { getPosts } from "@src/queries/posts",
  entities: [Post]
}
```

Implementation (src/queries/posts.ts):

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
  fn: import { createPost } from "@src/actions/posts",
  entities: [Post]
}
```

Implementation (src/actions/posts.ts):

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
  fn: import { createComment } from "@src/actions/comments",
  entities: [Comment, Post]
}

// In React component
const { data: comments, isLoading } = useQuery(getComments, { postId });
// Wasp automatically updates the UI when related entities change
```

### Environment Variables

```wasp
app MyApp {
  title: "My App",
  env: {
    API_URL: "string",
    STRIPE_SECRET: "string"
  }
}
```

Access in code:

```typescript
import { env } from "wasp/client";
console.log(env.API_URL);
```

This guide covers the core concepts and patterns for building Wasp applications. For more detailed information, refer to the [official Wasp documentation](https://wasp-lang.dev/docs).