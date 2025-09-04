import { readFileSync } from 'fs';
import { join } from 'path';
import { getDatabase } from './connection';
import dotenv from 'dotenv';

dotenv.config();

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    const db = await getDatabase();
    const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
    
    await db.query(schemaSQL);
    
    console.log('✅ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations();
}