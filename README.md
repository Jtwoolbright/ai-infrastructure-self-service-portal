# AI-Powered Kubernetes Self-Service Portal

> **Portfolio Project** - Production-grade infrastructure automation platform demonstrating cloud-native architecture, AI integration, and enterprise DevOps practices.

A full-stack application that leverages Anthropic's Claude AI to intelligently validate Kubernetes deployment requests and auto-generate production-ready manifests. Built with modern cloud-native technologies and deployed on AWS EKS with complete GitOps automation.

## 🎯 Project Highlights

- **AI Integration**: Claude API integration for intelligent infrastructure validation and YAML generation
- **Cloud-Native Architecture**: Containerized microservices deployed on AWS EKS with Helm
- **Enterprise GitOps**: Multi-repository CI/CD with GitHub Actions, ArgoCD, and automated deployments
- **Production Security**: OIDC authentication, AWS Secrets Manager integration, External Secrets Operator
- **Infrastructure as Code**: Terraform-managed AWS resources with layered architecture
- **Zero-Downtime Deployments**: Rolling updates with health checks and automated rollback capability

## 💡 What This Project Demonstrates

| Skill Area | Implementation |
|-----------|----------------|
| **Cloud Infrastructure** | AWS EKS cluster architecture, VPC networking, ALB Ingress Controller, IAM roles with IRSA |
| **Container Orchestration** | Kubernetes deployments, services, ingress routing, health probes, resource management |
| **CI/CD & GitOps** | GitHub Actions pipelines, ArgoCD declarative sync, automated image builds, GitOps workflow |
| **Security** | OIDC authentication, secret management (AWS Secrets Manager + ESO), principle of least privilege |
| **Backend Development** | FastAPI REST API, async Python, API integration, request validation |
| **Frontend Development** | React SPA, Axios HTTP client, responsive UI, production-optimized Nginx serving |
| **DevOps Tooling** | Helm charts, Docker multi-stage builds, ECR registry management, automated deployments |
| **AI/ML Integration** | Claude API for intelligent validation, prompt engineering, structured output parsing |

## 🎬 Demo

![AI Portal Demo](demo.gif)

*AI-powered infrastructure validation and Kubernetes manifest generation in action*

> **Live Application**: [Link to deployed app] *(if publicly accessible)*  
> **Watch Full Demo**: [Link to YouTube/Loom] *(if you have a longer video)*

## 🏗️ Technical Architecture

### High-Level System Design

```
                              ┌─────────────────────────────────┐
                              │      GitHub Repository          │
                              │    (GitOps Source of Truth)     │
                              └──────────┬──────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
           ┌────────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
           │  GitHub Actions │  │     ArgoCD      │  │   Helm Charts   │
           │   CI Pipeline   │  │  (GitOps Sync)  │  │   (K8s Config)  │
           └────────┬────────┘  └────────┬────────┘  └─────────────────┘
                    │                    │
           ┌────────▼────────┐           │
           │   AWS ECR       │           │
           │ (Container Reg) │           │
           └─────────────────┘           │
                                         │
                              ┌──────────▼──────────────────────┐
                              │      AWS EKS Cluster            │
                              │  ┌──────────────────────────┐   │
                              │  │  ALB Ingress Controller  │   │
                              │  └────────┬─────────────────┘   │
                              │           │                     │
                              │  ┌────────▼─────┐  ┌──────────┐│
                              │  │   Frontend   │  │ Backend  ││
                              │  │   (React)    │  │ (FastAPI)││
                              │  │   Nginx:80   │  │  :8000   ││
                              │  └──────────────┘  └────┬─────┘│
                              │                         │      │
                              │  ┌──────────────────────▼────┐ │
                              │  │  External Secrets Operator│ │
                              │  └──────────┬────────────────┘ │
                              └─────────────┼──────────────────┘
                                            │
                              ┌─────────────▼─────────────┐
                              │  AWS SSM Parameter Store  │
                              │  (Anthropic API Key)      │
                              └───────────────────────────┘
                                            │
                              ┌─────────────▼─────────────┐
                              │   Anthropic Claude API    │
                              │   (AI Validation Engine)  │
                              └───────────────────────────┘
```

