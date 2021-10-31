## URL Monitoring App
Node app for uptime monitoring for websites

## User Features
1. Sign up
2. Verify email
3. Sign in
4. Create, Update and Delete checks
5. Receive check monitor results on Email and/or specified webhook

## URLs
1. Auth:
    1. post "{{server_url}}/auth/signup" - user sign up
    2. post "{{server_url}}/auth/signin" - user sign in
    3. get "{{server_url}}/verify/email" - email verification link

2. Check:
    1. post "{{server_url}}/check/" - create a check
    2. get "{{server_url}}/:name" - get and start monitoring a check by name
    3. get "{{server_url}}/bulk/:tag" - get and start monitoring a group of checks by tag
    4. put "{{server_url}}/:id" - update a check
    5. delete "{{server_url}}/:id" - delete a check

## Built With
1. Nodejs
2. MongoDB