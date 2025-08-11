import { Login } from '../models';
import { ServiceResult } from './service.result';

export class LoginService {

    static async getAllLogins(): Promise<ServiceResult<Login[]>> {
        try {
            const logins = await Login.findAll({
                attributes: ['id', 'loginName']
            });
            return ServiceResult.success(logins);
        } catch (error) {
            return ServiceResult.failed();
        }
    }
} 