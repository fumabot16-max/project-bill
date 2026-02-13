#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';

const VAULT_PATH = './vault.json';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}

async function setup() {
    console.log('🤖 AI Bill Intelligence - Initial Setup\n');
    console.log('Enter your current API balances (or 0 if not using):\n');

    const balances = {
        openai: parseFloat(await question('OpenAI balance ($): ')) || 0,
        claude: parseFloat(await question('Claude balance ($): ')) || 0,
        kimi: parseFloat(await question('Kimi balance ($): ')) || 0,
        deepseek: parseFloat(await question('DeepSeek balance ($): ')) || 0,
        grok: parseFloat(await question('Grok balance ($): ')) || 0,
        gemini: 0
    };

    fs.writeFileSync(VAULT_PATH, JSON.stringify(balances, null, 2));

    console.log('\n✅ Setup complete!');
    console.log(`📁 Saved to: ${VAULT_PATH}`);
    console.log('\n🚀 Start services with:');
    console.log('   sudo systemctl start ai-bill ai-bill-collector');
    console.log('\n🌐 View dashboard at: http://localhost:8003');

    rl.close();
}

setup().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
