// Node ESM hooks so tests can import the app's Metro-style modules:
// - resolve: extensionless paths (e.g. '../data/moduleLoader') are retried with '.js';
// - load: '.json' imports (Metro inlines them) are served as ES modules with a default export,
//   so app code does not need `with { type: 'json' }` import attributes.
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if ((specifier.startsWith('.') || specifier.startsWith('/')) && !/\.([cm]?js|json)$/.test(specifier)) {
      return nextResolve(`${specifier}.js`, context);
    }
    throw err;
  }
}

export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && url.endsWith('.json')) {
    const { readFile } = await import('node:fs/promises');
    const source = await readFile(new URL(url), 'utf8');
    return { format: 'module', source: `export default ${source};`, shortCircuit: true };
  }
  return nextLoad(url, context);
}