### Key Architectural Decisions

**Multi-Repository Strategy**
- **Infrastructure Repo**: EKS cluster, networking, ECR, IAM roles (Terraform)
- **Application Repo**: Source code, Dockerfiles, Helm charts, CI/CD workflows
- Separation enables independent lifecycle management and team ownership

**GitOps Workflow**
- ArgoCD continuously monitors Git for changes
- Declarative desired state in Helm charts
- Automated reconciliation with actual cluster state
- Immutable infrastructure via container image tags (commit SHAs)

**Security-First Design**
- OIDC for GitHub Actions → AWS (no long-lived credentials)
- External Secrets Operator syncs secrets at runtime from AWS
- Pod-level IAM roles via IRSA (IAM Roles for Service Accounts)
- Network policies and least-privilege access controls

**Zero-Downtime Deployments**
- Rolling update strategy with pod disruption budgets
- Service endpoint updates prevent traffic to terminating pods
- Blue/green capability via ArgoCD rollback
- Health check integration with ALB target groups

## 🛠️ Technology Stack

**Frontend Layer**
- React 18 with Vite build tooling
- Tailwind CSS for responsive design
- Axios for async API communication
- Multi-stage Docker build with Nginx (production-optimized)

**Backend Layer**
- FastAPI (async Python framework)
- Anthropic Claude Sonnet 4 API integration
- Pydantic for request/response validation
- Uvicorn ASGI server with auto-reload

**Container Orchestration**
- Kubernetes on AWS EKS (managed control plane)
- Helm 3 for templated deployments
- Custom health probes and resource quotas
- Horizontal scaling capability

**CI/CD Pipeline**
- GitHub Actions for build automation
- OIDC authentication to AWS (IRSA)
- ECR for private container registry
- ArgoCD for GitOps-based deployment

**Infrastructure & Security**
- Terraform for IaC (layered architecture)
- AWS ALB Ingress Controller for L7 routing
- External Secrets Operator for secret injection
- AWS SSM Parameter Store for credential storage

## 🔍 Technical Deep Dive

### Backend API Design

The FastAPI backend exposes three core endpoints:

**Health Check** (`/api/health`)
- Service status verification
- ALB target group health monitoring

**Validate Request** (`/api/validate`)
```python
# Claude AI analyzes infrastructure requests for:
# - Resource allocation optimization
# - Environment-specific best practices
# - Cost efficiency recommendations
# - Security and reliability concerns

# Returns structured JSON with issues, warnings, and suggestions
```

**Generate Config** (`/api/generate-config`)
```python
# Claude AI generates production-ready Kubernetes manifests:
# - Deployment with anti-affinity rules
# - Service (ClusterIP) configuration
# - Resource requests/limits
# - Health probes
# - Proper labeling and namespacing
```

### Frontend Architecture

React SPA with:
- **Component-based architecture** for reusability
- **State management** using React hooks
- **Form validation** with controlled components
- **API error handling** with user-friendly messages
- **Responsive design** (mobile-first approach)
- **Production build** with code splitting and minification

### Kubernetes Deployment Strategy

**Helm Chart Structure**
```
helm/ai-portal/
├── templates/
│   ├── backend-deployment.yaml       # FastAPI pods
│   ├── frontend-deployment.yaml      # React/Nginx pods
│   ├── backend-service.yaml          # Internal service
│   ├── frontend-service.yaml         # Internal service
│   ├── ingress.yaml                  # ALB routing rules
│   ├── external-secret.yaml          # Secret sync config
│   └── _helpers.tpl                  # Template helpers
├── Chart.yaml                        # Chart metadata
└── values.yaml                       # Configurable values
```

**Key Configurations:**
- **Resource Limits**: CPU/memory requests and limits on all pods
- **Replica Sets**: 2 replicas per service for high availability
- **Rolling Updates**: MaxSurge/MaxUnavailable for zero-downtime deployments
- **Path-Based Routing**: `/api/*` → Backend, `/` → Frontend

### CI/CD Pipeline Details

