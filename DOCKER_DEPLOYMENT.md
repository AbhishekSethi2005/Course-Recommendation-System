# CourseIQ – Production Docker Deployment Guide

This guide provides instructions for building, running, managing, and deploying **CourseIQ** using Docker and Docker Compose on both **Windows (Local Development & Testing)** and **Linux VPS (Production Hosting with Domain & HTTPS)**.

---

## 1. Architecture Overview

CourseIQ runs as an isolated, multi-container system orchestrated by Docker Compose:

```
                  ┌──────────────────────────────────────────────┐
                  │                 Public Internet              │
                  └──────────────────────┬───────────────────────┘
                                         │ Port 80 / 443
                                         ▼
                     ┌───────────────────────────────────────┐
                     │          Nginx Reverse Proxy          │
                     │          (courseiq-nginx:80)          │
                     └───────────┬───────────────┬───────────┘
                                 │               │
                 / (SPA & Assets)│               │ /api/, /similar, /recommend
                                 ▼               ▼
        ┌────────────────────────────┐       ┌────────────────────────────┐
        │      Frontend Service      │       │      Backend Service       │
        │    (courseiq-frontend:80)  │       │    (courseiq-backend:5000) │
        │     React + Vite Bundle    │       │   Flask + Gunicorn + ML    │
        └────────────────────────────┘       └─────────────┬──────────────┘
                                                           │
                                                           ▼ Persistent Volume
                                                 ┌───────────────────┐
                                                 │   courseiq_data   │
                                                 │   (/app/data)     │
                                                 └───────────────────┘
```

* **Frontend Container (`courseiq-frontend`)**: Multi-stage build (Node 20 Alpine $\to$ Nginx Alpine) serving the optimized React SPA with client-side routing fallback.
* **Backend Container (`courseiq-backend`)**: Python 3.11 with Gunicorn (2 workers, 4 threads), Scikit-Learn recommendation models, pre-cached NLTK datasets, and OpenAI chatbot integration.
* **Gateway Container (`courseiq-nginx`)**: Public entrypoint managing reverse proxying, CORS, request timeouts (180s for AI streaming), Gzip compression, and security headers.
* **Persistent Named Volume (`courseiq_data`)**: Keeps `user_library.json` and `search_history.json` safe across container restarts and updates.

---

## 2. Windows Quick Start (Command Prompt / CMD)

### Step 1: Ensure Docker Desktop is Running
Make sure Docker Desktop is launched and shows **"Engine running"** in your Windows system tray.

To check Docker version in CMD:
```cmd
docker --version
docker compose version
```

### Step 2: Configure Environment Variables
Copy the `.env.example` file to `.env`:
```cmd
copy .env.example .env
```

Open `.env` in Notepad:
```cmd
notepad .env
```
Fill in your OpenAI API Key:
```env
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
OPENAI_MODEL=gpt-4o-mini
PORT=5000
DATA_DIR=/app/data
```
*(Save and close Notepad).*

### Step 3: Build and Run All Services
Run a single command to build the images and launch the containers in the background:
```cmd
docker compose up -d --build
```

### Step 4: Verify Running Services
```cmd
docker compose ps
```
You will see three healthy containers:
```
NAME                IMAGE                COMMAND                  SERVICE    STATUS
courseiq-backend    ...-backend          "gunicorn --bind 0.0…"   backend    Up (healthy)
courseiq-frontend   ...-frontend         "nginx -g 'daemon of…"   frontend   Up (healthy)
courseiq-nginx      ...-nginx            "nginx -g 'daemon of…"   nginx      Up (healthy)
```

### Step 5: Open CourseIQ in Your Browser
Open your browser and navigate to:
```
http://localhost
```
All features (AI Course Recommendations, Multi-Turn Assistant Chatbot, Library Bookmarking, and Search History) are live.

---

## 3. Essential Windows Management Commands

| Action | Windows CMD Command |
| :--- | :--- |
| **Start containers** | `docker compose up -d` |
| **Stop containers** | `docker compose stop` |
| **Stop and remove containers** | `docker compose down` |
| **Rebuild and restart** | `docker compose up -d --build` |
| **View all live logs** | `docker compose logs -f` |
| **View backend logs only** | `docker compose logs -f backend` |
| **View frontend logs only** | `docker compose logs -f frontend` |
| **View gateway logs only** | `docker compose logs -f nginx` |
| **Check container health** | `docker compose ps` |
| **Inspect volume storage** | `docker volume inspect courseiq_data` |

