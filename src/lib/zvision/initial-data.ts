import type { ZVisionComponent, ZVisionNode, ZVisionEdge } from './types';
import { LogIn, GitFork, Clock, StickyNote, Calendar, Box, Square, Type, Image as ImageIcon, RectangleHorizontal } from 'lucide-react';

export const components: ZVisionComponent[] = [
  // SHAPES
  {
    type: 'ShapeRectangle',
    name: 'Rectangle',
    description: 'A basic rectangle shape.',
    icon: Square,
    defaultSize: { width: 150, height: 100 },
    props: [
        { name: 'fill', type: 'string', defaultValue: '#cccccc' },
        { name: 'radius', type: 'number', defaultValue: 8 },
        { name: 'opacity', type: 'number', defaultValue: 1 },
        { name: 'glass', type: 'boolean', defaultValue: false },
    ],
    bindings: [], actions: [], events: [],
  },
  {
    type: 'ShapeText',
    name: 'Text',
    description: 'A text element.',
    icon: Type,
    defaultSize: { width: 120, height: 40 },
    props: [
        { name: 'text', type: 'string', defaultValue: 'Hello, World' },
        { name: 'fontSize', type: 'number', defaultValue: 16 },
        { name: 'fontWeight', type: 'string', defaultValue: 'normal' },
        { name: 'color', type: 'string', defaultValue: '#000000' },
    ],
    bindings: [], actions: [], events: [],
  },
  // COMPONENTS
  {
    type: 'InputDoor',
    name: 'Input Door',
    description: 'Generates a simple text input.',
    icon: LogIn,
    props: [
      { name: 'label', type: 'string', defaultValue: 'Input', description: 'The label for the input field.' },
    ],
    bindings: [],
    actions: [],
    events: [
      { name: 'onSend', outputs: [{ name: 'text', type: 'string', defaultValue: '' }], description: 'Fires when text is submitted.' },
    ],
  },
  {
    type: 'Router',
    name: 'Router',
    description: 'Routes data based on a category.',
    icon: GitFork,
    props: [
      { name: 'routes', type: 'json', defaultValue: { "default": "out" }, description: 'A JSON object mapping categories to output event names.' },
    ],
    bindings: [],
    actions: [
      { name: 'route', inputs: [{ name: 'data', type: 'json', defaultValue: { "category": "default", "payload": "" } }], description: 'Receives data to be routed.' },
    ],
    events: [
        { name: 'out', outputs: [{ name: 'payload', type: 'json', defaultValue: '' }], description: 'Default output.' },
    ],
  },
  {
    type: 'TodayFrame',
    name: 'Today Frame',
    description: 'Displays the current date and time.',
    icon: Clock,
    props: [],
    bindings: [],
    actions: [],
    events: [
      { name: 'onLoad', outputs: [{ name: 'date', type: 'string', defaultValue: '' }], description: 'Fires on component load with the current date.' },
    ],
  },
  {
    type: 'NotesFrame',
    name: 'Notes Frame',
    description: 'A simple text area for notes.',
    icon: StickyNote,
    props: [
      { name: 'title', type: 'string', defaultValue: 'My Notes' },
    ],
    bindings: [
      { name: 'content', type: 'string', description: 'Binds to the text content of the note.' },
    ],
    actions: [],
    events: [
      { name: 'onSave', outputs: [{ name: 'content', type: 'string', defaultValue: '' }], description: 'Fires when the note content is saved.' },
    ],
  },
];

export const initialNodes: ZVisionNode[] = [
  { id: '1', type: 'InputDoor', position: { x: 50, y: 150 }, size: { width: 300, height: 60 }, data: { label: 'User Query' } },
  { id: '2', type: 'Router', position: { x: 350, y: 150 }, size: { width: 200, height: 160 }, data: { routes: { "note": "toNotes", "time": "toToday" } } },
  { id: '3', type: 'NotesFrame', position: { x: 50, y: 220 }, size: { width: 300, height: 200 }, data: { title: 'AI Generated Note' } },
  { id: '4', type: 'TodayFrame', position: { x: 650, y: 250 }, size: { width: 200, height: 100 }, data: {} },
];

export const initialEdges: ZVisionEdge[] = [
  { id: 'e1-2', source: '1', sourceHandle: 'onSend', target: '2', targetHandle: 'route', mapping: {} },
  { id: 'e2-3', source: '2', sourceHandle: 'toNotes', target: '3', targetHandle: 'content', mapping: {}},
  { id: 'e2-4', source: '2', sourceHandle: 'toToday', target: '4', targetHandle: '', mapping: {}},
];
