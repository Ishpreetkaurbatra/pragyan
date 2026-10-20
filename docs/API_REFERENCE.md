# T→G API Reference

Base URL: `/api`

### Auth
- `GET /api/auth/me`: Get current authenticated user profile & business
- `POST /api/auth/switch-role`: Switch persona (`BUSINESS`, `EXPERT`, `ADMIN`) in demo mode

### Business
- `GET /api/business/profile`: Get business profile
- `POST /api/business/profile`: Save or update business profile

### Trends
- `GET /api/trends`: Explore trends with `?category=...&search=...&status=...`
- `GET /api/trends/:id`: Get trend details by id or slug
- `GET /api/trends/:id/signals`: Get source signals
- `GET /api/trends/:id/metrics`: Get trend trajectory metrics
- `GET /api/trends/:id/audience`: Get audience demographics
- `GET /api/trends/:id/geography`: Get geographic concentration
- `GET /api/trends/sources`: Get registered data sources
- `POST /api/trends/:id/save`: Save trend to user list
- `DELETE /api/trends/:id/save`: Remove trend from saved list

### Intelligence
- `POST /api/intelligence/analyze`: Analyze trend viability
- `POST /api/intelligence/match`: Calculate business fit scores
- `POST /api/intelligence/opportunity`: Generate commercial concept
- `POST /api/intelligence/action-plan`: Generate launch playbook
- `POST /api/intelligence/experiment`: Analyze experiment results
- `GET /api/intelligence/mode`: Get active intelligence provider (`mock`, `local`, `tgo`)
- `POST /api/intelligence/mode`: Switch provider

### Ask T→G
- `POST /api/ask-tg`: Contextual AI business intelligence question answering

### Opportunities & Action Plans
- `GET /api/opportunities`: List opportunities
- `POST /api/opportunities/generate`: Generate opportunity from trend
- `GET /api/action-plans`: List action plans
- `POST /api/action-plans/generate`: Generate structured execution playbook
- `POST /api/action-plans/:id/submit`: Submit plan for human expert validation

### Expert Validation
- `GET /api/expert/reviews`: Review queue
- `POST /api/expert/reviews/:id/approve`: Approve plan
- `POST /api/expert/reviews/:id/request-changes`: Request changes with notes
- `POST /api/expert/reviews/:id/reject`: Reject plan

### Experiments
- `GET /api/experiments`: List active & completed pilots
- `POST /api/experiments`: Create experiment
- `POST /api/experiments/:id/metrics`: Log daily metric
- `POST /api/experiments/:id/complete`: Finalize experiment decision (Scale/Stop)
- `POST /api/experiments/:id/analyze`: AI evaluation of lift vs baseline

### Dashboard & Alerts
- `GET /api/dashboard`: Full dashboard payload
- `GET /api/alerts`: List alerts (`?unread=true`)
- `POST /api/alerts/:id/read`: Mark alert read

### Admin
- `GET /api/admin/overview`: Full mission control platform telemetry
