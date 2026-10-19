# Retain

A personal expense and budget tracker. Record what you spend, search and filter it, set a monthly budget, and see where your money goes. Admins manage categories and see platform stats.

- Live app: https://retain-app-klv3.onrender.com
- API: https://retain-app-klv3.onrender.com/api (the app and the API share one address)

## How it works

1. You use the React app in your browser.
2. The app sends requests to the API with your login token.
3. The API checks who you are, reads or writes the database, and sends the result back.

4.Login is handled with React Context. Search, filters, sorting and pages are handled with Redux.

5.The API only lets you see your own expenses and budgets.

6.Admin pages and routes are for admins only. Normal sign-ups are always regular users.
Built with React, TypeScript, Vite, Material UI, Redux Toolkit, Node.js, Express and MongoDB.

## Run it locally

You need Node.js 20+ and Docker Desktop.

1. Get the code and install

bash
git clone https://github.com/GLOIRE5/Retain-App.git
cd Retain-App
cd backend && npm install
cd ../frontend && npm install
cd ..


2. Start the database

docker compose up -d


3. Set up the backend settings

Copy `backend/.env.example` to `backend/.env`, then open it and set `JWT_SECRET` to any long random text. You can generate one with:

bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"


The `ADMIN_EMAIL` and `ADMIN_PASSWORD` in that file become your admin login.

4. Create the categories and admin account

`bash
cd backend
npm run seed

5. Start the app (two terminals)

bash
cd backend
npm run dev

bash
cd frontend
npm run dev

Open http://localhost:5173. Sign in with your admin email and password, or create a normal account on the sign-up page.
