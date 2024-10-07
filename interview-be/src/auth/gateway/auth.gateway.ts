import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({})
export class AuthGateway {
    // Lưu trữ socket của từng người dùng, mỗi 1 người dùng chỉ được tạo ra 1 socket duy nhất để đăng nhập
    private userSockets: { [userId: string]: Socket } = {}

    constructor(
        private usersService: UsersService,
        private jwtServive: JwtService,
    ) {}

    @SubscribeMessage('login')
    async handleLogin(client: Socket, { email, password }: { email: string; password: string }) {
        try {
            const user = await this.usersService.validateUser(email, password)
            
            // Thông báo cho các thiết bị cũ
            const existingSocket = this.userSockets[user.id]
            existingSocket?.emit(
                'loggedOutFromAnotherDevice', 
                { message: 'You have been logged out from another device!' })

            // Gắn userId vào socket để làm tính năng đăng xuất
            client.data.userId = user.id
            // gắn socket mới cho userId
            this.userSockets[user.id] = client
            // Tạo token
            const payload = { email: user.email, id: user.id, role: user.role }
            // const { access_token } = await this.authService.login(user)
            const access_token = this.jwtServive.sign(payload)
        
            // Cập nhật socket cho người dùng
            client.emit('loginSuccess', { access_token })
            
        } catch(error) {
            if (error instanceof UnauthorizedException) {
                client.emit('loginFailed', { message: error.message })
                return
            }
        
            throw new Error('An error occurred during user validation');
        }
    }

    @SubscribeMessage('logout')
    async handleLogout(client: Socket) {
        const userId = client.data.userId

        if(userId) {
            delete this.userSockets[userId]
            client.data.userId = null
            client.emit('logoutSuccess', { message: 'Logout successful!' });
        }else {
            client.emit('logoutFailed', { message: 'No login session found!' });
        }
    }
}