---

## 4. Persistent JSON Storage (Backup & Restore)

User library bookmarks (`user_library.json`) and previous searches (`search_history.json`) are stored in the `courseiq_data` Docker volume.

### Creating a Backup (Windows CMD)
To back up your data to a compressed `.tar.gz` archive in your current folder:
```cmd
docker run --rm -v courseiq_data:/data -v "%cd%":/backup alpine tar czf /backup/courseiq_backup_%date:~-4,4%%date:~-7,2%%date:~-10,2%.tar.gz -C /data .
```

### Restoring from Backup (Windows CMD)
To restore saved data from a backup archive:
```cmd
docker run --rm -v courseiq_data:/data -v "%cd%":/backup alpine sh -c "tar xzf /backup/courseiq_backup_*.tar.gz -C /data"
```

---

## 5. Local Hot-Reload Development (Optional)

If you are developing features and want instant code hot-reloading without rebuilding images:

```cmd
docker compose -f docker-compose.dev.yml up --build
```
* React dev server: `http://localhost:5173` (with Vite HMR)
* Flask dev server: `http://localhost:5000` (with debug auto-reload)

---

## 6. Linux VPS Production Deployment (Domain & HTTPS)

To deploy CourseIQ to a production server (Ubuntu 22.04 / 24.04 LTS on AWS, DigitalOcean, Hetzner, Linode, etc.):

### Step 1: Install Docker & Docker Compose on VPS
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Add Docker official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up repository
echo "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
"$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Step 2: Clone Repository & Configure Environment
```bash
git clone <your-repo-url> /opt/courseiq
cd /opt/courseiq

# Copy and edit production environment variables
cp .env.example .env
nano .env
```
Set your `OPENAI_API_KEY` and save (`Ctrl+O`, `Enter`, `Ctrl+X`).

### Step 3: Point Domain DNS
In your DNS registrar (Cloudflare, Namecheap, GoDaddy, etc.):
* Create an **A Record**: `courseiq.example.com` $\to$ `<Your_VPS_Public_IP>`

### Step 4: Obtain Free SSL Certificate (Certbot / Let's Encrypt)
```bash
# Install certbot
sudo apt-get install -y certbot

# Request certificate using standalone authenticator (ensure port 80 is temporarily free)
sudo certbot certonly --standalone -d courseiq.example.com
```
Your certificates will be stored at:
`/etc/letsencrypt/live/courseiq.example.com/fullchain.pem`
`/etc/letsencrypt/live/courseiq.example.com/privkey.pem`

### Step 5: Enable SSL in Nginx
Mount the certificate directory into the `nginx` service in `docker-compose.yml`:
```yaml
  nginx:
    # ...
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
```
Uncomment the HTTPS server block in `nginx/nginx.conf` and update `courseiq.example.com` with your actual domain name.

### Step 6: Start Production Services
```bash
sudo docker compose up -d --build
```

### Step 7: Automated SSL Renewal
Add a cron job to automatically renew SSL certificates:
```bash
sudo crontab -e
```
Add line:
```cron
0 3 * * * certbot renew --post-hook "docker compose -f /opt/courseiq/docker-compose.yml exec nginx nginx -s reload"
```

---

## 7. Troubleshooting

### Port 80 Already in Use
If another service (like IIS or Apache) is using port 80 on Windows:
```cmd
netstat -ano | findstr :80
```
Change the host port mapping in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"
```
Then access CourseIQ at `http://localhost:8080`.

### Backend Exits with Memory Limit
The TF-IDF similarity matrix is ~93MB. Ensure Docker Desktop has at least **2GB RAM** allocated in **Settings > Resources > Advanced**.

### Chatbot Returns Fallback Response
If the OpenAI API key has expired or has no remaining credits, CourseIQ Assistant automatically and seamlessly switches to the local Educational & Knowledge Fallback Engine without crashing. Check logs via:
```cmd
docker compose logs backend
```
Verify your API balance at [platform.openai.com](https://platform.openai.com/settings/organization/billing).

