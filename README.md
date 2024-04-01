# Remix Dashboard
> MVP of a Learning Management System built with remix + vite, drizzle + better-sqlite3, and tailwindcss + daisyui.

| Admin | Teacher | Student |
|------------|--------------|--------------|
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

## Comming soon (v2.0)
- [ ] Assignments like button
- [ ] Assignments comments thread: create/read by any role, udpate/delete by their owner
- [ ] Statistics page: display total number of user and assignments, and comments

## Self hosted
Deploy with dokku
```bash
dokku apps:create remix-dashboard
dokku domains:set remix-dashboard remix-dashboard.preview.donado.co
dokku letsencrypt:enable remix-dashboard

dokku config:set remix-dashboard DATABASE_URL=./sqlite/db.sqlite SECRET_KEY={YOUR_SECRET}

dokku ports:add remix-dashboard http:80:3000
dokku ports:add remix-dashboard https:443:3000

dokku storage:ensure-directory remix-dashboard-sqlite
dokku storage:mount remix-dashboard /var/lib/dokku/data/storage/remix-dashboard-sqlite:/usr/src/app/sqlite/

dokku run remix-dashboard db:push
dokku run remix-dashboard db:seed all
```
