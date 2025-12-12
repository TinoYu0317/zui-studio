# **App Name**: ZVision Studio

## Core Features:

- Component Library: Display a list of draggable components (InputDoor, Router, TodayFrame, NotesFrame, CalendarFrame, GLBFrame).
- Graph Canvas: Enable dragging and dropping nodes, connecting them with edges (data/event lines), and modifying mappings by selecting edges.
- Inspector Panel: Show and allow modification of selected Node/Edge properties (Props / Bindings / Actions).
- Preview Simulation: Simulate data flow based on the current graph to show the results, using simple rules for InputDoor (text generation) and Router (category routing).
- Component Contract Definition: Define TypeScript types for consistent component structure (props, bindings, actions, events).
- GLB Import with Manifest: Support uploading *.glb files to Firebase Storage, along with manifest.json files that describe props/actions/events/bindings. These manifest files should be in JSON format and describe the attributes available for mapping on the component. Studio should create a draggable GLBFrame component from the manifest, with the contract defined for connecting it to data flow.
- Data Persistence in Firestore: Store project data in Firestore: projects/{projectId} (project details), graphs/{graphId} (nodes/edges), assets/{assetId} (glb url + manifest), and components/{componentId} (built-in component definitions).
- User Authentication (Minimal): Implement either anonymous or email-based authentication to bind projects to users.

## Style Guidelines:

- Primary color: A subdued yet noticeable gray for a professional feel.
- Background color: , Light gray providing a clean and unobtrusive backdrop.
- Accent color: Dark Gray, drawing attention to key actions.
- Font: 'Inter' (sans-serif) for a clean, modern look, used in both headings and body text.
- Use minimalist icons to represent components in the library and data flow on the graph canvas.
- Maintain a clear and structured layout with the component library on the left, the graph canvas in the center, the inspector on the right, and the preview at the bottom.
- Use subtle animations for transitions and data updates to enhance the user experience without being distracting.