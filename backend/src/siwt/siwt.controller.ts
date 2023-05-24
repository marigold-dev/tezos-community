import { Body, Controller, Post } from '@nestjs/common';

@Controller('signin')
export class SiwtController {
  @Post()
  async signin(
    @Body('pk') pk: string,
    @Body('pkh') pkh: string,
    @Body('signature') signature: string,
  ) {
    return;
  }
}
