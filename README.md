#  Library Management System (MERN)

A professional digital solution for schools and colleges to manage book inventory, student records, and lending operations using the **MERN Stack**.

---

##  Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (Role-Based: Admin, Staff, Student)
- **UI Libraries:** SweetAlert2, Swiper.js, Heroicons

---

##  Key Features

###  Admin & Staff
- **Dashboard:** Real-time stats (Total Books, Issued Today, Overdue).
- **Book Management:** Add, Edit, Delete books with **Image Upload**.
- **Inventory Control:** Automatic sync between Total Quantity and Available stock.
- **Reports:** Complete issuance logs with **Automated Overdue Alerts**.
- **User Management:** View and manage library members.

###  Student Portal
- **Catalog:** Browse books with categories and real-time availability.
- **Borrowing:** One-click book issuance system.
- **My Books:** Track borrowed items, due dates, and return status.

---

##  Folder Structure
- `app/dashboard/` : Shared Layout and Admin stats.
- `app/dashboard/student/` : Student specific catalog and history.
- `app/dashboard/books/` : Admin book inventory management.
- `services/` : Axios API integration for Books, Users, and Borrows.
- `context/` : Global Auth state management.

---

## ⚙️ Quick Setup
1. **Backend:** 
   - `cd backend` -> `npm install` -> `npm start`
   - Set `MONGO_URI` and `JWT_SECRET` in `.env`.
   - Ensure `uploads` folder exists for book covers.

2. **Frontend:**
   - `cd frontend` -> `npm install` -> `npm run dev`
   - Set `NEXT_PUBLIC_BACKEND_URL` in `.env`.

---

**Developed by: [Your Name]**
