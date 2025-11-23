import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';
export declare class ProverbesService {
    create(createProverbeDto: CreateProverbeDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateProverbeDto: UpdateProverbeDto): string;
    remove(id: number): string;
}
