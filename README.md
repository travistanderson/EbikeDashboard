# 🚀 E-Bike Dashboard App
This is a full-stack app with Tauri, React, Tailwind, FastAPI, and SQLModel, which outputs a desktop application.


---

## **Getting Started**
#### **1️⃣ Clone the Repository**
```sh
git clone git@github.com:travistanderson/EbikeDashboard.git
cd EbikeDashboard
```
#### **2️⃣ Install Frontend Dependencies**
```sh
npm install

# install tailwind (and some other convenience packages)
npm install tailwindcss @tailwindcss/vite @tailwindcss/postcss postcss autoprefixer

# install lucide-react to get icons
npm install lucide-react

# add tauri file system plugin
npm run tauri add fs
```
#### **3️⃣ Install Backend**
```sh
cd pythonApi
pip3 install -r requirements.txt
```

---

## **⚡ Running the Application**

#### 1️⃣ Start the Backend (FastAPI)
```sh
# from the pythonApi directory
python3 main.py
# this will create the database.db sqlite3 db if it doesn't exist
```
- API will be available at: http://127.0.0.1:8000
- Interactive Docs: http://127.0.0.1:8000/docs

#### 2️⃣ Start the Frontend (Tauri)
```sh
# from the top level directory
npm run tauri dev
```


---

## **🚲 Using the Application**
#### 1️⃣ Push the "Go for a ride" button
This will take you to the active ride and simulate a ride and it's data being collected. As the ride progresses, the app sends a request to the API with live telemetry data once a second.

#### 2️⃣ View/Editing Past rides
After the simulated ride finishes (30 seconds), you will be returned to the main screen and see the list of past rides. The ride finishing triggers another API call that creates the stats for that ride. Clicking on a past ride shows it's detail information, including:
- id
- name (this is editable through the pencil icon)
- date
- stats
- a CSV Download button