import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
export declare class SuggestionsService {
    create(createSuggestionDto: CreateSuggestionDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSuggestionDto: UpdateSuggestionDto): string;
    remove(id: number): string;
}
