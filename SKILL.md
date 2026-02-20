# AI Bill Intelligence (v1.2.0)

Real-time billing dashboard for OpenClaw. Accurate token-based cost tracking across 12+ AI providers.

## 🚀 Installation
```bash
openclaw skill install https://github.com/fumabot16-max/bill-project
```

## 🛠 Usage
The skill operates via a background collector. As an agent, you can help the user by:
1. **Reporting Usage**: Read `/root/.openclaw/workspace/bill_project/dist/usage.json` to summarize spending.
2. **Updating Balances**: Redirect the user to the `/setup` page or update `vault.json` on their behalf.
3. **Checking Health**: Ensure the `ai-bill` service and `collector.js` are running.

## ⚙️ Configuration
- **Port**: Default is `8003`.
- **Modes**: `prepaid`, `postpaid`, `subscribe`, `unused` (off).
- **Files**:
  - `vault.json`: User-set balances.
  - `prices.json`: Model pricing data.
  - `cumulative_usage.json`: Archived historical costs.

Built by Tiger Jung & Chloe.
