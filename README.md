# SonicWall Management Microservice

## Common Configuration Issues and Solutions

### 1. Nginx Port Configuration
**Issue**: The frontend container must listen on port 80 for proper communication with the main Nginx reverse proxy.
**Solution**: 
- Use the provided `nginx.template.conf` as a base
- Ensure the `listen` directive is set to port 80
- Do not expose ports in docker-compose.yml as the service is accessed through the reverse proxy

### 2. Docker Network Configuration
**Issue**: The service must be on the same network as the main Nginx reverse proxy.
**Solution**:
- Use the external network configuration in docker-compose.yml
- Ensure the network name matches the main docker-compose network
- Do not expose unnecessary ports to the host

### 3. Environment Variables
**Issue**: API URLs and environment settings must be properly configured.
**Solution**:
- Set NODE_ENV=production for frontend
- Configure VITE_API_URL to match your domain and path structure
- Use secure database credentials

## Setup Instructions

1. Copy configuration templates:
   ```bash
   sudo cp nginx.template.conf nginx.conf
   sudo cp docker-compose.template.yml docker-compose.yml
   sudo chown $USER:$USER nginx.conf docker-compose.yml
   ```

2. Update configurations:
   - Modify nginx.conf if needed (default configuration should work)
   - Update docker-compose.yml with your environment-specific settings

3. Build and start the services:
   ```bash
   docker compose up -d
   ```

## Integration with Main Nginx Reverse Proxy

The SonicWall frontend is accessed through the main Nginx reverse proxy at the `/app/sonicwall/` path. The reverse proxy handles:
- SSL termination
- Path-based routing
- Security headers
- CORS configuration

## Development Notes

- The backend development volume (`./backend:/app`) should be removed in production
- Update database credentials in production
- Consider implementing health checks
- Monitor Nginx logs for connection issues

## File Permissions

When working with configuration files:
1. Always use `sudo` when creating new files
2. Set appropriate ownership after creation:
   ```bash
   sudo chown $USER:$USER <filename>
   ```
3. Keep sensitive files out of version control (see .gitignore)