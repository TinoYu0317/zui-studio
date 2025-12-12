import type { ZVisionComponent, ZVisionNode, ZVisionEdge } from './types';
import { LogIn, GitFork, Clock, StickyNote, Calendar, Box, Package, Upload } from 'lucide-react';

export const components: ZVisionComponent[] = [
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
  {
    type: 'CalendarFrame',
    name: 'Calendar',
    description: 'Displays a monthly calendar.',
    icon: Calendar,
    props: [],
    bindings: [],
    actions: [],
    events: [
      { name: 'onDateSelect', outputs: [{ name: 'selectedDate', type: 'string', defaultValue: '' }], description: 'Fires when a date is selected.' },
    ],
  },
  {
    type: 'GLBFrame',
    name: 'GLB Viewer',
    description: 'Displays a 3D model from a GLB file.',
    icon: Box,
    props: [
      { name: 'scale', type: 'number', defaultValue: 1 },
      { name: 'rotationY', type: 'number', defaultValue: 0 },
    ],
    bindings: [
      { name: 'assetUrl', type: 'assetUrl' },
    ],
    actions: [
      { name: 'playAnimation', inputs: [{ name: 'animationName', type: 'string', defaultValue: '' }] },
    ],
    events: [
      { name: 'onLoad', outputs: [] },
      { name: 'onClick', outputs: [{ name: 'meshName', type: 'string', defaultValue: '' }] },
    ],
  },
];

export const initialNodes: ZVisionNode[] = [
  { id: '1', type: 'InputDoor', position: { x: 50, y: 150 }, data: { label: 'User Query' } },
  { id: '2', type: 'Router', position: { x: 350, y: 150 }, data: { routes: { "note": "toNotes", "time": "toToday" } } },
  { id: '3', type: 'NotesFrame', position: { x: 650, y: 50 }, data: { title: 'AI Generated Note' } },
  { id: '4', type: 'TodayFrame', position: { x: 650, y: 250 }, data: {} },
];

export const initialEdges: ZVisionEdge[] = [
  { id: 'e1-2', source: '1', sourceHandle: 'onSend', target: '2', targetHandle: 'route' },
  { id: 'e1-3', source: '2', sourceHandle: 'toNotes', target: '3', targetHandle: 'content'},
  { id: 'e1-4', source: '2', sourceHandle: 'toToday', target: '4', targetHandle: ''},
];
