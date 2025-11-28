import { ProverbesService } from './proverbes.service';
import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';
export declare class ProverbesController {
    private readonly proverbesService;
    constructor(proverbesService: ProverbesService);
    create(createProverbeDto: CreateProverbeDto): Promise<import("./entities/proverbe.entity").Proverbe>;
    findAll(): Promise<import("./entities/proverbe.entity").Proverbe[]>;
    findOne(id: number): Promise<import("./entities/proverbe.entity").Proverbe | null>;
    update(id: string, updateProverbeDto: UpdateProverbeDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
