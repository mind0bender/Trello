# 🚀 Trello Clone (Server)

This is the backend for the Scaler SDE Intern Full-Stack Assignment. It is a high-performance, relational API designed to replicate Trello’s core functionality, including board management, card reordering, and metadata handling.

## 🛠️ Technical Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma

## 🏗️ Database Design & Schema

The schema is designed with a focus on relational integrity and efficient querying.

- **Boards:** Stores board titles and background metadata.
- **Lists:** Maintains a one-to-many relationship with Boards and includes a position field for reordering.
- **Cards:** The primary data unit containing titles, descriptions, and foreign keys for Lists.
- **Card Metadata:** Dedicated tables for Checklists, Labels, and Members to ensure normalized data.

> Sample Data: The database is pre-seeded with a sample board, lists, and members for immediate testing.

## 🚦 Getting Started

### Environment Configuration

Create a .env file in the /server directory:

```env
PORT=8080
DATABASE_URL="postgresql://user:password@localhost:5432/trello_db"
```

### Setup & Installation

```bash
git clone https://github.com/mind0bender/trello.git
cd server
```

### Install dependencies

```bash
bun i # or npm i / yarn
```

### Run database migrations

```bash
npx prisma migrate dev
```

### Run Development Server

```bash
bun dev # or npm run dev
```

> The API will be available at <http://localhost:8080>

## ✨ Implementation Highlights

- **Drag & Drop Logic:** Optimized endpoints to handle reordering for both Lists and Cards, ensuring UI consistency.
- **Search & Filter:** Server-side filtering logic for cards based on labels, members, and due dates.
- **Modularity:** Clean separation of concerns between Routes, Controllers, and Database Services.
- **No Login Requirement:** Implements a "default user" architecture with pre-existing database members for card assignment.

## 📂 Project Structure

```
server/
├── src/
│ ├── controllers/ # Request handling logic
│ ├── routes/ # API endpoint definitions
│ ├── services/ # Database interactions
│ └── models/ # Database schema/types
└── .env
```
