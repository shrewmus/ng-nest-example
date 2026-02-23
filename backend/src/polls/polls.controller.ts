import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreatePollDto } from './dto/create-poll.dto';
import { Poll } from './poll.entity';
import { PollsService } from './polls.service';

@Controller('polls')
@UseGuards(JwtAuthGuard)
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Get()
  getPolls(): Promise<Poll[]> {
    return this.pollsService.findAll();
  }

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  createPoll(@Body() createPollDto: CreatePollDto): Promise<Poll> {
    return this.pollsService.create(createPollDto);
  }
}
