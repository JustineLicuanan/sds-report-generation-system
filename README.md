# SD Services MIS

This is an appointment system project.

## Usage

```sh
# STEP 1: Copy `.env.example` to `.env`
$ cp .env.example .env

# STEP 1.1: Configure the variables in `.env` file

# STEP 1.2: Create a MySQL / MariaDB database based on your `.env` file

# STEP 2: Install dependencies with pnpm
$ pnpm i

# STEP 3: Migrate & seed the database
$ pnpm db:push
$ pnpm db:seed

# STEP 4: Congratulations! Now, you can run the dev server
$ pnpm dev
```

## What's next?

If you are not familiar with the different technologies used in this project, please refer to the
respective docs.

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)

## Upcoming Changes

- Make sort functional for other web pages
- Make it more mobile responsive
- Change the web page link for user and admin in some pages e.g logs.
- Add a pdf viewer with features (Full screen, download)

## Changelog

### Version 0.6.0

- Added a pagination in logs.
- Added a `pagination.tsx` and `table.tsx` components.
- Deleted the file `log-data.tsx` and `user-log-data.tsx` components.

### Version 0.5.2

- Made some changes to folder structure

### Version 0.5.1

- Create org report router & its Zod schemas.
- Add `clear all sessions` procedure in admin org router.
- Make some relation columns nullable.

### Version 0.5.0

- Fixed the hydration error in `index.tsx`.
- Removed all favicon to all pages except on `_app.tsx`.
- Changed the title of every pages.
- Changed the `src/pages` folder structure.
- Changed some of the names of function names of pages.
- Changed the terms of request and subjects to report.
- Changed img tag to Image tag

### Version 0.4.0

- Create Announcement, Report & complete Comment table.
- Rename `UserStatus` enum to `CommonStatus`.
- Separate admin & org tRPC routers.

### Version 0.3.1

- Optimize org router & schemas.
- Integrate `react-hook-form` & auth to sign in page.
- Rename `sign-in.tsx` to `signin.tsx`.
- Create `meta.ts` file.

### Version 0.3.0

- Create 'admin procedure'.
- Create org router & its Zod schemas.
- Add `status` column to User table.

### Version 0.2.2

- Changed the button in User UI from delete to hide
- Added a sort by status and date, and search bar in User's Log

### Version 0.2.1

- Disable sign up.
- Add `role` property to user session object.

### Version 0.2.0

- Replace Google auth to email-only auth.
- Replace SQLite db to MySQL.
- Add `role` column to User table.
- Create admin db seeder.
- Install `react-hook-form`.
- Update README.md.

### Version 0.1.7

- Added a function to edit info

### Version 0.1.6

- Changed the Search function to React's syntax instead of Javascript
- Added a sort(Date, Status)
- Created the function of Create modal

### Version 0.1.5

- Admin UI is functional now.
- It can also pass the data (to edit info and/or view organization's request) now when clicking the
  avatar.
- It only displays now the current avatar of their respective category

### Version 0.1.4

- Added a Create New Subject Web Page
- Added a View My Request Web Page

### Version 0.1.3

- Added User's User Interface
- View and delete subjects button for User's UI
- Added a function to admin's UI

### Version 0.1.2

- Added Logs

### Version 0.1.1

- Added edit info

### Version 0.1.0

- Added Create Org modal
- Added View Org's Request web page

### Version 0.0.4

- Added a table
- Added a search and sort by date and pending
- Search is functional

### Version 0.0.3

- Added sign in with Google
- Updated organization and side bar component

### Version 0.0.2

- Added main content in user's UI
- Added components
- Added notication alert

### Version 0.0.1

- Created Admin's UI
- Created navbar and sidebar of User's UI
