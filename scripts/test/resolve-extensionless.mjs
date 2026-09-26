// Node ESM resolve hook: lets tests import the app's Metro-style extensionless paths
// (e.g. '../data/modules/index') by retrying with '.js'.
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if ((specifier.startsWith('.') || specifier.startsWith('/')) && !/\.[cm]?js$/.test(specifier)) {
      return nextResolve(`${specifier}.js`, context);
    }
    throw err;
  }
}
