/**
 * This portal's configuration: the only file a fork needs to edit.
 * What each field means: src/config.ts. Generated with `npm run setup`;
 * check it against the live API with `npm run check`.
 *
 * Catbalogan City, Samar: a component city with no legislative district of its
 * own. It sits in Samar's 2nd District, whose only DPWH office is the Samar
 * 2nd District Engineering Office. That office also serves the district's
 * other towns, so it is not taken whole. Instead, every line in the four
 * programs (DPWH, farm-to-market roads, health facilities, irrigation) whose
 * title names Catbalogan is in scope, kept to Region VIII.
 *
 * To show the whole Samar 2nd DEO ledger too, add
 * 'Samar 2nd District Engineering Office' to scope.offices.
 */
import { defineConfig } from './src/config';

export default defineConfig({
  id: 'catbalogan',
  kind: 'city',
  name: 'Catbalogan City',
  shortName: 'Catbalogan',
  operator: { name: 'Your organisation' },
  // Set this to the deployed URL for link previews.
  // siteUrl: 'https://catbalogan-transparency-portal.example.workers.dev',
  scope: {
    offices: [],
    places: [{ label: 'Catbalogan', q: 'Catbalogan', region: 'VIII' }],
    districts: ['leg:samar:2nd'],
    exclude: [],
  },
  reporting: { enabled: false },
});
