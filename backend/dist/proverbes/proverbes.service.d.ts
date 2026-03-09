import { Repository } from 'typeorm';
import { Proverbe } from './entities/proverbe.entity';
import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';
import { ProverbeSuggered } from './entities/proverbe_suggered.entity';
export declare class ProverbesService {
    private readonly repo;
    private readonly suggeredRepo;
    constructor(repo: Repository<Proverbe>, suggeredRepo: Repository<ProverbeSuggered>);
    createOrReplace(dto: CreateProverbeDto): Promise<{
        message: string;
        proverbe: Proverbe | null;
    }>;
    findOne(): Promise<Proverbe | null>;
    findSuggested(): Promise<ProverbeSuggered>;
    update(dto: UpdateProverbeDto): Promise<Proverbe | null>;
    remove(): Promise<Proverbe | null>;
}
