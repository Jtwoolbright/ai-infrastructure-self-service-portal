from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from anthropic import Anthropic
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow frontend to call backend (we'll build frontend next)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (or specify your ALB DNS)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Define request structure
class InfraRequest(BaseModel):
    service_name: str
    environment: str
    instance_type: str = "t3.medium"
    replicas: int = 2
    cpu_limit: str = "500m"
    memory_limit: str = "512Mi"

# Health check endpoint for Kubernetes probes
@app.get("/api/health")
async def health():
    return {"status": "healthy"}

@app.get("/api")
async def root():
    return {"message": "Kubernetes AI Platform Portal API", "status": "running"}

@app.post("/api/validate")
async def validate_request(request: InfraRequest):
    """
    Validates infrastructure request using Claude AI
    """
    prompt = f"""You are a platform engineering expert. Analyze this Kubernetes deployment request:

        Service Name: {request.service_name}
        Environment: {request.environment}
        Instance Type: {request.instance_type}
        Replicas: {request.replicas}
        CPU Limit: {request.cpu_limit}
        Memory Limit: {request.memory_limit}

        Validate ONLY the information provided above. Focus on:
        1. Are the CPU and memory limits appropriate for the number of replicas and environment?
        2. Is the replica count reasonable for this environment (dev=1-2, staging=2-3, prod=3+)?
        3. Are there any obvious resource mismatches (too high or too low)?
        4. Basic cost optimization opportunities

        DO NOT flag missing fields like health checks, requests, node selectors, or security policies - those will be auto-generated later.


        Return your response in this exact JSON format:
        {{
        "valid": true or false,
        "issues": ["list of critical problems that must be fixed"],
        "suggestions": ["list of recommendations for improvement"],
        "warnings": ["list of things to be aware of"]
        }}

        Only respond with the JSON, no other text."""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return {"validation": response.content[0].text}

@app.post("/api/generate-config")
async def generate_config(request: InfraRequest):
    """
    Generates Kubernetes manifests using Claude AI
    """
    prompt = f"""You are a Kubernetes expert. Generate production-ready Kubernetes manifests for this deployment:

        Service Name: {request.service_name}
        Environment: {request.environment}
        Replicas: {request.replicas}
        CPU Limit: {request.cpu_limit}
        Memory Limit: {request.memory_limit}

        Generate TWO manifests:
        1. A Deployment manifest
        2. A Service manifest (ClusterIP type, expose port 8080)

        Requirements:
        - Set CPU requests to 50% of limits
        - Set memory requests to 75% of limits
        - Add readiness probe: HTTP GET on /health port 8080
        - Add liveness probe: HTTP GET on /health port 8080
        - Add proper labels: app={request.service_name}, env={request.environment}
        - Use namespace: {request.environment}
        - For production environment, add pod anti-affinity

        Return ONLY valid YAML. No explanations, no markdown code blocks, just the raw YAML manifests separated by ---"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}]
    )
    
    yaml_content = response.content[0].text
    # Clean up any markdown artifacts
    yaml_content = yaml_content.replace('```yaml', '').replace('```', '').strip()
    
    return {"yaml": yaml_content}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)