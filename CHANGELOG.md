# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **Undo/Redo**: Integrated `zundo` for state management and created `UndoRedoControls` component.
- **Clear All**: Added functionality and button to clear all flows and events at once.
- **Event Editing**: Added inline editing functionality to draggable events allowing users to directly adjust start and end times and save changes.
- **Event Deletion**: Added a confirmation dialog prompt before deleting an event.

### Changed

- **Responsive Design**: Enhanced `DraggableEvent` display by adding inline-size container type, improving duration title, and adjusting time label visibility, including hiding time range labels on smaller screens.
- **UI Improvements**: Refactored the `DraggableEvent` component, improving input sizes, button styles, and the styling for the duration label.

