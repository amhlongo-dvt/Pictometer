To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000


To register:
```sh
curl -X POST http://localhost:3000/api/v1/auth/register/ -H "Content-Type: application/json" -d "{\"email\": \"user@mail.com\", \"password\": \"pass\", \"name\": \"Test\"}" 
```
To login:
```sh
curl -X POST http://localhost:3000/api/v1/auth/login/ -H "Content-Type: application/json" -d "{\"email\": \"user@mail.com\", \"password\": \"pass\"}" 
```
To set token:
```sh
set JWT_TOKEN=your_actual_jwt_token_here  
```

To upload images:
```sh
curl -X POST `  -H "Content-Type: multipart/form-data" ` -H "Authorization: Bearer %JWT_TOKEN%" `   -F "file=@C:\path\to\image" `  http://localhost:3000/api/v1/images/     
```

To get all uploaded images:
```sh
curl -X GET http://localhost:3000/api/v1/images/ -H "Authorization: Bearer %JWT_TOKEN%"   
```




