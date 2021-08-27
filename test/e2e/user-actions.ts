it('/users (GET)', () => {
    return request(app.getHttpServer())
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(mockUsers);
});

it('/users/create (POST)', () => {
    const dto: CreateUserDto = {
        profile_image: 'undefined',
        email: 'mockUser@gmail.com',
        first_name: 'Mock',
        last_name: 'User',
        password: 'Mock123!',
        confirm_password: 'Mock123!'
    };
    return request(app.getHttpServer())
        .post('/users/create')
        .send(dto)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(res => {
            expect(res.body).toEqual({
                user: {
                    id: expect.any(Number),
                    email: 'mockUser@gmail.com',
                    first_name: 'Mock',
                    last_name: 'User',
                    profile_image: 'undefined'
                },
                access_token: expect.any(String)
            })
        });
});

it('/users/create (POST) --> 400 on validation error', () => {
    const dto = {
        profile_image: 123,
        email: 'mockUser@gmail.com',
        first_name: 'Mock',
        last_name: 'User',
        password: 'Mock123!',
        confirm_password: 'Mock123!'
    };
    return request(app.getHttpServer())
        .post('/users/create')
        .send(dto)
        .expect('Content-Type', /json/)
        .expect(400, {
            statusCode: 400,
            message: 'Error creating a user',
            error: 'Bad Request'
        });
});