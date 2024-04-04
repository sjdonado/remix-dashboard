# Remix Dashboard

> MVP of a Learning Management System built with remix + vite, drizzle + better-sqlite3, and tailwindcss + daisyui.

| Admin                                                                                                                                                             | Teacher                                                                                                                                                           | Student                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img width="1840" alt="Screenshot 2024-04-01 at 22 21 55" src="https://github.com/sjdonado/remix-dashboard/assets/27580836/099a8a3e-8ec7-43e3-8789-737f61796aba"> | <img width="1840" alt="Screenshot 2024-04-01 at 22 23 20" src="https://github.com/sjdonado/remix-dashboard/assets/27580836/6c44363f-eaa5-4f49-87f8-c80924153967"> | <img width="1840" alt="Screenshot 2024-04-01 at 22 24 04" src="https://github.com/sjdonado/remix-dashboard/assets/27580836/b5513b02-fe8d-4594-8736-0c39d6f24793"> |

### Requirements

- Assignments have status (`OPEN`, `CLOSED`) and type (`HOMEWORK`, `QUIZ`, `PROJECT`)
- Users have roles (`ADMIN`, `TEACHER`, `STUDENT`)
- User login with multiple roles
- Admin role should CRUD users and assignments
- Teacher role should CRUD only their own assignments
- Student role should list all assignments
- Admin, Teacher, Student should be able to view and edit their profiles

### Non-functional requirements

- primary keys with randomUUID + on delete cascade
- Session storage (cookies)
- Authentication + Authorization (RBAC) middleware
- Schema validations with Zod
- Responsive tables with filters + search box + pagination
- Responsive sidebar
- Confirmation dialogs
- Logging with Pino
- e2e testing with Playwright
- Toast with sooner
- Optimistic UI (update assignment status)
- Dark mode

## Roadmap

v1.1

- [ ] Courses: Teachers and Admins can perform CRUD operations on courses and create assignments for each course.
- [ ] Courses: Teachers and Admins can assign users to courses.
- [ ] Courses: Students can only see assignments in their assigned courses.
- [ ] Courses: Students can belong to multiple courses.

v1.2

- [ ] Assignment Submissions: Students can submit assignments.
- [ ] Assignment Submissions: Students can filter assignments (submitted, open).
- [ ] Assignment Submissions: Students can view the history of their submissions (by assignment).
- [ ] Assignment Submissions: Teachers can grade submissions.
- [ ] Assignment Submissions: Students can see their submission grades.

v1.3

- [ ] Statistics page: Display the total number of users, courses, assignments, and assignment submissions.

## Self hosted

Deploy with dokku

```bash
dokku apps:create remix-dashboard
dokku domains:set remix-dashboard remix-dashboard.preview.donado.co
dokku letsencrypt:enable remix-dashboard

dokku storage:ensure-directory remix-dashboard-sqlite
dokku storage:mount remix-dashboard /var/lib/dokku/data/storage/remix-dashboard-sqlite:/usr/src/app/sqlite/

dokku config:set remix-dashboard DATABASE_URL=./sqlite/db.sqlite SECRET_KEY={YOUR_SECRET}

dokku ports:add remix-dashboard http:80:3333
dokku ports:add remix-dashboard https:443:3333

dokku run remix-dashboard bun run db:push
dokku run remix-dashboard bun run db:seed all
```
