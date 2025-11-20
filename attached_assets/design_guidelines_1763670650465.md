# Inventory Management System Design Guidelines

## Design Approach
**System-Based Approach**: Leveraging existing Shadcn UI component library with focus on utility and data management efficiency. This is a productivity-focused application prioritizing clarity and workflow optimization.

## Core Design Principles
1. **Data-First Layout**: Information density balanced with scanning efficiency
2. **Action-Oriented**: Quick access to CRUD operations and QR scanning
3. **Role-Aware Interface**: Clear visual distinction between admin and staff capabilities
4. **Scan-Ready**: QR code integration throughout inventory displays

## Typography
- **Headings**: System font stack, medium weight (500-600)
- **Body**: Default (400), Small (sm) for dense tables
- **Data Display**: Monospace for codes/IDs, tabular numbers enabled
- **Hierarchy**: H1 for page titles, H2 for sections, H3 for cards

## Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8
- Card padding: p-6
- Section gaps: gap-8
- Form spacing: space-y-4
- Table cells: p-4

## Component Library

### Navigation
- Top bar with user context (name, role badge)
- Sidebar for main sections: Dashboard, Inventory, Reservations, Activity Log, Users (admin)
- Breadcrumbs for deep navigation

### Data Display
- **Tables**: Striped rows, sticky headers, sortable columns
- **Cards**: Bordered, subtle shadow, item details with thumbnail + QR
- **Stats Widgets**: Count badges, status indicators
- **Search/Filter Bar**: Prominent placement above tables

### Forms
- **Input Fields**: Consistent h-9 height, clear labels above
- **Buttons**: Primary for submit, Ghost for secondary actions
- **Modal Dialogs**: For add/edit operations, keeping context visible
- **File Upload**: QR scanner activation button

### Inventory Specific
- **Item Cards**: Image/QR on left, details on right, action buttons top-right
- **QR Display**: Large, scannable size (200x200px minimum)
- **Status Badges**: Available (green), Reserved (amber), Out (red)
- **Quick Actions**: Edit, Reserve, Generate QR as icon buttons

### Reservations
- **Timeline View**: Chronological display with date separators
- **Approval Workflow**: Clear approve/deny actions for pending items
- **Email Preview**: Read-only notification display

### Activity Log
- **Feed Layout**: Avatar + timestamp + action description
- **Filters**: By user, action type, date range
- **Infinite Scroll**: Lazy loading for performance

## Images
No hero images needed. This is a utility application focused on functional clarity. Use:
- Product/item thumbnails in inventory listings (square, 64x64 or 80x80)
- QR code visualizations (generated dynamically)
- User avatars in activity feed (circular, 32x32)
- Empty state illustrations for "no items" scenarios

## Critical Features
- Responsive tables that stack on mobile
- Inline editing where possible
- Toast notifications for actions
- Loading states for async operations
- Error boundaries with clear messages
- Keyboard shortcuts for power users (navigate with arrow keys, quick search with '/')

## Accessibility
- ARIA labels on all interactive elements
- Focus visible states on all controls
- Color not sole indicator of status
- Screen reader announcements for dynamic updates