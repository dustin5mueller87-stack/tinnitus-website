/*
 * Indonesian texts are maintained directly in the reviewed HTML files.
 * The former runtime text replacements are retired to avoid overriding
 * current author decisions or creating a second translation source.
 */
function applyPathFixes(_pathname: string, html: string) {
  return html;
}

export default (_request: Request, context: any) => context.next();

export const config = { path: '/id/*' };
export { applyPathFixes };
