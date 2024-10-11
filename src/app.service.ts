import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(req): any {
    
    return {
      req:req.userId
    };
  }
}
