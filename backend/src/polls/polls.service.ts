import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePollDto } from './dto/create-poll.dto';
import { Poll } from './poll.entity';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
  ) {}

  findAll(): Promise<Poll[]> {
    return this.pollRepository.find({ order: { createdAt: 'DESC' } });
  }

  async create(input: CreatePollDto): Promise<Poll> {
    const poll = this.pollRepository.create(input);
    return this.pollRepository.save(poll);
  }
}
