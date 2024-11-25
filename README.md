# SDS Report Generation System

This is a report generation system capstone project that is built with Next.js React.

## What's next?

If you are not familiar with the different technologies used in this project, please refer to the
respective docs.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Changelog

### Version 1.1.2 🎉

- feat: deploy to production
- style: improve mobile responsiveness
- fix: resolve broken links
- fix: resolve lint & type errors

### Version 0.12.0

- fix: correct 'select announcement' value
- fix: remove lint errors

### Version 0.11.8

- implemented appointment page in organizations.
- fix the toast.

### Version 0.11.7

- style: redesign mobile sidebar
- style: redesign notification popover
- style: replace toast used for 'create organization' & 'create announcement'

### Version 0.11.4

- fix: query invalidations

### Version 0.11.3

- style: revamp the organization navbar & sidebar
- fix: complete the 'create announcement' page
- fix: null in authentication logs

### Version 0.11.0

- feat: add Google OAuth 2.0 option
- chore: update Prisma schema
- style: revamp the navbar & sidebar
- style: revamp the sign in page
- chore: partially move 'create announcement' to page
- chore: move 'create organization' to page
- feat: add 'upload cbl' mutation procedure
- feat: add Organization Members CRUD procedures

### Version 0.10.30

- Calendar modal is now working including the datas and mark as complete.
- CBL is now working in organization
- Save as PDF is now working in logs.

### Version 0.10.29

- Functions of save as PDF is now working but not implemented to real pages.

### Version 0.10.28

- The appointments is now working.
- The dates in calendar is now showing.
- calendar modal is not working.

### Version 0.10.26

- Fixed the UI of create announcement.
- Added a org position in logs.
- Edit info unfinished(90% done).

### Version 0.10.25

- The announcement section in admin dashboard is now a link. It also displays all the current
  announcement.
- New UI for side bar.

### Version 0.10.24

- Fixed half of lint errors.

### Version 0.10.23

- Org's images are now appearing in carousel of admin dashboard.
- Announcements are now working in the dashboard.
- Add a description if there are empty reports both in `/admin/organizations/[id]/index.tsx` and
  `/organization/index.tsx`.
- Logo is now showing both in `/admin/organizations/[id]/index.tsx` and `/organization/index.tsx`.
- Logo of an organization is now showing on Organization's List.

### Version 0.10.22

- fix: announcement query invalidation after mutation
- fix: datetime validation error
- feat: add 'orderByDue' & 'orderByCreatedAt' filters to announcement queries
- feat: create 'getNotificationsCount' utility function
- refactor: optimize 'getOrganizationsCounts' utility function

### Version 0.10.17

- Implement 'read notification' function.
- Move unfinished `/admin/announcements/[id]/edit.tsx` to `/under-construction/edit.txt` folder.
- Fix comment not appearing issue.
- Optimize sign out page.
- Fix `SIGN_OUT` not logging issue.

### Version 0.10.12

- Added a select all option in Create Announcement.
- Added a notification alert when creating a report, announcement and organization.
- Fixed the datas in admin's view org's report.
- Admin can now reject a report.

### Version 0.10.11

- The data now in `Organization Dashboard` is connected to database.
- Create report in `Organization` is now working.
- `Organization's Report` is now real data including .
- `Announcement` page of organization is now displaying the announcements from admin.
- `sign out's` back button is now working.

### Version 0.10.10

- Added a form in admin side bar, but not complete yet.

### Version 0.10.9

- Alter most, if not all, schemas.

### Version 0.10.6

- Changed the notification to redirect instead of modal.
- Added a remove session per member.
- Seperated the nav bar for admin and org.

### Version 0.10.5

- Added a help info in has announcement and has report.
- Removed date, and added category, report visibility and has schedule.

### Version 0.10.4

- Update Prisma schema.
- Refactor most if not all admin procedures except update org.

### Version 0.10.3

- Added a member list in organization profile.
- Added a page for editing an announcement.
- Added an announcement page for organization.
- Added a pdf viewer.

### Version 0.10.2

- Fixed the mobile responsiveness for `signout.tsx`.
- Added an authentication logs.

### Version 0.10.1

- Fix the whitespace wrap error on sign out tooltip in side bar menu.
- Looped the enums for select.
- Added a upload button for create report of organization.
- Fixed lint errors
- Changed the UI of sign in and sign out.
- Removed logs in organization.
- Removed the parameters of navigation bar.

### Version 0.10.0

- Alter db tables.
- Create settings seeder.
- Update UserPosition enum.
- Create auth audit logger.

### Version 0.9.6

- Rename 'logout.tsx' file to 'sign-out.tsx'.

### Version 0.9.5

- Added a delete button in announcement.
- Now the image in navbar will automatically direct to dashboard when clicked but not fully
  functional.

### Version 0.9.4

- Added a function for approve.

### Version 0.9.3

- Fixed a minor responsiveness error in comments of report page.
- Fixed the comment button in `reports/[id]/index.tsx` design if there is no text inside the
  textfield.
- Made the side-bar sticky.
- Added a status in report.
- Added a reject function.

### Version 0.9.2

- Added a function for audience select in `create announcement`.

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
