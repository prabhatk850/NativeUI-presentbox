// Metro resolves asset imports to a module id (number); Vite resolves them to a URL (string).
declare module '*.mp4' {
  const source: number | string;
  export default source;
}
