import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
export declare class SuggestionsController {
    private readonly suggestionsService;
    constructor(suggestionsService: SuggestionsService);
    create(createSuggestionDto: CreateSuggestionDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSuggestionDto: UpdateSuggestionDto): string;
    remove(id: string): string;
}
