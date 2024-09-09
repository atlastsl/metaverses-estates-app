

export interface PaginationResponseDto {
    page: number;
    take: number;
    next_page?: number;
    previous_page?: number;
    total: number;
}

export interface PaginationPayloadDto {
    page?: number;
    take?: number;
}

export interface DisplayText {
    lang: string;
    value: string;
}

export interface OIDictionary {
    [type: string]: DisplayText[]
}