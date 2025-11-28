import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proverbe } from './entities/proverbe.entity';
import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';

@Injectable()
export class ProverbesService {
  constructor(
    @InjectRepository(Proverbe)
    private readonly repo: Repository<Proverbe>,
  ) {}

  async createOrReplace(dto: CreateProverbeDto) {
    const existing = await this.repo.findOne({ where: { id: 1 } });

    if (existing) {
      // UPDATE
      await this.repo.update(1, dto);
      return this.repo.findOneBy({ id: 1 });
    }

    // CREATE
    const data = this.repo.create({ ...dto, id: 1 });
    return this.repo.save(data);
  }

  findOne() {
    return this.repo.findOneBy({ id: 1 });
  }

  async update(dto: UpdateProverbeDto) {
    await this.repo.update(1, dto);
    return this.repo.findOneBy({ id: 1 });
  }

  async remove() {
    const proverbe = await this.repo.findOneBy({ id: 1 });
    if (!proverbe) {
      return null;
    }
    await this.repo.remove(proverbe);
    return proverbe;
  }
}
