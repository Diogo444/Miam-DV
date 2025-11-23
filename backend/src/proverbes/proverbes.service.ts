import { Injectable } from '@nestjs/common';
import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';

@Injectable()
export class ProverbesService {
  create(createProverbeDto: CreateProverbeDto) {
    return 'This action adds a new proverbe';
  }

  findAll() {
    return `This action returns all proverbes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proverbe`;
  }

  update(id: number, updateProverbeDto: UpdateProverbeDto) {
    return `This action updates a #${id} proverbe`;
  }

  remove(id: number) {
    return `This action removes a #${id} proverbe`;
  }
}
