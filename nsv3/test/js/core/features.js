// Loads every feature listed in features/index.js.
// Each feature loads on its own, so one broken file never takes down the rest.
import loaders from '../features/index.js';

export async function loadFeatures(ctx) {
  const results = await Promise.allSettled(
    loaders.map(async (load) => {
      const feature = await load();
      await feature.init(ctx);
      return feature.name;
    })
  );
  results.forEach((r) => {
    if (r.status === 'rejected') console.error('[features] failed to load', r.reason);
  });
}
