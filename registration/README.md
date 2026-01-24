
# Microblog App

This is a [Next.js](https://nextjs.org) project for the Application Security course.

You can run it locally on your machine using Node.js.

---

## Requirements

* Node.js 20+
* npm (comes with Node.js)

---

## Getting Started

1. **Download or clone the repo**

2. **Environment Variables Setup:**
   Before running the application, you must create your own .env file in the registration folder.
   Steps:
   1. Inside the `registration` folder, create a file named `.env`
   2. Add the following variables **with your own values**:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password

ADMIN_EMAIL=admin_email@example.com
ADMIN_PASSWORD=admin_password
ADMIN_NAME=Admin
```
   Explanation:
   
         1. EMAIL_USER, EMAIL_PASS → Required for the email functionality (e.g. password reset). EMAIL_PASS must be a Google App Password, not your normal Gmail password. If you want to use my mock data, contact me.
         2. ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME → Optional. These variables are only required if you want to automatically create an admin user in the database via dbmanage.js. If you do not need an admin account, these variables can be omitted.

      ⚠️ Do not commit the .env file to the repository. It should be listed in .gitignore.


3. **Install dependencies**

   From the `registration` folder:

   ```bash
   npm install
   ```


4. **Run the development server**

   From the `registration` folder:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).



## Build for Production (Optional)

If you want to simulate production:

```bash
npm run build
npm start
```

> Note: Building in Docker currently fails due to a known issue with the `/resetPassword` page. You can still run the app locally using `npm run dev`.

---

## Learn More

* [Next.js Documentation](https://nextjs.org/docs)
* [Learn Next.js](https://nextjs.org/learn)

