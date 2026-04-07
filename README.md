# Backlog Manager

A modern, intuitive backlog management tool for tracking tickets across team
members. Built with React and TypeScript, featuring kanban board and list views.

![Backlog Manager](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 👥 **Team Management** - Add and manage developers and QA members
- 🎯 **Ticket Tracking** - Create, edit, and track tickets with detailed
  information
- 📋 **Kanban Board** - Visualize workflow with drag-and-drop kanban columns
- 📊 **List View** - Alternative list view for quick overview
- 🎨 **Status Tracking** - Multiple status stages (New, Active, Blocked,
  Discussion Required, Resolved, Tested, Waiting for Release, Closed)
- 🏷️ **Type Classification** - Story, Feature, Task, Epic, and Defect types
- ⚡ **Priority Levels** - High, Medium, and Low priority indicators
- 📅 **Sprint Planning** - Assign tickets to sprints with due dates
- 🔗 **ADO Integration** - Link tickets to Azure DevOps boards
- ✅ **Acceptance Criteria** - Define clear acceptance criteria for each ticket

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/ahmadmah/backlog-manager.git
cd backlog-manager
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📦 Build

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🛠️ Tech Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS-in-JS** - Inline styling for component encapsulation

## 📖 Usage

### Adding Team Members

1. Click "+ Add Member" on the dashboard
2. Enter the member's name and select their role (Developer or QA)
3. Click "Add" to create the member

### Creating Tickets

1. Click on a team member card to view their backlog
2. Click "+ New Ticket" to create a new ticket
3. Fill in the ticket details:
   - Title (required)
   - Type (Story, Feature, Task, Epic, Defect)
   - Status
   - Priority
   - Due Date
   - Sprint
   - Description
   - Acceptance Criteria
   - ADO Board Link

### Managing Tickets

- **Kanban View**: Drag and drop tickets between status columns
- **List View**: View all tickets grouped by status
- **Edit**: Click on any ticket to view details and edit
- **Delete**: Remove tickets from the backlog

## 🎨 Color Coding

- **Status Colors**: Each status has a unique color for quick identification
- **Priority Indicators**: High (Red), Medium (Orange), Low (Green)
- **Type Icons**: Visual icons for each ticket type (📖 Story, ✨ Feature, ✅
  Task, 🎯 Epic, 🐛 Defect)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Ahmad Mahrous

## 🙏 Acknowledgments

- Built with modern React patterns
- Inspired by agile project management tools
- Designed for developer productivity
