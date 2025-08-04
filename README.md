# 📈 Snap-Stock
A sleek and responsive real-time Korean stock monitoring dashboard built with **Next.js**, **NextUI**, and **Firebase**.<br/><br/>
🔗 **Live Demo**: [snap-stock-mocha.vercel.app](https://snap-stock-mocha.vercel.app)
<br/>

---

## 📢 [Overview]
- 📊 Grouping stocks by sector and market
- 🕒 Real-time price updates
- 🔍 Intelligent stock search with code autocomplete
- ⭐ Add and manage your favorite stocks
- 🎨 Light / Dark mode support
- 🔔 Toast alerts for real-time feedback
- 🔒 User-specific data stored in Firebase
<br/><br/>

---

## 🛠️ Stacks
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)
![App Router](https://img.shields.io/badge/App%20Router-enabled-blue?style=flat-square)
![NextUI](https://img.shields.io/badge/NextUI-v2-purple?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)
![Tailwind Variants](https://img.shields.io/badge/Tailwind%20Variants-enabled-38B2AC?style=flat-square)
![Firebase Firestore](https://img.shields.io/badge/Firestore-Firebase-FFCA28?logo=firebase&logoColor=black)
![Firebase Auth](https://img.shields.io/badge/Auth-Firebase-FFCA28?logo=firebase&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-animations-black?logo=framer&logoColor=white)
![Next Themes](https://img.shields.io/badge/Next--Themes-dark/light-informational?style=flat-square)
![React Toastify](https://img.shields.io/badge/React--Toastify-notifications-ff8800?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)
<br/><br/>
---

## 🛠 How to started

### Prerequisites

- Node.js v18 or higher
- Firebase project (for backend features)

### Installation

```bash
git clone https://github.com/ahnshy/snap-stock.git
cd snap-stock
npm install
# or yarn or pnpm
```

### Environment Setup

Create a `.env.local` file with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
next dev
```

Open your browser to [http://localhost:3000](http://localhost:3000)
<br/><br/>

---

## 📁 Folder Tree

```text
snap-stock/
├── app/            # Next.js App Router structure
├── components/     # Reusable UI components
├── config/         # Firebase and other config files
├── data/           # Static stock grouping definitions
├── styles/         # Tailwind and global styles
├── types/          # TypeScript type declarations
├── public/         # Static assets (icons, logos)
└── ...
```

---

## 💻 [Preview]
<img width="897" height="954" alt="image" src="https://github.com/user-attachments/assets/91d36799-53b9-4db8-8deb-4e0a0075518b" />
<img width="900" height="948" alt="image" src="https://github.com/user-attachments/assets/965eda25-14c3-47f6-95c6-7fa12c6a0fbe" />
<img width="910" height="945" alt="image" src="https://github.com/user-attachments/assets/4dda2a02-631a-4772-8994-4af7a1a583b3" />
<img width="942" height="951" alt="image" src="https://github.com/user-attachments/assets/c5f973fb-cdcd-4a53-9b1e-de973f6fe6ff" />
<br/><br/>
---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

<br/><br/>
---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

<br/><br/>
