import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { preorderSettings } from './schemas/preorderSettings';

export default defineConfig({
  name: 'velvet-crumbs',
  title: 'Velvet Crumbs Admin',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: {
    types: [preorderSettings],
  },
});
