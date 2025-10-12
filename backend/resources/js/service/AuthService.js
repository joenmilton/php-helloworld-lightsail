import api from './api';

class AuthService {
    logout() {
        return api.post('/admin/logout');
    }
}

export default new AuthService(); 