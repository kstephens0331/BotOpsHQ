import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';

export const newTenantCommand = new Command('new')
  .argument('<tenant>', 'Tenant ID')
  .action(async (tenant) => {
    const tenantPath = path.join(process.cwd(), 'hub/tenants', tenant);
    await fs.ensureDir(tenantPath);
    
    // Create default config files
    await fs.writeJson(path.join(tenantPath, 'config.json'), {
      name: tenant,
      industry: '',
      branding: {
        primaryColor: '#3b82f6',
        logoUrl: ''
      }
    });
    
    console.log(`Created new tenant: ${tenant}`);
  });