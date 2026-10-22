import type { MessageView, ToolView } from "@/components/ask-ai/thread";
import type { Mode } from "@/components/ask-ai/store";

export type Chat = {
  ask: (question: string) => void;
  awaiting: boolean;
  busy: boolean;
  stoppedUserMessageIds: string[];
  clear: () => void;
  close: () => void;
  copied: boolean;
  copy: () => void;
  expand: () => void;
  errorMessage: string | null;
  hasMessages: boolean;
  input: string;
  onInput: (value: string) => void;
  onRetry: () => void;
  onStop: () => void;
  lastAnswer: string;
  onMode: () => void;
  mode: Mode;
  onEmailEdit: (tool: ToolView) => void;
  onEmailSkip: (tool: ToolView) => void;
  onCvDownload: (tool: ToolView) => void;
  onCvSkip: (tool: ToolView) => void;
  open: boolean;
  views: MessageView[];
};