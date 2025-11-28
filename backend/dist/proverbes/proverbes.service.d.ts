import { Repository } from 'typeorm';
import { Proverbe } from './entities/proverbe.entity';
import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';
export declare class ProverbesService {
    private readonly repo;
    constructor(repo: Repository<Proverbe>);
    createOrReplace(dto: CreateProverbeDto): Promise<Proverbe | null>;
    findOne(): Promise<Proverbe | null>;
    update(dto: UpdateProverbeDto): Promise<Proverbe | null>;
    remove(): Promise<Proverbe | null>;
}
