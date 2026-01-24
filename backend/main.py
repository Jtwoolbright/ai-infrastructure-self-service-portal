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
    allow_origins=["http://localhost:3000"],
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

@app.get("/")
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

Provide validation feedback. Check for:
1. Oversized resources for typical workloads
2. Under-resourced configurations that might cause issues
3. Best practices violations
4. Security concerns
5. Cost optimization opportunities

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)