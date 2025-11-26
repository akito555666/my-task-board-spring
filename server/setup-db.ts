import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUser = process.env.DB_USER || 'taskuser';
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME || 'taskboard';
const pgPassword = process.env.PGPASSWORD;

if (!dbPassword) {
  console.error('❌ DB_PASSWORD is not set in .env file');
  process.exit(1);
}

if (!pgPassword) {
  console.error('❌ PGPASSWORD is not set in .env file');
  process.exit(1);
}

try {
  console.log('📦 Creating tables...');
  execSync(`psql.exe -U postgres -d ${dbName} -a -f server/init.sql`, { 
    stdio: 'inherit',
    env: { ...process.env, PGPASSWORD: pgPassword }
  });
  
  console.log('🔐 Setting up user password...');
  execSync(`psql.exe -U postgres -d ${dbName} -c "ALTER USER ${dbUser} WITH PASSWORD '${dbPassword}';"`, { 
    stdio: 'inherit',
    env: { ...process.env, PGPASSWORD: pgPassword }
  });
  
  console.log('✅ Database setup completed successfully!');
} catch (error) {
  console.error('❌ Database setup failed:', error);
  process.exit(1);
}