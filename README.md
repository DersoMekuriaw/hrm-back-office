# 🏢 HRM Back Office System

A **Human Resource Management (HRM) Back Office System** built using **Next.js 14 App Router**, **TypeScript**, and **React Hook Form** to streamline organizational role assignments, track employee positions, and manage department hierarchies with data-driven accuracy.

This system supports dynamic sector → department → position → employee relationships and automates term-based date logic with validation and scalability in mind.

---

## 📌 Project Purpose

The system is designed for institutions with structured departments and HR workflows. It allows administrators to:

- Assign employees to roles within specific departments and sectors
- Set and auto-calculate term-based positions using a start date
- Ensure clean, validated, and error-free form submissions

It is built for internal back-office use by HR and management teams in mid-to-large organizations.

---

## 🧠 Key Features

- ✅ Dynamic Cascading Selects: Sector → Department → Position → Employee  
- 📅 Auto-calculated `End Date` based on selected `Position`'s term duration  
- ✅ Robust validation using **Zod** and **React Hook Form**  
- 🧼 Clean form state management with `reset` and `watch`  
- 🎨 Beautiful UI with **Mantine** and **Tailwind CSS**  
- 🧩 Modular TypeScript structure with reusable schemas and types  

---

## 🧱 Project Structure
📦 hrm-back-office/
├── app/
│   └── page.tsx                   # Main dashboard or landing page
│
├── components/
│   └── RoleSettingForm.tsx        # Core form for assigning roles to employees
│
├── schemas/
│   └── role-setting.schema.ts     # Zod schema and form validation
│
├── types/
│   └── employee.type.ts           # Type definitions (Department, Employee, etc.)
│
├── styles/
│   └── globals.css                # Global Tailwind styles
│
├── utils/
│   └── date-utils.ts              # (Optional) Helper functions
│
├── public/                        # Static assets like images or logos
│
├── .env.local                     # Environment variables
├── tailwind.config.ts             # Tailwind CSS configuration
├── next.config.js                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Project dependencies and scripts
└── README.md                      # Project documentation


---

## 🔧 Technologies Used

| Tool               | Purpose                                      |
|--------------------|----------------------------------------------|
| [Next.js 14](https://nextjs.org)        | Full-stack React framework (App Router)  |
| [TypeScript](https://www.typescriptlang.org/)  | Strongly typed development               |
| [React Hook Form](https://react-hook-form.com/) | Lightweight and flexible form handling  |
| [Zod](https://zod.dev/)                | Schema validation for forms              |
| [Mantine](https://mantine.dev/)         | UI components and layout tools           |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling                    |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Package manager (npm / yarn / pnpm / bun)

### Installation

```bash
git clone https://github.com/DersoMekuriaw/hrm-back-office.git
cd hrm-back-office
npm install
npm run dev


---

✅ Replace `https://github.com/DersoMekuriaw` with your actual GitHub profile link.  
✅ Add screenshots or GIFs under the **UI Preview** section if available.

You're good to go! Let me know if you'd like a license file, contribution guidelines, or sample issue templates.
