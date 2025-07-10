# 🌐 Better UpTime — Decentralized Uptime Monitoring Platform

Better UpTime is a Web3-powered, decentralized uptime monitoring SaaS platform. Unlike traditional services that rely on centralized servers, **Better UpTime** utilizes a distributed network of validators across the globe to check website availability in real-time.

If your site goes down, Better UpTime notifies you **instantly**—ensuring you can act before your users even notice.

---

## 🚀 Key Features

- ✅ **Decentralized Monitoring**  
  Monitoring is performed by independent nodes spread across different locations—ensuring tamper-resistant, censorship-free reliability.

- 🔔 **Real-Time Alerts**  (Not yet implemented)
  Receive immediate alerts via email, SMS, or Web3-compatible notifications when your site experiences downtime.

- 🌍 **Global Redundancy**  
  Validators from multiple geolocations eliminate false positives and ensure more accurate downtime detection.

- 📊 **Transparency & Proof of Checks**  
  Each uptime check is logged on-chain or IPFS for full transparency and auditability.

- 🪙 **Token-Based Incentives** *(not yet implemented)*  
  Nodes earn tokens for performing checks, incentivizing network health and decentralization.

- 🛠️ **Customizable Dashboards**  
  Easily manage and monitor multiple sites from a sleek and responsive dashboard.

---

## 📦 Tech Stack

| Layer         | Tools / Frameworks                       |
|---------------|------------------------------------------|
| Frontend      | Next.js, Tailwind CSS, shadcn/ui         |
| Backend       | Node.js, Express API Routes              |
| Smart Contracts | Solana (Anchor), Web3.js               |
| Database      | PostgreSQL (via Prisma ORM)              |
| Auth          | Clerk                                    |
| Infra         | Bun / Docker                             |

---

## 🧠 How It Works

1. **User registers a website** for uptime monitoring.
2. The **decentralized validator network** is notified to begin periodic health checks.
3. If a validator detects downtime, it **submits proof of failure** to the smart contract.
4. The platform aggregates confirmations from multiple validators.
5. Upon verified downtime, the user is **instantly alerted** through their preferred channels.

---

## 📸 Screenshots

Landing page : 
![Screenshot 2025-07-06 204828](https://github.com/user-attachments/assets/864f32c4-1301-430e-b40b-52a22ea291ed)

![Screenshot 2025-07-06 204849](https://github.com/user-attachments/assets/45954d73-3a08-4333-aed7-79678179b0bd)


User Dashboard : 
![Screenshot 2025-07-06 205020](https://github.com/user-attachments/assets/3f707fee-8c97-4b7d-9499-4a864d32c4c7)

![Screenshot 2025-07-06 205030](https://github.com/user-attachments/assets/db5cc60b-8d28-4715-a1cf-2a24220308e9)

![Screenshot 2025-07-06 205048](https://github.com/user-attachments/assets/0b82b089-0e6f-4845-8d5b-dd5075933e73)

---

## 📈 Roadmap

- [x] Basic site check + alerting
- [x] User authentication & dashboard
- [x] Global node simulation
- [ ] On-chain proof-of-check integration (Solana)
- [ ] Token staking & rewards
- [ ] Mobile app (React Native or Flutter)
- [ ] Public validator onboarding

---

## 🛡️ Why Decentralized Monitoring?

Traditional uptime checkers can suffer from:
- Centralized failure points
- Limited geographic validation
- Black-box alerting systems

Better UpTime solves this by distributing the workload and proof mechanism, making it:
- **Censorship-resistant**
- **Verifiable**
- **Tamper-proof**

---

