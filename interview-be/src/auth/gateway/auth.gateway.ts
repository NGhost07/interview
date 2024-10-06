import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../auth.service';

@WebSocketGateway({})
export class AuthGateway {
    // Lưu trữ socket của từng người dùng, mỗi 1 người dùng chỉ được tạo ra 1 socket duy nhất để đăng nhập
    private userSockets: { [userId: string]: Socket } = {}

    constructor(private authService: AuthService) {}

    @SubscribeMessage('login')
    async handleLogin(client: Socket, { email, password }: { email: string; password: string }) {
        const user = await this.authService.validateUser(email, password)
        if (user === null) {
            client.emit('loginFailed', { message: 'Incorrect email or password' })
            return
        }
  
        // Thông báo cho các thiết bị cũ
        const existingSocket = this.userSockets[user.id]
        if (existingSocket) {
            existingSocket.emit('loggedOutFromAnotherDevice', { message: 'You have been logged out from another device!' })
        }

        // Gắn userId vào socket để làm tính năng đăng xuất
        client.data.userId = user.id
        // gắn socket mới cho userId
        this.userSockets[user.id] = client

        // Tạo token
        const { access_token } = await this.authService.login(user)
      
        // Cập nhật socket cho người dùng
        client.emit('loginSuccess', { access_token })
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
