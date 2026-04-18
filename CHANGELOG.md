# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Cross-Flow Drag**: Allowed dragging and dropping events vertically between different flows seamlessly.
- **Undo/Redo**: Integrated `zundo` for state management and created `UndoRedoControls` component.
- **Clear All**: Added functionality and button to clear all flows and events at once.
- **Event Editing**: Added inline editing functionality to draggable events allowing users to directly adjust start and end times and save changes.
- **Event Deletion**: Added a confirmation dialog prompt before deleting an event.
- **Data Export & Import**: Added `DataExportImport` component to Export and Import timeline JSON.
- **Timeline Grid**: Added `TimelineGrid` component for improved timeline visualization.
- **Timeline Settings**: Added `TimelineSettings` component to control zoom and max duration.
- **App Title**: Added `AppTitle` component.
- **Overlap Detection**: Implemented event overlap detection preventing conflicting overlapping elements inside flows.
- **Color Selection**: Added predefined color selection for event customization.
- **Event Handles**: Added resize handles and delete buttons to draggable events.
- **Deployment**: Configured GitHub Pages deployment.
- **License**: Added MIT License for project.

### Changed

- **Color Selection UI**: Replaced native color inputs with robust inline color swatches and expanded predefined palette to 24 colors.
- **Responsive Design**: Enhanced `DraggableEvent` display by adding inline-size container type, improving duration title, and adjusting time label visibility, including hiding time range labels on smaller screens.
- **UI Improvements**: Refactored the `DraggableEvent` component, improving input sizes, button styles, and the styling for the duration label.
- **Layout Adjustments**: Various padding and alignment fixes across TimelineContainer, App, Controls, and AddFlowForm.
- **Add Event Form**: Refactored AddEventForm to use predefined colors, ref input for better UX focus management, and updated numeric inputs.
- **Component Refactors**: Separated AddFlowForm and AddEventForm, and integrated `useTimelineLayout` and `useDraggableEvent` hooks for logic separation.
- **Performance/State**: Eliminated unnecessary `useEffect` calls in flow ID selection and improved event dragging logic.

### Fixed

- **CI Builds**: Fixed CI proxy and type mapping errors (bypassing tsc on CI and using npm install instead of npm ci).
