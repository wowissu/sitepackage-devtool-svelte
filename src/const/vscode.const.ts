declare global {
  interface Window {
    acquireVsCodeApi: <T = unknown>() => {
			getState: () => T;
			setState: (data: T) => void;
			postMessage: (msg: unknown) => void;
		}
  }
}

export const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : {postMessage: () => {}};