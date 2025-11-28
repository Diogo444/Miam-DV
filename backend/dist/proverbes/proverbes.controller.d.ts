import { ProverbesService } from './proverbes.service';
import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';
export declare class ProverbesController {
    private readonly proverbesService;
    constructor(proverbesService: ProverbesService);
    createOrReplace(dto: CreateProverbeDto): Promise<import("./entities/proverbe.entity").Proverbe | null>;
    update(dto: UpdateProverbeDto): Promise<import("./entities/proverbe.entity").Proverbe | null>;
    findOne(): Promise<import("./entities/proverbe.entity").Proverbe | null>;
    remove(): Promise<import("./entities/proverbe.entity").Proverbe | null>;
}
