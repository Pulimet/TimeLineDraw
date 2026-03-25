export interface Flow {
  id: string;
  title: string;
}

export interface TimelineEvent {
  id: string;
  flowId: string;
  title: string;
  startMs: number;
  endMs: number;
  color: string;
}
