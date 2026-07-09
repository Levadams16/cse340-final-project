CSE 340 Car Dealership

Project Description

A full-stack car dealership web application built for the CSE 340 Web Backend Development course at BYU-Idaho. The site allows customers to browse vehicle inventory by category, submit service requests, and contact the dealership. Employees and owners can manage vehicle listings through a role-protected admin dashboard. The application is built with Node.js, Express, EJS, and PostgreSQL.



Database Schema

Entity Relationship Diagram(ERD.png)



User Roles

Owner
Full control over the system. Can access the admin dashboard, manage all vehicle listings (add, edit, delete), manage user accounts (view, change roles, delete users), and access all dealership content. Cannot change their own role or delete their own account.

Employee
Limited admin access. Can access the admin dashboard and manage vehicle listings (add, edit, delete). Cannot access user management or change any user's role.

Standard User
Basic customer account. Can browse vehicle inventory, view individual vehicle detail pages, submit service requests, and send contact messages. Cannot access the admin dashboard.



Test Account Credentials

| Role     | Email                  |
|----------|------------------------|
| Owner    | admin@admin.test       |
| Employee | employee@worker.email  |
| Customer | some@random.guy        |


Known Limitations

- Service Requests admin page — the Service Requests button on the admin dashboard does not lead to a working page (`/admin/service-requests` is not yet implemented).
- Contact Messages admin page — the Contact Messages button on the admin dashboard does not lead to a working page (`/admin/contact-messages` is not yet implemented).
- Moderate Reviews admin page — the Moderate Reviews button on the admin dashboard does not lead to a working page (`/admin/reviews` is not yet implemented).
- Vehicle images — the vehicle management system supports image URLs via the database schema but the admin add/edit form does not currently include an image upload field.
- Layout file unused — a `layout.ejs` file exists in `src/views/` but is not actively used; each view manually includes the header and footer partials instead.