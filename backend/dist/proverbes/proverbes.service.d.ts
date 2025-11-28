import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';
import { Repository } from 'typeorm';
import { Proverbe } from './entities/proverbe.entity';
export declare class ProverbesService {
    private readonly proverbesRepository;
    constructor(proverbesRepository: Repository<Proverbe>);
    create(createProverbeDto: CreateProverbeDto): Promise<Proverbe>;
    findAll(): Promise<Proverbe[]>;
    findOne(id: number): Promise<Proverbe | null>;
    update(id: number, updateProverbeDto: UpdateProverbeDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
