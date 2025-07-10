# Heroku Deployment Guide

This guide walks you through deploying the Patients Management System to Heroku.

## Prerequisites

1. **Heroku CLI**: Install from [https://devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)
2. **Git**: Ensure Git is installed and configured
3. **Heroku Account**: Sign up at [https://signup.heroku.com](https://signup.heroku.com)

## Backend Deployment

### 1. Create Heroku App for Backend

```bash
# Navigate to backend directory
cd backend

# Login to Heroku
heroku login

# Create new Heroku app
heroku create your-app-name-backend

# Add PostgreSQL database
heroku addons:create heroku-postgresql:mini --app your-app-name-backend
```

### 2. Configure Environment Variables

```bash
# Set JWT secret
heroku config:set JWT_SECRET="your-super-secret-jwt-key-here" --app your-app-name-backend

# Set Node environment
heroku config:set NODE_ENV="production" --app your-app-name-backend

# Set port (optional, Heroku sets this automatically)
heroku config:set PORT=3001 --app your-app-name-backend
```

### 3. Deploy Backend

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial backend deployment"

# Add Heroku remote
heroku git:remote -a your-app-name-backend

# Deploy
git push heroku main
```

### 4. Seed Database (Optional)

```bash
# Run seed script on Heroku
heroku run npm run seed --app your-app-name-backend
```

## Frontend Deployment

### 1. Create Heroku App for Frontend

```bash
# Navigate to frontend directory
cd frontend

# Create new Heroku app
heroku create your-app-name-frontend

# Add Node.js buildpack
heroku buildpacks:add heroku/nodejs --app your-app-name-frontend
```

### 2. Configure Environment Variables

```bash
# Set API URL to your backend Heroku app
heroku config:set NEXT_PUBLIC_API_URL="https://your-app-name-backend.herokuapp.com/api" --app your-app-name-frontend

# Set Node environment
heroku config:set NODE_ENV="production" --app your-app-name-frontend
```

### 3. Deploy Frontend

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial frontend deployment"

# Add Heroku remote
heroku git:remote -a your-app-name-frontend

# Deploy
git push heroku main
```

## Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3001` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key` |
| `DATABASE_URL` | PostgreSQL connection string | Set automatically by Heroku |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://your-app-backend.herokuapp.com/api` |

## Verification

### Backend Verification

1. **Check API Health**:
   ```bash
   curl https://your-app-name-backend.herokuapp.com/api/auth/profile
   ```

2. **Test Registration**:
   ```bash
   curl -X POST https://your-app-name-backend.herokuapp.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "firstName": "Test",
       "lastName": "User",
       "password": "password123",
       "role": "user"
     }'
   ```

### Frontend Verification

1. Open your frontend app URL: `https://your-app-name-frontend.herokuapp.com`
2. Test login/registration functionality
3. Verify patient management features

## Database Management

### View Database Data

```bash
# Connect to PostgreSQL
heroku pg:psql --app your-app-name-backend

# List tables
\dt

# View users
SELECT * FROM "user";

# View patients
SELECT * FROM "patient";

# Exit
\q
```

### Reset Database

```bash
# Reset database
heroku pg:reset --app your-app-name-backend

# Re-run migrations (handled automatically on next deploy)
# Re-seed database
heroku run npm run seed --app your-app-name-backend
```

## Monitoring and Logs

### View Application Logs

```bash
heroku logs --tail --app your-app-name-backend

heroku logs --tail --app your-app-name-frontend
```

### Monitor Performance

```bash
heroku ps --app your-app-name-backend
heroku ps --app your-app-name-frontend

heroku info --app your-app-name-backend
heroku info --app your-app-name-frontend
```

## Custom Domain (Optional)

### Add Custom Domain

```bash
heroku domains:add api.yourdomain.com --app your-app-name-backend

heroku domains:add www.yourdomain.com --app your-app-name-frontend

heroku domains --app your-app-name-backend
```

## SSL Certificate (Optional)

```bash
heroku addons:create ssl:endpoint --app your-app-name-backend
heroku addons:create ssl:endpoint --app your-app-name-frontend
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check `package.json` for correct dependencies
   - Verify Node.js version compatibility
   - Check build logs: `heroku logs --tail --app your-app-name`

2. **Database Connection Issues**:
   - Verify `DATABASE_URL` is set
   - Check PostgreSQL addon status: `heroku addons --app your-app-name-backend`

3. **CORS Issues**:
   - Ensure frontend URL is configured in backend CORS settings
   - Check `NEXT_PUBLIC_API_URL` in frontend

4. **Authentication Issues**:
   - Verify `JWT_SECRET` is set and secure
   - Check token expiration settings

### Useful Commands

```bash
# Restart app
heroku restart --app your-app-name

# Scale dynos
heroku ps:scale web=1 --app your-app-name

# Run one-off commands
heroku run bash --app your-app-name

# View configuration
heroku config --app your-app-name
```

## Cost Optimization

### Free Tier Limitations

- **Dynos**: Sleep after 30 minutes of inactivity
- **Database**: 10k rows limit on hobby-dev plan
- **Hours**: 550 free dyno hours per month

### Optimization Tips

1. **Use Hobby Dynos** for production ($7/month each)
2. **Upgrade Database** to hobby-basic for more rows
3. **Use CDN** for static assets
4. **Implement Caching** to reduce database queries

## Production Checklist

- [ ] Environment variables configured
- [ ] Database seeded with admin user
- [ ] API endpoints tested
- [ ] Frontend connects to backend
- [ ] Authentication flow works
- [ ] CRUD operations functional
- [ ] Error handling implemented
- [ ] Logs monitored
- [ ] Performance optimized
- [ ] Security best practices applied

## Security Considerations

1. **JWT Secret**: Use a strong, random secret
2. **Database**: Use connection pooling
3. **CORS**: Configure allowed origins
4. **HTTPS**: Ensure all communications are encrypted
5. **Input Validation**: Validate all user inputs
6. **Rate Limiting**: Implement rate limiting for API endpoints

## Maintenance

### Regular Tasks

1. **Monitor Logs**: Check for errors and performance issues
2. **Update Dependencies**: Keep packages up to date
3. **Database Backups**: Regular backups (automatic with Heroku Postgres)
4. **Security Updates**: Monitor for security vulnerabilities
5. **Performance Monitoring**: Track response times and resource usage

### Updating Applications

```bash
# Update backend
cd backend
git add .
git commit -m "Update backend"
git push heroku main

# Update frontend
cd frontend
git add .
git commit -m "Update frontend"
git push heroku main
```

## Support

For issues specific to this deployment:
1. Check the troubleshooting section
2. Review Heroku documentation
3. Check application logs
4. Verify environment variables
5. Test locally first

For Heroku-specific issues:
- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Heroku Support](https://help.heroku.com/)
- [Heroku Status](https://status.heroku.com/) 