# SD Services SS

This is a scheduling system project.

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

### Version 0.9.1

- Changed the 'SideBarMenu' to 'AdminSideBarMenu' for all admin pages.
- Renamed `side-bar-menu.tsx` to `admin-side-bar-menu.tsx`.
- Added a side bar for organization.
- Updated the audience select.

### Version 0.9.0

- Rename 'UserCategory' enum to 'OrganizationCategory'.
- Add 'visibility' column to Report table.
- Remove unnecessary columns from Comment table.

### Version 0.8.13

- Merged the organization's dashboard and logs and added an action.

### Version 0.8.12

- Added a notification in an organization if there are pending reports. Moved the organization
  profile link in bottom right.
- Added back the badge status indicator.

### Version 0.8.11

- Changed the status indicator to text from icons.
- Added back the "Subject" in `/admin/logs.tsx`.
- Added a with report toggle in create announcement modal.

### Version 0.8.10

- Create an admin report router & its schemas.
- Add category & 'with schedule' columns to report table.
- Create a separate organization table.

### Version 0.8.7

- Removed "Date Created" and "Subject" is changed to "Category" in `/admin/logs.tsx`.
- Modified the Create Organization modal.

### Version 0.8.6

- Changed "Report Management System" to "Scheduling System".
- Made some changes to `side-bar-menu.tsx`.
- Truncated a words in message of an organization and added a modal in `/admin/announcement.tsx`.

### Version 0.8.5

- Move `logout.tsx` file to `/auth`.
- Create 'get logs' procedure.

### Version 0.8.3

- Added an authentication redirect to all pages of `/admin` and `/organization`.

### Version 0.8.2

- I added a list of report of organizations in `admin/organizations/[id]/index.tsx`.
- I changed the edit info page's path from `admin/organizations/[id]/index.tsx` to
  `admin/organizations/[id]/edit.tsx`
- I added a modal for viewing the notifications.

### Version 0.8.1

- Added a `logout.tsx` page.
- Added a `500.tsx` page.

### Version 0.8.0

- Create Log model.
- Add logging in 'create report' procedure.
- Create 'cancel report' procedure with logging & its schema.
- Filter admin 'get org' to only return student leaders.

### Version 0.7.15

- Setup storage provider.
- Create upload button component & its example.

### Version 0.7.13

- I added a mobile and tablet responsive to admin dashboard.

### Version 0.7.12

- I modified the side bar to be mobile and tablet view responsiveness.

### Version 0.7.11

- Added a two dropdown which is view and create on Announcements in `side-bar-menu.tsx` .
- Added an Announcement page in admin.

### Version 0.7.9

- Added a logout button in `side-bar-menu.tsx`.
- Fixed the responsiveness of navigation and side bar.
- Improved the code for side bar buttons in `side-bar-menu.tsx`.

### Version 0.7.6

- Create auth redirects.
- Move `signin.tsx` file to `/auth/sign-in.tsx`.
- Format files.
- Fix some linting errors.

### Version 0.7.2

- Added a create new announcement modal in `side-bar-menu.tsx`.
- Added a `truncate-word.tsx` for truncating words.
- Added a notification function.

### Version 0.7.1

- Added an admin dashboard.
- Added a three colors (green, yellow and gray) in `tailwind.config.ts` themes.

### Version 0.7.0

- Rename 'organization' router with 'shared'.
- Separate 'admin' & 'shared' Zod schemas.

### Version 0.6.5

- Added am alert box when successfully updated the info in `admin\reports\[id]\index.tsx`
- Changed the name of `Edit Info` to `Organization Info`
- Changed the Admin's Home Page to Organizations and moved the `admin\index.tsx` to
  `admin\organizations\index.tsx`.
- Added a two new side bar menus (Organizations, Announcements).

### Version 0.6.4

- Added a cancel button instead of "X" button in Create Organization Modal.
- Added a function to comment in `admin\reports\[id]\index.tsx` and
  `organization\reports\[id]\index.tsx`.
- Added an alert box to `sign.in.tsx`

### Version 0.6.3

- Added a sign-out all devices button in `edit-info.tsx`.

### Version 0.6.2

- Create 'announcement' router.
- Update 'report' Zod schemas.

### Version 0.6.1

- Move `/admin/info/edit.tsx` to `/admin/organizations/[id]/edit.tsx`.
- Integrate `react-hook-form` to 'org edit' page.
- Update 'org' Zod schemas.

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
