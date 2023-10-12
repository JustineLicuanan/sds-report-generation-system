# SD Services MIS

This is a MIS project.

## Usage

```sh
# STEP 1: Copy `.env.example` to `.env`
$ cp .env.example .env

# STEP 1.1: Configure the variables in `.env` file

# STEP 2: Install dependencies with pnpm
$ pnpm i

# STEP 3: Migrate the database
$ pnpm db:push

# STEP 4: Congratulations! Now, you can run the dev server
$ pnpm dev
```

## What's next?

If you are not familiar with the different technologies used in this project, please refer to the
respective docs.

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)

### Changelog

### Version 1.1.3

- Added User's User Interface
- View and delete subjects button for User's UI
- Added a function to admin's UI

### Upcoming Changes

- Make sort functional
- Make it more mobile responsive
- Change the web page link for user and admin in some pages e.g logs.
- Add a pdf viewer with features (Full screen, download)

### Version 1.1.2

- Added Logs

### Version 1.1.1

- Added edit info

### Version 1.1.0

- Added Create Org modal
- Added View Org's Request web page

### Version 1.0.3

- Added a table
- Added a search and sort by date and pending
- Search is functional

### Version 1.0.2

- Added sign in with Google
- Updated organization and side bar component

### Version 1.0.1

- Added main content in user's UI
- Added components
- Added notication alert

### Version 1.0.0

- Created Admin's UI
- Created navbar and sidebar of User's UI
