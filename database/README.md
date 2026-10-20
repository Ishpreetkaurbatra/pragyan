# T→G Database Schema & Seed Data

This directory contains the database bootstrap and seed files for **T→G (Trend to Growth)**:

- `extensions.sql`: Enables `uuid-ossp` and `vector` (pgvector).
- `migrations/001_initial_schema.sql`: Complete PostgreSQL table definitions, foreign keys, and indexes for profiles, businesses, trends, metrics, signals, business_matches, opportunities, action_plans, expert_reviews, experiments, and alerts.
- `seeds/001_demo_seed.sql`: Realistic seed records for FreshBite Café, 7 signature trends (Loaded Fries, Matcha Drinks, Protein Snacks, Affordable Combos, Cold Coffee, Healthy Bowls, Pizza Combos), signals, matches, opportunities, action plans, and active experiments.

## Running with Docker Compose

```bash
docker compose up -d postgres
```
The database will automatically initialize extensions, migrations, and demo seeds.
