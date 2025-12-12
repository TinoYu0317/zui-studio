export type PropertyType = 'string' | 'number' | 'boolean' | 'json' | 'assetUrl';

export interface ZVisionNodeProperty {
  name: string;
  type: PropertyType;
  defaultValue: any;
  description?: string;
}

export interface ZVisionNodeBinding {
  name:string;
  type: PropertyType;
  description?: string;
}

export interface ZVisionNodeAction {
  name: string;
  inputs: ZVisionNodeProperty[];
  description?: string;
}

export interface ZVisionNodeEvent {
  name: string;
  outputs: ZVisionNodeProperty[];
  description?: string;
}

export interface ZVisionComponent {
  type: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  props: ZVisionNodeProperty[];
  bindings: ZVisionNodeBinding[];
  actions: ZVisionNodeAction[];
  events: ZVisionNodeEvent[];
}

export interface ZVisionNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data: Record<string, any>;
}

export interface ZVisionEdge {
  id:string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  mapping?: Record<string, any>;
}

export interface CapabilityPatch {
  id: string;
  nodeId: string;
  createdAt: string;
  summary: {
    trigger: string;
    action: string;
  };
  status: 'draft' | 'applied';
  plan: {
      trigger: string;
      action: string;
      data: string;
      sideEffects: string;
      filesTouched: string[];
  }
}
