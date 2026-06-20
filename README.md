# Personalized Todo Desktop App

A lightweight, frameless, and resizable desktop widget for tracking your tasks! Built with **Electron**, **React**, and **TailwindCSS**.

This app is designed to stay pinned to the right side of your desktop, giving you a quick, beautiful, and non-intrusive way to manage your daily tasks without needing to open a full-sized application.

## 🚀 Features

- **Frameless Widget Design**: Blends perfectly into your Windows desktop environment.
- **Draggable & Resizable**: Drag it from the top handle and resize it from the edges to fit your screen perfectly.
- **Always Accessible**: Keeps your tasks just a click away without taking up your taskbar space.
- **Dark Mode UI**: A gorgeous, glassmorphic dark theme tailored for modern setups.
- **Task Management**: Easily add new tasks, mark them as completed, or delete them.

## 🛠️ Built With

- **[Electron](https://www.electronjs.org/)** - Desktop application framework
- **[React](https://reactjs.org/)** - UI library
- **[Vite](https://vitejs.dev/)** - Lightning fast frontend tooling
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first styling

## 💻 Running the App

### Development Mode

If you want to edit the code and test it locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server and Electron app simultaneously:
   ```bash
   npm run dev:electron
   ```

### Building the Executable

To build the standalone `.exe` application for Windows:

```bash
npm run build:desktop
```

Once completed, you will find the standalone application in the `release2/FocusBoard-win32-x64` folder. You can move this folder anywhere on your PC and run `FocusBoard.exe`.

## 📌 Usage

- **Drag:** Click and hold the `::` drag handle at the top center of the widget to move it around your screen.
- **Resize:** Hover over the edges or corners of the widget to resize it to your liking.
- **Close:** Click the `X` icon in the top right corner.

---

*Designed to keep you focused and organized.*
