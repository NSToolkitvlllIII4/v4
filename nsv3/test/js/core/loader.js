// Loads modules one by one. Each exports: name, register(Alpine).
// A broken module logs an error and is skipped; the rest still load.
export async function loadModules(Alpine, loaders) {
  const results = await Promise.allSettled(
    loaders.map(async (load) => {
      const mod = await load();
      await mod.register(Alpine);
      return mod.name;
    })
  );
  results.forEach((r) => {
    if (r.status === 'rejected') console.error('[loader] module failed', r.reason);
  });
}