**GitHub Actions Workflow:**
1. **Trigger**: Push to `main` branch
2. **Auth**: OIDC to assume AWS IAM role (no stored credentials)
3. **Build**: Docker multi-stage builds for frontend and backend
4. **Tag**: Immutable tags using Git commit SHA
5. **Push**: Images to ECR with both SHA and `latest` tags
6. **Update**: Modify `values.yaml` with new image tags
7. **Commit**: Automated commit back to repository
8. **Sync**: ArgoCD detects change and rolls out update

**ArgoCD Configuration:**
- **Auto-sync** enabled for continuous deployment
- **Self-heal** to recover from manual changes
- **Prune** resources removed from Git
- **Rollback** capability to previous Git commits

### Security Implementation

**Secret Management Flow:**
```
AWS SSM Parameter Store (source of truth)
         ↓
External Secrets Operator (syncs every 1 hour)
         ↓
Kubernetes Secret (ephemeral, auto-updated)
         ↓
Pod Environment Variable (ANTHROPIC_API_KEY)
```

**IAM Security:**
- GitHub Actions role: ECR push permissions only
- ESO service account role: SSM Parameter Store read-only
- Principle of least privilege throughout

**Network Security:**
- Backend not publicly exposed (internal ClusterIP service)
- All external traffic through ALB with WAF capability
- HTTPS termination at ALB (ready for cert-manager integration)

## 📊 Performance & Scalability

**Current Configuration:**
- 2 replicas per service (frontend/backend)
- Resource requests: 100m CPU, 128Mi memory
- Resource limits: 200m CPU, 256Mi memory
- Supports ~100 concurrent users

**Scaling Capabilities:**
- Horizontal Pod Autoscaling (HPA) ready
- Multi-AZ deployment via EKS node groups
- ALB handles traffic distribution
- Stateless design enables seamless scaling

## 🎯 Production Readiness

This project demonstrates enterprise-grade practices:

✅ **Observability**: Health endpoints, structured logging, ALB monitoring
✅ **Security**: No hardcoded secrets, OIDC auth, least privilege IAM
✅ **Reliability**: Multi-replica deployment, rolling updates, automated rollback
✅ **Automation**: GitOps workflow, CI/CD pipeline, infrastructure as code
✅ **Documentation**: Comprehensive comments, README, architecture diagrams
✅ **Best Practices**: 12-factor app, immutable infrastructure, declarative config

## 📈 Potential Enhancements

This project serves as a foundation for several advanced features:

**Security & Compliance**
- HTTPS/TLS with cert-manager and Let's Encrypt
- OAuth2/OIDC authentication for multi-user access
- RBAC integration for role-based infrastructure requests
- Audit logging for compliance tracking

**Observability & Monitoring**
- Prometheus metrics collection
- Grafana dashboards for real-time monitoring
- Distributed tracing with Jaeger/X-Ray
- CloudWatch integration for centralized logging

**Advanced Features**
- Multi-environment support (dev/staging/prod)
- Approval workflows for production deployments
- Slack/Teams integration for notifications
- Cost estimation before resource provisioning
- Helm chart generation (not just YAML)
- Configuration versioning and rollback UI
- Request rate limiting and quota management

**Platform Extensions**
- Support for additional cloud providers (Azure AKS, GCP GKE)
- Terraform generation alongside Kubernetes manifests
- CI/CD pipeline generation
- Database provisioning integration
- Service mesh configuration

## 💼 About This Project

This portfolio project demonstrates proficiency in:
- **Cloud-Native Development**: Building production-grade applications on Kubernetes
- **DevOps Engineering**: Implementing complete CI/CD pipelines with GitOps principles
- **Infrastructure as Code**: Managing cloud resources declaratively with Terraform
- **Security Best Practices**: Zero-trust architecture, secret management, OIDC authentication
- **AI/ML Integration**: Practical application of LLMs for infrastructure automation
- **Full-Stack Development**: Modern React frontend with async Python backend

Built to showcase real-world engineering skills applicable to platform engineering, DevOps, and cloud infrastructure roles.

---

**Infrastructure Repo**: [To be added...]

## 📧 Contact

[Josh Woolbright]  
[www.linkedin.com/in/josh-woolbright]
[https://medium.com/@woolbright.josh.t]  