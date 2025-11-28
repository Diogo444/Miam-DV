import { Injectable } from '@nestjs/common';
import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';
import { Repository } from 'typeorm';
import { Proverbe } from './entities/proverbe.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProverbesService {
  constructor(
    @InjectRepository(Proverbe)
    private readonly proverbesRepository: Repository<Proverbe>,
  ) {}

  create(createProverbeDto: CreateProverbeDto) {
    const data = this.proverbesRepository.create(createProverbeDto);
    return this.proverbesRepository.save(data);
  }

  findAll() {
    return this.proverbesRepository.find();
  }

  findOne(id: number) {
    return this.proverbesRepository.findOneBy({ id });
  }

  update(id: number, updateProverbeDto: UpdateProverbeDto) {
    return this.proverbesRepository.update(id, updateProverbeDto);
  }

  remove(id: number) {
    return this.proverbesRepository.delete(id);
  }
}
